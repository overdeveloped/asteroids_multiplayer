class Asteroid
{
    constructor (id, x, y, randomX, randomY, radius, points, radiusOffsets)
    {
        this.id = id;
        this.position = createVector(x, y);
        this.velocity = createVector(randomX, randomY);
        this.radius = radius;
        this.points = points;
        this.radiusOffsets = radiusOffsets;

        // for(let i = 0; i < this.points; i++)
        // {
        //     this.radiusOffsets[i] = (random(-5, 5));
        // }

    }

    // update()
    // {
    //     this.position.add(this.velocity);
    // }

    draw()
    {
        noFill();
        stroke(255);

        push();
        translate(this.position.x, this.position.y);
        rotate(PI / 50);
        beginShape();

        for(let i = 0; i < this.points; i++)
        {
            let angle = map(i, 0, this.points, 0, TWO_PI);
            let x = (this.radius + this.radiusOffsets[i]) * cos(angle);
            let y = (this.radius + this.radiusOffsets[i]) * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);


        // rect(this.position.x, this.position.y, 40, 40);
        pop();
    }

}