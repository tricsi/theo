/// <reference path="waa.d.ts" />
onload = function () {

    class Instrument {

        constructor(ctx, type, curve, time) {
            this.ctx = ctx;
            this.type = type;
            this.curve = curve;
            this.time = time;
        }

        play(freq, time, onended) {
            let ctx = this.ctx,
                gain = ctx.createGain(),
                osc = ctx.createOscillator();
            gain.connect(ctx.destination);
            if (this.curve) {
                gain.gain.setValueCurveAtTime(new Float32Array(this.curve), ctx.currentTime, .3);
            }
            osc = ctx.createOscillator();
            osc.type = this.type;
            osc.connect(gain);
            osc.frequency.value = freq;
            osc.onended = onended;
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + time);
        }

    }

    var ctx = new AudioContext(),
        inst = new Instrument(ctx, "sine", [.3, 1, .7]);

    inst.play(220, 1, (e) => {
        inst.play(440, 1);
    });
};