class Channel {

    constructor(notes, tempo, instrument) {
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
