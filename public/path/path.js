class Path
{
    constructor()
    {
        this.cells = [];
        this.previous = null;
    }
    
    draw()
    {
        for (let i = 0; i < this.cells.length; i++)
        {
            if (this.previous != null)
            {
                let x1 = this.previous.position.x * this.cellSize + this.cellSize / 2;
                let y1 = this.previous.position.y * this.cellSize + this.cellSize / 2;
                let x2 = this.cells[i].position.x * this.cellSize + this.cellSize / 2;
                let y2 = this.cells[i].position.y * this.cellSize + this.cellSize / 2;
                line(x1, y1, x2, y2);
            }
            
            this.previous = this.cells[i];
        }

        this.previous = null;
    }

    getCell(index)
    {
        return this.cells[index];
    }

    getVectorsInPath()
    {
        let coords = [];
        for (let i = 0; i < this.cells.length; i++)
        {
            coords.push(this.cells[i].position);
        }

        return coords;
    }

    deletePath()
    {
        for (let i = 0; i < this.cells.length - 1; i++)
        {
            this.cells[i].occupied = false;
            console.info("DELETE PATH");
            this.cells[i].previous = undefined;
            // this.path[i].isInPath = false;
        }
        this.cells = [];
    }    

    printPath()
    {
        const stringPath = [];
        for (let i = 0; i < this.cells.length - 1; i++)
        {
            stringPath.push(this.cells[i].position.x + ", " + this.cells[i].position.y);
        }

        console.log(stringPath.join(" | "));
        
    }
}