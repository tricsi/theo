onload = function () {

    class Instrument {

        constructor(ctx, type, destination) {
            this.ctx = ctx;
            this.type = type;
            this.dest = destination || ctx.destination;
        }

        init() {
            let ctx = this.ctx,
                vol = ctx.createGain(),
                osc = ctx.createOscillator();
            vol.gain.value = 1;
            vol.connect(this.dest);
            osc.frequency.value = 0;
            osc.connect(vol);
            osc.type = this.type;
            osc.start();
            this.osc = osc;
            this.vol = vol;
        }

        form(curve, time) {
            this.volCurve = new Float32Array(curve);
            this.volTime = time;
            return this;
        }

        play(freq, length, startTime) {
            if (!this.osc) {
                this.init();
            }
            let ctx = this.ctx,
                osc = this.osc,
                vol = this.vol,
                start = ctx.currentTime;
            if (startTime) {
                start += startTime;
            }
            vol.gain.cancelScheduledValues(start);
            if (this.volCurve && this.volTime) {
                vol.gain.setValueCurveAtTime(this.volCurve, start, length);
            }
            osc.frequency.cancelScheduledValues(start);
            if (freq instanceof Array) {
                osc.frequency.setValueCurveAtTime(new Float32Array(freq), start, length);
            } else {
                osc.frequency.setValueAtTime(freq, start);
            }
            osc.frequency.setValueAtTime(0, start + length);
            return this;
        }

        stop() {
            if (this.osc) {
                this.osc.stop();
                this.osc = null;
                this.gain = null;
            }
        }

        clone() {
            let clone = new Instrument(this.ctx, this.osc.type, this.dest);
            if (this.volCurve && this.volTime) {
                clone.form(this.volCurve, this.volTime);
            }
            return clone;
        }

    }

    class Channel {

        constructor(instrument, notes, tempo) {
            this.insts = [instrument];
            this.notes = notes.split(",");
            this.tempo = tempo || 1;
            this.playing = false;
            if (!Channel.keys) {
                Channel.keys = {c:0, db:1, d:2, eb:3, e:4, f:5, gb:6, g:7, ab:8, a:9, bb:10, b:11};
                Channel.freqs = [];
                let a = Math.pow(2, 1/12);
                for (let n=-57; n<50; n++) {
                    Channel.freqs.push(Math.round(Math.pow(a, n) * 44000) / 100);
                }
            }
        }

        inst(num) {
            num = num || 0;
            while (this.insts.length <= num) {
                this.insts.push(this.insts[0].clone());
            }
            return this.insts[num];
        }

        play(start) {
            if (this.playing) {
                this.stop();
            }
            this.playing = true;
            start = start || 0;
            for (let i = 0; i < this.notes.length; i++) {
                let note = this.notes[i];
                let time = note.match(/^(\d+)/);
                if (time) {
                    let length = this.tempo / parseInt(time[1]);
                    let freqs = note.match(/([a-z]+\d+)/g);
                    if (freqs) {
                        for (let j = 0; j < freqs.length; j++) {
                            let freq = freqs[j].match(/([a-z]+)(\d+)/);
                            let index = parseInt(freq[2]) * 12 + Channel.keys[freq[1]];
                            this.inst(j).play(Channel.freqs[index], length, start);
                        }
                    }
                    start += length;
                }
            }
        }

        stop() {
            this.insts.forEach((inst) => inst.stop());
            this.playing = false;
        }

    }

    class Song {

        constructor(tempo, ctx) {
            ctx = ctx || new AudioContext();
            let master = ctx.createGain();
            master.connect(ctx.destination);
            this.ctx = ctx;
            this.tempo = tempo;
            this.master = master;
            this.mixer = [];
            this.channels = [];
        }

        add(notes, type, curve, time) {
            let gain = this.ctx.createGain(),
                inst = new Instrument(this.ctx, type || "sine", gain),
                channel = new Channel(inst, notes, this.tempo);
            if (curve && time) {
                inst.form(curve, time);
            }
            gain.connect(this.master);
            this.mixer.push(gain);
            this.channels.push(channel);
            return this;
        }

        play() {
            this.channels.forEach((channel) => channel.play());
        }

        stop() {
            this.channels.forEach((channel) => channel.stop());
        }
    }

    const song = new Song(1.3).add(
        //sax
        "1,4," +
        "1,4," +
        "1,4," +
        "2,4,8b4,8e5,8g5,8a5," +
        "8bb5,8b5,8bb5,8a5,4e5,4b4,4d5," + 
        "2e5,4,16gb5,16g5,16gb5,16e5,4d5," +
        "2e5,4,16d5,16e5,16d5,16b4,4a4," +
        "2b4,4,8b4,8e5,8g5,8a5," +
        "8bb5,8b5,8bb5,8a5,4e5,4b4,4d5," + 
        "2e5,4,16d5,16e5,16d5,16b4,4a4," + 
        "2b4,4,16gb5,16g5,16gb5,16e5,4d5," +
        "1e5,4," +
        "8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6," +
        "8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5," +
        "8c6,4e6,8c6,4a5,8gb5,8g5,8a5,8bb5," +
        "8b5,8bb5,8b5,8c6,4d6,8d6,8db6,8d6,8eb6," +
        "8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6," +
        "8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5," +
        "8c6,4e6,8c6,4a5,8gb5,8a5,8d6,8c6," +
        "2b5,4,8b4,8e5,8g5,8a5," +
        "8bb5,8b5,8bb5,8a5,4e5,4b4,4d5," + 
        "2e5,4,16gb5,16g5,16gb5,16e5,4d5," +
        "2e5,4,16d5,16e5,16d5,16b4,4a4," +
        "2b4,4,8b4,8e5,8g5,8a5," +
        "8bb5,8b5,8bb5,8a5,4e5,4b4,4d5," + 
        "2e5,4,16d5,16e5,16d5,16b4,4a4," + 
        "2b4,4,16gb5,16g5,16gb5,16e5,4d5," +
        "1e5,4",
        "square",
        [.8, .5],
        .2
    ).add(
        //piano
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8c3,4g3b3e4,8e3,4e3,4gb3,4g3b3e4," +
        "8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4," +
        "8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4," +
        "8g2,4gb3b3d4,8g2,4g2,4b2,4gb3a3d4," +
        "8c3,4g3c4e4,8e3,4e3,4gb3,4g3c4e4," +
        "8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4," +
        "8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4," +
        "8gb2,4gb3a3e4,8gb2,4gb3a3e4,4b2,4gb3a3db4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4," +
        "8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4",
        "sine",
        [.8, .5],
        .2
    ).add(
        //bass
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "4c2,1,"+
        "4b1,1,"+
        "4a1,1,"+
        "4b1,2,4g1,4b1,"+
        "4c2,1,"+
        "4b1,1,"+
        "4a1,1,"+
        "4gb1,2,4b1,4,"+
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1," +
        "2e2,4e2,4b2,4b1",
        "triangle",
        [.8, .5],
        .2
    );

    document.getElementById("play").addEventListener("click", function() {
        song.play();
    }, false);
    document.getElementById("stop").addEventListener("click", function() {
        song.stop();
    }, false);
    document.getElementById("master").addEventListener("change", function() {
        song.master.gain.value = parseInt(this.value) / 100;
    }, false);
    document.getElementById("mixer0").addEventListener("change", function() {
        song.mixer[0].gain.value = parseInt(this.value) / 100;
    }, false);
    document.getElementById("mixer1").addEventListener("change", function() {
        song.mixer[1].gain.value = parseInt(this.value) / 100;
    }, false);
    document.getElementById("mixer2").addEventListener("change", function() {
        song.mixer[2].gain.value = parseInt(this.value) / 100;
    }, false);
};