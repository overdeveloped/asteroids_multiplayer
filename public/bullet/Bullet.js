class Bullet
{
    constructor(socketId, playerX, playerY, heading)
    {
        this.id = socketId;
        this.position = createVector(playerX, playerY);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.radius = 20;
        this.heading = heading;
        this.rotation = 0;
    }

    update()
    {

        this.position.add(this.velocity);
        this.velocity.mult(0.95);
        // this.acceleration.setMag(0.01);
        // this.acceleration.sub(0.1);
        // this.velocity.limit(1)
        this.turn();

        this.checkEdges();
    }

    draw()
    {
        noStroke();
        // fill(255, 0, 255);
        // ellipse(this.position.x, this.position.y, 20, 20);
        fill(0, 0, 255);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading + PI / 2);
        triangle(-this.radius, this.radius, this.radius, this.radius, 0, -this.radius);
        pop();
    }

    setRotation(angle)
    {
        this.rotation = angle;
    }

    setHeading(heading)
    {
        this.heading = heading;
    }
}