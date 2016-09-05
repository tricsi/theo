class Sfx {
    
    constructor(config) {
        const data = jsfxr(config);
        if (!Sfx.ctx) {
            Sfx.ctx = new AudioContext();
            Sfx.master = Sfx.ctx.createGain();
            Sfx.master.connect(Sfx.ctx.destination);
        }
        this.mixer = Sfx.ctx.createGain();
        this.mixer.connect(Sfx.master);
        Sfx.ctx.decodeAudioData(data, (buffer) => {
            this.buffer = buffer;
        });
    }

    play(loop) {
        let source = Sfx.ctx.createBufferSource();
        source.loop = loop || false;
        source.buffer = this.buffer;
        source.connect(this.mixer);
        source.start(0);
        return source;
    }

}