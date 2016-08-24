class Song {

    constructor(tempo, volume, ctx) {
        ctx = ctx || new AudioContext();
        let master = ctx.createGain();
        master.connect(ctx.destination);
        master.gain.value = volume || .5;
        this.ctx = ctx;
        this.tempo = tempo;
        this.master = master;
        this.mixer = [];
        this.channels = [];
    }

    add(notes, type, curve, time) {
        let gain = this.ctx.createGain(),
            inst = new Instrument(this.ctx, type || "sine", gain),
            channel = new Channel(notes, this.tempo, inst);
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