class Sfx {
    
    static add(name, config) {
        const data = jsfxr(config);
        if (!Sfx.ctx) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            Sfx.ctx = new AudioContext();
            Sfx.buffer = {};
            Sfx.master = Sfx.ctx.createGain();
            Sfx.master.connect(Sfx.ctx.destination);
        }
        Sfx.ctx.decodeAudioData(data, (buffer) => {
            Sfx.buffer[name] = buffer;
        });
        return Sfx;
    }

    static play(name, loop) {
        if (!Sfx.buffer[name]) {
            return;
        }
        let source = Sfx.ctx.createBufferSource();
        source.mixer = Sfx.ctx.createGain();
        source.mixer.connect(Sfx.master);
        source.loop = loop || false;
        source.buffer = Sfx.buffer[name];
        source.connect(source.mixer);
        source.start(Sfx.ctx.currentTime);
        return source;
    }

}