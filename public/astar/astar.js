class Astar
{
    /// INPUTS:
    // start cell
    // target cell
    /// OUTPUT:
    // array of cells that is the route
    constructor()
    {
        this.openSet = [];
        this.closedSet = [];
        this.path = [];
        this.currentCheapestCell;
        this.finished = false;
        this.counter = 0;
    }

    // Pathing ////////////////////////////////////////////////
    planRoute(startCell, targetCell)
    {
        // console.log("GETTING ROUTE");
        // console.log("startCell");
        // startCell.printDetails();
        // console.log("targetCell");
        // targetCell.printDetails();

        this.clearPreviousRoute();
        this.openSet = [];
        this.closedSet = [];
        let finished = false;
        this.openSet.push(startCell);
        this.currentCheapestCell;

        while (this.openSet.length > 0)
        {
            this.getCheapestCell();

            /////////////////////////////////////////////////////
            // console.log();
            // console.info("...................... CURRENT CELL:");
            // this.currentCheapestCell.printDetails();
            // console.log();
            /////////////////////////////////////////////////////

            if (this.currentCheapestCell === targetCell)
            {
                // console.info(openSet[i].position);
                // console.log("PATH CALCULATED");
                this.finished = true;
                // console.log("FINAL PATH:");
                this.path = [];
                this.builtPath(targetCell);
                console.info("ASTAR: CALCULATED PATH:");
                printVectorArray(this.path);
                return this.path;
            }
               
            this.removeFromArray(this.currentCheapestCell, this.openSet);
            // this.currentCheapestCell.inOpenSet = false;
            this.closedSet.push(this.currentCheapestCell);
            // this.currentCheapestCell.inClosedSet = true;

            if (!finished)
            {
                // Check neighbours
                let neighbours = this.currentCheapestCell.neighbours;
                let neighboursSetLength = neighbours.length;
                for (let j = 0; j < neighboursSetLength; j++)
                {
                    // console.log(neighbours[j]);
                    let neighbour = neighbours[j];

                    if (!this.closedSet.includes(neighbour) && neighbour.passable && !neighbour.occupied)
                    {
                        // Check if neighbour is diagonal
                        // Diagonal coordinates added together will either be equal or differ by 2
                        let addedNeighbour = neighbour.position.x + neighbour.position.y;
                        let addedCurrent = this.currentCheapestCell.position.x + this.currentCheapestCell.position.y;
                        let difference = Math.abs(addedCurrent - addedNeighbour);
                        let tempG = 0;
                        if (difference == 0 || difference == 2)
                        {
                            tempG = this.currentCheapestCell.g + 14;
                        }
                        else
                        {
                            tempG = this.currentCheapestCell.g + 10;
                        }

                        let newPath = false;
                        if (this.openSet.includes(neighbour))
                        {                    
                            if (tempG < neighbour.g)
                            {
                                neighbour.g = tempG;
                                newPath = true;
                            }
                        }
                        else
                        {
                            newPath = true;
                            neighbour.g = tempG;
                            this.openSet.push(neighbour);
                            // neighbour.inOpenSet = true;
                        }

                        if (newPath)
                        {
                            neighbour.h = this.heuristic(neighbour.position, targetCell.position);
                            neighbour.f = neighbour.g + neighbour.h;
                            neighbour.previous = this.currentCheapestCell;
                        }

                        /////////////////////////////////////////////////////
                        // console.info("CURRENT NEIGHBOUR:");
                        // neighbour.printDetails();
                        // console.log();
                        /////////////////////////////////////////////////////

                    }
                }
            }

            // this.printSetContents(this.openSet);

            // if (this.counter === 1)
            // {
            //     console.info("BREAK");
            //     break;
            // }

            this.counter++;
        }

        if (!finished)
        {
            console.error("NO SOLUTION");
            return null;
        }

        // console.log(this.nextCell.position);
    }

    getCheapestCell()
    {
        // var cellWithCheapestF = openSet.reduce(function(cellWithCheapestF, cell){
        //     return cell.f < cellWithCheapestF.f ? cell : cellWithCheapestF; 
        // }, openSet[0]);
        this.currentCheapestCell = this.openSet[0];
        for (let _cell of this.openSet)
        {
            if (this.currentCheapestCell.f > _cell.f)
            {
                this.currentCheapestCell = _cell;
            }
            else if (_cell.f == this.currentCheapestCell.f)
            {
                // If there are duplicate f scores use the h scores
                if (this.currentCheapestCell.h > _cell.h)
                {
                    this.currentCheapestCell = _cell;
                }
            }
        }
    }

    // RECURSIVE
    builtPath(cell)
    {
        cell.printDetails()
        
        // Prevent the function from eating it's own tail
        // if (this.path.includes(cell))
        // {
        //     return;
        // }

        this.path.push(createVector(cell.position.x, cell.position.y));
        
        if (cell.previous == undefined || cell.previous == null)
        {
            return;
        }
        else
        {
            let tempCell = cell.previous;
            cell.previous = null;
            this.builtPath(tempCell);
        }
    }

    removeFromArray(cell, arr)
    {
        for (let i = arr.length - 1; i >= 0; i--)
        {
            if (arr[i] === cell)
            {
                arr.splice(i, 1);
            }
        }
    }

    heuristic(vectA, vectB)
    {
        let _dist = (vectA.dist(vectB) * 10);
        return _dist;
    }

    clearPreviousRoute()
    {
        this.path = [];
    }

    printSetContents(set)
    {
        console.log("*************************************************");
        console.log("************ printSetContents(set) **************");
        for (let _cell of set)
        {
            _cell.printDetails();
        }
    }
}