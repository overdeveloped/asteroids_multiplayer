class Player
{
    constructor(id, x, y)
    {
        this.id = id;
        this.position = createVector(width / 2, height / 2);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.radius = 20;
        this.heading = 0;
        this.rotation = 0;
        this.isBoosting = false;
    }

    update()
    {
        if (leftIsDown)
        {
            this.setRotation(-(PI / 50));
        }

        else if (rightIsDown)
        {
            this.setRotation((PI / 50));
        }

        if (upIsDown)
        {

        }

        else if (downIsDown)
        {

        }

        if (this.isBoosting)
        {
            this.boost();
        }

        this.position.add(this.velocity);
        this.velocity.mult(0.95);
        // this.acceleration.setMag(0.01);
        // this.acceleration.sub(0.1);
        // this.velocity.limit(1)
        this.turn();

        this.checkEdges();
    }

    boost()
    {
        this.acceleration = p5.Vector.fromAngle(this.heading)
        this.acceleration.mult(0.25);
        this.velocity.add(this.acceleration);
    }

    setBoosting(isBoosting)
    {
        this.isBoosting = isBoosting;
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

    turn()
    {
        this.heading += this.rotation;
    }

    setRotation(angle)
    {
        this.rotation = angle;
    }

    setHeading(heading)
    {
        this.heading = heading;
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