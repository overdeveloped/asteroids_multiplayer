class Grid
{
    // Pass in canvas dimentions
    constructor(canvasWidth, canvasHeight, cellSize, terain)
    {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = cellSize;
        this.terain = terain;
        this.numOfVerts = Math.floor(this.canvasWidth / this.cellSize);
        this.numOfHors = Math.floor(this.canvasHeight / this.cellSize);
        this.cells = new Array(this.numOfVerts);
        this.path = [];
        this.stop = false;

        for (let x = 0; x < this.numOfVerts; x++)
        {
            this.cells[x] = new Array(this.numOfHors);
        }

        let yOffset = 0;
        
        for (let y = 0; y < this.numOfHors; y++)
        {
            let xOffset = 0;
            
            for (let x = 0; x < this.numOfVerts; x++)
            {
                let randy = noise(xOffset, yOffset);

                // let randy = Math.floor(random(0, 5));

                // let _type = this.terain[randy];
                let _type = "";
                let _passable = true;
                
                if (randy < 0.3)
                {
                    _type = "ROCK";
                    _passable = false;
                }
                else
                {
                    _type = "GRASS";
                    _passable = true;
                }

                if (x === 5 && y === 3 || x === 4 && y === 3
                    || x === 5 && y === 4)
                {
                    _passable = false;
                    _type = "ROCK";

                }
                
                // if (x === 6 && y === 2 || x === 5 && y === 2 || x === 4 && y === 2 || x === 3 && y === 2 || x === 2 && y === 2
                //     || x === 2 && y === 1)
                // {
                //     _passable = false;
                //     _type = "ROCK";

                // }
                

                let newCell = new Cell(createVector(x, y), _type, this.cellSize, _passable, this.numOfVerts, this.numOfHors);

                if (x === 1 && y === 1)
                {
                    newCell.occupied = true;
                }

                this.cells[x][y] = newCell;

                xOffset += 0.1;
            }
            yOffset += 0.1;
        }
    }

    draw()
    {
        if (this.stop) return;
        stroke(0, 255, 0);

        for (let x = 0; x < this.numOfVerts; x++)
        {
            for (let y = 0; y < this.numOfHors; y++)
            {
                this.cells[x][y].draw();
            }
        }
    }

    getCell(vector)
    {
        let foundCell;
        for (let x = 0; x < this.numOfVerts; x++)
        {
            for (let y = 0; y < this.numOfHors; y++)
            {
                if (this.cells[x][y].position.x === Math.floor(vector.x) && this.cells[x][y].position.y === Math.floor(vector.y))
                {
                    foundCell = this.cells[x][y];
                    break;
                }
            }
        }

        return foundCell;
    }

    poppulateNeighbours()
    {
        for (let x = 0; x < this.numOfVerts; x++)
        {
            for (let y = 0; y < this.numOfHors; y++)
            {
                this.cells[x][y].addNeighbours(this.cells);
            }
        }
    }

    findSpawnLocation()
    {
        for (let y = 0; y < this.numOfHors; y++)
        {
            for (let x = 0; x < this.numOfVerts; x++)
            {
                if(this.cells[x][y].checkIsSpawnable())
                {
                    return this.cells[x][y].position;
                }
            }
        }
    }
}