class Bullet
{
    constructor(x, y, velocity)
    {
        this.position = createVector(x, y);
        // this.velocity = velocity;
        this.velocity = velocity.mult(5);
        // this.velocity = p5.Vector.sub(this.velocity, this.position);
        // this.velocity.limit(5);

        this.lifespan = 4000;
        this.selfDestruct = false;

    }

    update()
    {
        // this.velocity = p5.Vector.sub(this.velocity, this.position);
        // this.velocity.limit(5);
        this.position.add(this.velocity);
        this.lifespan -= 1;

        if (this.lifespan <= 0)
        {
            this.selfDestruct = true;
        }
    }

    draw()
    {
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, 10, 10);
    }
}