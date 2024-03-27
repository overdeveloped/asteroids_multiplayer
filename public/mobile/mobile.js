class Mobile
{
    constructor(id, startX, startY, size, grid)
    {
        this.id = id;
        this.startX = startX;
        this.startY = startY;
        this.size = size;
        this.grid = grid;

        this.position = createVector(startX, startY);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);

        // A*
        this.astar = new Astar();
        this.path = [];
        this.currentCell;
        this.openSet = [];
        this.closedSet = [];
        this.target = undefined;
        this.nextCell = undefined;
        this.pathIndex = -1;
        this.moving = false;
        this.paused = false;
        this.pauseCounter = 0;
        this.pauseTimer = 0;
        this.selected = false;
        this.setCurrentCell();
        this.hasNewTarget = false;

        this.maxVelocity = 0.05;

    }
    
    update()
    {
        if (this.moving)
        {
            this.tryAndFollowPath();
        }

        // console.this.log(this.pathIndex);
        // Sets the direction
        if (this.moving && !this.paused)
        {
            this.velocity = p5.Vector.sub(this.path[this.pathIndex], this.position);
            this.velocity.limit(this.maxVelocity);
        }

        if (!this.paused)
        {
            this.position.add(this.velocity);
        }

        if (this.pauseTimer > 0)
        {
            this.pauseTimer--;
        }
    }

    draw()
    {
        stroke(255, 0, 255);
        fill(255, 0, 255);
        ellipse(this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 2, this.size, this.size);

        if (this.selected)
        {
            stroke(0, 255, 0);
            noFill();
            rect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);
        }

        // Draw id
        stroke(0, 0, 255);
        fill(0, 255, 255);
        text(this.id, this.position.x * this.size + this.size / 2, this.position.y * this.size + this.size / 2);

        // DRAWING THE PATH NEEDS A RE-WORK
        // for (let node of this.path)
        // {
        //     if (this.previous != null)
        //     {
        //         let x1 = this.previous.position.x * this.cellSize + this.cellSize / 2;
        //         let y1 = this.previous.position.y * this.cellSize + this.cellSize / 2;
        //         let x2 = this.cells[i].position.x * this.cellSize + this.cellSize / 2;
        //         let y2 = this.cells[i].position.y * this.cellSize + this.cellSize / 2;
        //         line(x1, y1, x2, y2);
        //     }
        //     this.previous = this.cells[i];
        // }

        this.previous = null;
    }
    
    // Pathing ////////////////////////////////////////////////
    setCurrentCell()
    {
        // console.this.log(this.position.x + ", " + this.position.y);
        this.currentCell = this.grid.getCell(this.position);
        this.currentCell.occupied = true;
    }

    setTarget(newTarget)
    {
        // this.log("CURRENT TARGET: " + this.target);
        // this.log("NEW TARGET: " + newTarget);
        if (this.target != null && this.target.equals(newTarget))
        {
            this.log("CURRENT TARGET NOT NULL");
            this.log("THIS TARGET HAS ALREADY BEEN SET");
            // This is already where it's heading
            return;
        }
        else
        {
            // Plan a new path
            this.log("NEW TARGET SET");
            this.moving = true;
            this.target = newTarget;
            this.hasNewTarget = true;
        }

        // console.this.log(newTarget.position);
        // this.target = newTarget;
        // this.hasNewTarget = true;
        // this.pauseTimer = 0;

        // if (!this.moving)
        // {
        //     console.info("DELETE PATH - CHANGETARGET");

        //     this.planPath();
        // }

        // this.hasNewTarget = false;
    }
    
    planPath()
    {
        // this.moving = false;
        this.log("DELETE PATH - PLANPATH()");

        this.path = [];
        this.setCurrentCell();
        this.path = this.astar.planRoute(this.currentCell, this.target);
        if (this.path == null)
        {
            this.log("COULD NOT PLAN ROUTE - PLANPATH()");
            this.moving = false;
            this.path = [];
            return;
        }
        printVectorArray(this.path);
        this.moving = true;
        this.pathIndex = this.path.length - 1;

        printVectorArray(this.path);
    }

    tryAndFollowPath()
    {
        // console.this.log(this.pauseTimer);
        // Check if the mobile should be paused
        if (this.pauseTimer === 0)
        {
            this.paused = false;
        }

        if (this.path.length == 0)
        {
            if (this.hasNewTarget)
            {
                this.hasNewTarget = false;
                this.log("STANDING START - MAKE NEW PATH");
                // TODO: THIS IS CIRCULAR
                this.planPath();
            }
        }
        else
        {
            // Check if mobile has reached the next node before selecting the next one
            if (this.position.x === this.path[this.pathIndex].x
                && this.position.y === this.path[this.pathIndex].y)
            {
                this.log("NODE");

                if (this.hasNewTarget)
                {
                    this.hasNewTarget = false;
                    this.log("DELETE PATH - MAKE NEW PATH");
                    // TODO: THIS IS CIRCULAR
                    this.planPath();
                }

                // Check if the path has ended
                if (this.pathIndex == 0)
                {
                    this.moving = false;
                    this.velocity.limit(0);
                    this.log("DELETE PATH - TRYANDFOLLOW()");

                    this.path = [];
                    this.setCurrentCell();
                    this.log("DESTINATION REACHED");
                    return;
                }

                const currentCell = grid.getCell(this.path[this.pathIndex]);

                if (!this.paused)
                {
                    this.log("DESTINATIN NOT YET REACHED");
                    // Select the next node if clear
                    const nextCell = grid.getCell(this.path[this.pathIndex - 1]);
                    if (nextCell.occupied)
                    {
                        this.paused = true;
                        this.pauseCounter++;
                        this.log("PAUSE");
                        // this.moving = false;
                        this.pauseTimer = 60;

                        if (this.pauseCounter === 3)
                        {
                            this.log("RE-ROUTE");
                            let _cell = this.path[this.pathIndex - 1];
                            _cell.passable = false;

                            this.planPath();
                            _cell.passable = true;
                        }
                    }
                    else
                    {
                        // console.this.log("INCREMENT PATH")
                        this.moving = true;
                        currentCell.occupied = false;
                        this.pathIndex--;
                        nextCell.occupied = true;
                    }
                }
                else
                {
                    // this.moving = false;
                }
            }
        }
    }

    printDetails()
    {
        this.log("x: " + this.position.x + "; y: " + this.position.y + "; g: " + this.g + "; h: " + this.h + "; f: " + this.f);
    }

    log(message)
    {
        console.log(this.id + ": " + message);
    }
}