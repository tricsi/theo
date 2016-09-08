class Game {

    constructor(draw, config) {
        let match = location.search.match(/^\?(\d+)$/);
        this.store = JSON.parse(localStorage.getItem("theos") || "{\"time\": 0,\"index\":0}");
        this.index = parseInt(match ? match[1] : store.index);
        this.draw = draw;
        this.cfg = config;
        this.grid = 72;
        this.margin = 40;
        Sfx.add("key", [0,,0.0354,,0.4903,0.4187,,0.3668,,,,,,0.5161,,0.4372,,,1,,,,,0.5])
            .add("slide", [3,0.52,1,,1,1,1,0.6599,,,,-1,,,,,,,0.44,,,0.66,0.5,0.4])
            .add("jump", [0,,0.123,,0.2154,0.301,,0.2397,,,,,,0.4311,,,,,1,,,0.1789,,0.46])
            .add("won", [2,0.005,0.18,0.13,0.44,0.51,,0.35,0.19,0.02,0.81,-0.8,0.89,0.44,,0.49,-0.78,-0.46,0.99,,-0.045,0.012,0.004,0.35])
            .add("lose", [1,0.003,0.03,0.02,0.87,0.25,,0.016,-0.16,,0.08,-0.36,0.067,,0.75,0.04,-0.75,0.001,0.73,-0.016,0.89,0.24,-0.19,0.5])
            .add("boss", [1,0.17,0.19,0.41,0.38,0.14,,0.001,0.001,,0.96,0.77,0.31,,0.077,0.66,0.5,0.64,0.99,0.04,0.38,0.05,0.0006,0.4])
            .add("cog", [0,,0.39,,,0.27,,,,0.53,0.72,,-0.8234,-0.0142,-0.0921,,,,1,,-0.0417,,,0.3]);
    }

    update() {
        this.scene.update();
    }

    render() {
        this.scene.render(this.draw);
    }

    pos(values, y, x) {
        if (values.length < 2) {
            return null;
        }
        let margin = this.margin,
            grid = this.grid;
        x = margin + (x || grid / 2);
        y = margin + (y || grid / 2);
        return new Vec(values.shift(), values.shift())
            .multiply(grid)
            .add(x, y);
    }

    next() {
        let store = this.store,
            scene = this.scene;
        store.time += scene.run;
        if (++this.index >= this.cfg.length) {
            this.index = 0;
            store.time = 0;
        }
        this.load();
        store.index = this.index;
        localStorage.setItem("theos", JSON.stringify(store));
    }

    load() {
        let hero,
            door,
            room = new Room(this.grid, this.margin),
            mobs = [],
            text = [],
            index = this.index,
            rows = this.cfg[index].split("|"),
            canvas = this.draw.ctx.canvas;
        rows.forEach((row) => {
            let cmd = row.substr(0, 1),
                val = row.substr(1).split(",").map(parseFloat);
            switch (cmd) {
            case "H":
                hero = new Hero(this.pos(val, 60), new Vec(canvas.width, canvas.height));
                if (val[0]) {
                    hero.turn();
                }
                break;
            case "M":
                room.map(val);
                break;
            case "G":
                room.glitch = val;
                break;
            case "D":
                door = new Door(this.pos(val, 60), this.pos(val, 60));
                break;
            case "C":
                mobs.push(new Cog(this.pos(val, 56), this.pos(val, 56)));
                break;
            case "E":
                mobs.push(new Evil(this.pos(val)));
                break;
            case "B":
                mobs.push(new Boss(this.pos(val)));
                break;
            case "R":
                mobs.push(new Rod(this.pos(val)));
                break;
            case "W":
                mobs.push(new Win(this.pos(val)));
                break;
            case "X":
                door = new Gate(this.pos(val), this.store.time);
                break;
            case "#":
                text.push(row.substr(1));
                break;
            }
        });
        Math.seed = index;
        this.scene = new Scene(hero, room, door, mobs, text);
    }

    tap() {
        let scene = this.scene,
            hero = scene.hero;
        if (scene.won) {
            this.next();
        } else if (!scene.run) {
            scene.start();
        } else if (hero.alive) {
            hero.jump();    
        } else {
            this.load();
        }
    }

}