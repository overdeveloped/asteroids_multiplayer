class Bullet
{
    constructor(id, x, y, velocity)
    {
        this.id = id;
        this.position = createVector(x, y);
        this.velocity = velocity;
        // this.velocity = velocity.mult(5);
        // this.velocity = p5.Vector.sub(this.velocity, this.position);
        // this.velocity.limit(5);

        this.lifespan = 40;
        this.selfDestruct = false;

        this.red = 0;
        this.green = 0;
        this.blue = 0;

    }

    update()
    {
        // this.velocity = p5.Vector.sub(this.velocity, this.position);
        // this.velocity.limit(5);
        this.position.add(this.velocity);
        this.lifespan = this.lifespan - 1;

        if (this.lifespan <= 0)
        {
            this.selfDestruct = true;
        }

        // console.log(this.lifespan);
        this.checkEdges();
    }

    draw()
    {
        fill(this.red, this.green, this.blue);
        ellipse(this.position.x, this.position.y, 10, 10);
    }

    setColour(red, green, blue)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    checkEdges()
    {
        if (this.position.x < 0)
        {
            this.position.x = width;
        }
        if (this.position.x > width)
        {
            this.position.x = 0;
        }
        if (this.position.y < 0)
        {
            this.position.y = height;
        }
        if (this.position.y > height)
        {
            this.position.y = 0;
        }
        
    }

}