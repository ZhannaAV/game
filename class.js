class BollModel {
    constructor(display_width, display_height, r, dy) {
        this.width = display_width;
        this.height = display_height;
        this.y = this.height;
        this.x = Math.random() * (this.width - r * 2) + r;
        this.r = Math.random() * r / 3 + r / 3 * 2;
        this.color = color[Math.floor(Math.random() * color.length)];
        this.dy = Math.random() * 3 * dy / 4 + dy / 4;
        this.dx = 0;
    }

    update() {
        this.y -= this.dy
    }

    windUpdate(wind) {
        if (this.x >= 3 * this.width / 4) {
            this.dx = wind[3];
        }
        if (this.x >= this.width / 2 && this.x < 3 * this.width / 4) {
            this.dx = wind[2];
        }
        if (this.x >= this.width / 4 && this.x < this.width / 2) {
            this.dx = wind[1];
        }
        if (this.x < this.width / 4) {
            this.dx = wind[0];
        }
        if ((this.x += this.dx) < this.r) {
            this.x = this.r
        } else if ((this.x += this.dx) > (this.width - this.r)) {
            this.x = this.width - this.r
        } else {
            this.x += this.dx
        }
    }
}

class Needle {
    constructor(display_width, weight, length) {
        this.width = display_width;
        this.length = -length;
        this.weight = weight;
        this.y = 5 + length;
        this.x = this.width / 2
        this.color = 'silver'
    }

    moveLeft() {
        this.x -= 6;
        if (this.x <= 0) this.x = this.width - 1
    }

    moveRight() {
        this.x += 6;
        if (this.x >= this.width) this.x = 1
    }

}