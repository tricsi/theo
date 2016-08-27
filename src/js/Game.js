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

    pos(x, y) {
        return new Vec(x, y)
            .multiply(this.grid)
            .add(this.margin);
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
            room,
            mobs = [],
            text = [],
            rows = this.cfg[index].split("|");
        rows.forEach((row) => {
            let cmd = row.substr(0, 1),
                val = row.substr(1).split(",").map(parseFloat);
            switch (cmd) {
            case "H":
                hero = new Hero(this.pos(val[0], val[1]).sub(36, 12));
                break;
            case "R":
                room = new Room(val, this.grid, this.margin);
                break;
            case "D":
                door = new Door(
                    this.pos(val[0], val[1]).sub(36, 12), 
                    val.length > 2 ? this.pos(val[2], val[3]).sub(36, 12) : null
                );
                break;
            case "C":
                mobs.push(new Cog(
                    this.pos(val[0], val[1]).sub(36, 16),
                    val.length > 2 ? this.pos(val[2], val[3]).sub(36, 16) : null
                ));
                break;
            case "E":
                mobs.push(new Evil(this.pos(val[0], val[1]).sub(36, 36)));
                break;
            case "#":
                text.push(row.substr(1));
                break;
            }
        });
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