class Asteroid
{
    constructor (x, y, radius, points)
    {
        this.position = createVector(x, y);
        this.velocity = createVector(random(), random());
        this.radius = radius;
        this.points = points;
        this.radiusOffset = [];

        for(let i = 0; i < this.points; i++)
        {
            this.radiusOffset[i] = (random(-5, 5));
        }

    }

    update()
    {
        this.position.add(this.velocity);
    }

}

module.exports = Asteroid;