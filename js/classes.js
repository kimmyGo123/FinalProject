class Cow extends PIXI.Sprite {
    constructor(x = 0, y = 0, vx = 0, vy = 0) {

        super(PIXI.loader.resources["images/cow.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.vx = 0;
        this.vy = 0;
        this.stick = false;
        this.OnPlat = false;
    }
    reflectX() {
        this.scale.x *= -1;

    }
    reflectY() {

        this.y *= -1;
    }

}

class Food extends PIXI.Sprite {
    constructor(x = 200, y = 100) {
        super(PIXI.loader.resources["images/move.png"].texture);

        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }
    spawnRandom() {
        this.x += Math.floor(Math.random() * 10) * 25;
        this.y = Math.floor(Math.random() * 10) + 300;
    }
}

class Fence extends PIXI.Sprite {
    constructor(x = 0, y = 0, color = 0xFFFFFF, radius = 5) {
        super(PIXI.loader.resources["images/tempfence.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;

    }
    UpdateHeight() {

        this.height += Math.floor(Math.random() * 10);
    }


}
