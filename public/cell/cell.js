class Cell
{
    constructor(position, type, size, passable, numOfVerts, numOfHors)
    {
        this.position = position;
        this.type = type;
        this.size = size;
        this.passable = passable;
        this.numOfVerts = numOfVerts;
        this.numOfHors = numOfHors;
        this.neighbours = [];
        this.occupied = false;
        this.inOpenSet = false;
        this.inClosedSet = false;
        this.isSpawnable = true;
        this.colour = color(0);
        this.red = 100;
        this.green = 100;
        this.blue = 100;
        this.previous = null;

        // A*
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }

    equals(otherCell)
    {
        if (this.position.x == otherCell.position.x && this.position.y == otherCell.position.y)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    draw()
    {
        switch (this.type)
        {
            case "GRASS":
                this.colour = color(0, 200, 50);
                break;
            case "ROCK":
                this.colour = color(50);
                this.passable = false;
                break;
            case "FOREST":
                this.colour = color(0, 150, 0);
                break;
            case "WATER":
                this.colour = color(0, 100, 255);
                break;
            default:
                this.colour = color(255, 0, 255);
                break;
        }
        
        if (this.occupied)
        {
            this.colour = color(0, 100, 0);
        }
        if (this.inOpenSet)
        {
            this.colour = color(50, 100, 250);
        }
        if (this.inClosedSet)
        {
            this.colour = color(255, 0, 50);
        }
        // stroke(255);
        
        fill(this.colour);
        // fill(this.red, this.green, this.blue);
        // noStroke();
        stroke(1);
        rect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);

        // textSize(this.size / 5);
        // text(this.g.toFixed(2), this.position.x * this.size, this.position.y * this.size + this.size / 5);
        // text(this.h.toFixed(2), this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 5);
        // textSize(this.size / 3);
        // text(this.f.toFixed(2), this.position.x * this.size + this.size / 3, this.position.y * this.size + this.size / 2);

        if (this.showScores)
        {
            textSize(8);
            strokeWeight(0.5);
            fill(255, 0, 255);
            fill(0);
            stroke(255, 0, 255);
            stroke(0);
            text(this.g, this.position.x * this.size, this.position.y * this.size + this.size / 5);
            text(this.h, this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 5);
            textSize(12);
            text(this.f, this.position.x * this.size + this.size / 3, this.position.y * this.size + this.size / 2 + this.size / 3);
        }
            
            // textSize(this.size / 2);
            // text(this.position.x, this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 3);
            // text(this.position.y, this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 2 + this.size / 3);

    }

    addNeighbours(cells)
    {
        this.neighbours = [];
        let x = this.position.x;
        let y = this.position.y;
        // console.log(x+1 + " : " + y);

        if (x+1 < this.numOfVerts)
        {
            this.neighbours.push(cells[x+1][y]);
        }
        if (x+1 < this.numOfVerts && y+1 < this.numOfHors)
        {
            this.neighbours.push(cells[x+1][y+1]);
        }
        if (y+1 < this.numOfHors)
        {
            this.neighbours.push(cells[x][y+1]);
        }
        if (x-1 >= 0 && y+1 < this.numOfHors)
        {
            this.neighbours.push(cells[x-1][y+1]);
        }
        if (x-1 >= 0)
        {
            this.neighbours.push(cells[x-1][y]);
        }
        if (x-1 >= 0 && y-1 >= 0)
        {
            this.neighbours.push(cells[x-1][y-1]);
        }
        if (y-1 >= 0)
        {
            this.neighbours.push(cells[x][y-1]);
        }
        if (x+1 < this.numOfVerts && y-1 >= 0)
        {
            this.neighbours.push(cells[x+1][y-1]);
        }
    }

    // Check that this cell and the ones surrounding it are passable
    checkIsSpawnable()
    {
        this.isSpawnable = this.passable && !this.occupied && this.position.x > 2 && this.position.y > 2;
        for (let i = 0; i < this.neighbours.length; i++)
        {
            if (!this.neighbours[i].passable || this.neighbours[i].occupied)
            {
                this.isSpawnable = false;
            }
        }
        
        return this.isSpawnable;
    }

    printDetails()
    {
        console.log("x: " + this.position.x + "; y: " + this.position.y + "; g: " + this.g + "; h: " + this.h + "; f: " + this.f);
    }
}