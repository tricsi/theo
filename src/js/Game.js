class Game {

    constructor(draw, config) {
        this.draw = draw;
        this.cfg = config;
        this.grid = 72;
        this.margin = 40;
        this.index = 0;
    }

    update() {
        this.scene.update();
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
        let index = this.index + 1;
        if (index >= this.cfg.length) {
            index = 0;
        }
        this.load(index);
    }

    load(index) {
        let hero,
            door,
            room = new Room(this.grid, this.margin),
            mobs = [],
            text = [],
            rows = this.cfg[index].split("|");
        rows.forEach((row) => {
            let cmd = row.substr(0, 1),
                val = row.substr(1).split(",").map(parseFloat);
            switch (cmd) {
            case "H":
                hero = new Hero(this.pos(val, 60));
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
                mobs.push(new Cog(this.pos(val, 56), this.pos(val, 56)
                ));
                break;
            case "E":
                mobs.push(new Evil(this.pos(val)));
                break;
            case "B":
                mobs.push(new Boss(this.pos(val)));
                break;
            case "W":
                mobs.push(new Window(this.pos(val)));
                break;
            case "#":
                text.push(row.substr(1));
                break;
            }
        });
        Math.seed = index;
        this.index = index;
        this.scene = new Scene(hero, room, door, mobs, text);
    }

    tap() {
        let scene = this.scene,
            hero = scene.hero;
        if (scene.won) {
            this.next();
        } else if (!scene.run) {
            scene.run = true;
        } else if (hero.alive) {
            hero.jump();    
        } else {
            this.load(this.index);
        }
    }

}