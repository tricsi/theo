class Game {

    constructor(config) {
        this.cfg = config;
    }

    load(index) {
        let hero,
            door,
            room,
            mobs = [],
            rows = this.cfg[index].split("|");
        rows.forEach((row) => {
            let cmd = row.substr(0, 1),
                val = row.substr(1).split(",").map(parseFloat);
            switch (cmd) {
            case "H":
                hero = new Hero(new Vec(val[0], val[1]));
                break;
            case "R":
                room = new Room(val, 72, 40);
                break;
            case "D":
                door = val.length > 2
                    ? new Door(new Vec(val[0], val[1]), new Vec(val[2], val[3]))
                    : new Door(new Vec(val[0], val[1]));
                break;
            case "C":
                mobs.push(val.length > 2
                    ? new Cog(new Vec(val[0], val[1]), new Vec(val[2], val[3]))
                    : new Cog(new Vec(val[0], val[1]))
                );
                break;
            case "E":
                mobs.push(new Evil(new Vec(val[0], val[1])));
                break;
            }
        });
        return new Scene(hero, room, door, mobs);
    }

}