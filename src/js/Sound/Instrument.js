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
