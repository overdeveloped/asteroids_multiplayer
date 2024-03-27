let canv;
let canvasWidth;
let canvasHeight;
let cellSize;
let grid;

let numberOfMobiles;
let mobiles;
let terain = [];
let drawingBox;
let selectionBoxStart;
let leftButtonDown;
let selectedMobiles = [];

const grid2 = new SpacialHashGrid(bounds, dimentions);
const client = grid2.NewClient(hlfedvv);

client.position = newPosition;

grid2.UpdatePosition(client);

const nearby = grid.FindNearby(location, bounds);

grid2.RemoveClient(client);

function setup()
{
  document.body.addEventListener("contextmenu", function(evt)
  {
    evt.preventDefault();
     return false;
  });

  // frameRate(10);
  canvasWidth = 800;
  canvasHeight = 600;
  cellSize = 20;
  numberOfMobiles = 5;
  mobiles = [];
  canv = createCanvas(canvasWidth, canvasWidth);
  background(50, 50, 50);
  stroke(255, 0, 255);
  fill(255, 0, 255);    
  terain.push("GRASS");
  terain.push("GRASS");
  terain.push("ROCK");
  terain.push("FOREST");
  terain.push("WATER");

  leftButtonDown = false;
  drawingBox = false;
  selectionBoxStart = createVector(0, 0);

  grid = new Grid(canvasWidth, canvasHeight, cellSize, terain);
  grid.poppulateNeighbours();  

  
  // mobile = new Mobile(spawnLocation.x, spawnLocation.y, cellSize, grid);
  
  for (let i = 0; i < numberOfMobiles; i++)
  {
    let spawnLocation = grid.findSpawnLocation();
    // mobiles[i] = new Mobile(spawnLocation.x, spawnLocation.y, cellSize, grid);
    mobiles[i] = new Mobile(i, i * 2 + 4, i * 2 + 4, cellSize, grid);
  }

  // mobiles[0] = new Mobile(0, 1, 1, cellSize, grid);
  // mobiles[1] = new Mobile(1, 6, 2, cellSize, grid);
  // mobiles[1].selected = false;

  console.log(mobiles);

  
  // Listeners
  canv.mousePressed(handleMouseDown);
  canv.mouseReleased(handleMouseClick);



  
}

// FRAMERATE
let lastLoop = new Date();

function draw() //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
  background(50);
  strokeWeight(2);

  grid.draw();

  for (let mobile of mobiles)
  {
    mobile.update();
    mobile.draw();
    // mobile.path.draw();
  }

    ///////////////// FRAMERATE //////////////////
    let thisLoop = new Date();                  //
    let fps = 1000 / (thisLoop - lastLoop);     //
    lastLoop = thisLoop;                        //
    //////////////////////////////////////////////
  
    stroke(0);
    fill(0);
    text(Math.floor(fps), 20, 20);  

    strokeWeight(5);
    stroke(0, 255, 0);
    noFill();
    if (drawingBox)
    {
      rect(selectionBoxStart.x, selectionBoxStart.y, mouseX - selectionBoxStart.x, mouseY - selectionBoxStart.y);
    }

} ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleMouseClick(data)
{
  if (data.button === 0)
  {
    let targetX = Math.floor(mouseX / cellSize);
    let targetY = Math.floor(mouseY / cellSize);
    let targetV = createVector(targetX, targetY);
    let selectedCell = grid.getCell(targetV);

    // LEFT CLICK
    if (drawingBox)
    {
      // FIND ANY MOBILE THAT IS IN THIS BOX
      selectedMobiles = [];
      mobiles.forEach(mobile =>
      {
        if (mobile.position.x * cellSize >= selectionBoxStart.x && mobile.position.y * cellSize >= selectionBoxStart.y
          && mobile.position.x * cellSize <= mouseX && mobile.position.y * cellSize <= mouseY)
        {
          mobile.selected = true;
          selectedMobiles.push(mobile);
        }
        else
        {
          mobile.selected = false;
        }
      });
    }
    else
    {
      leftButtonDown = false;
      // FIND ANY MOBILE THAT IS ON THIS CELL
      mobiles.forEach(mobile =>
      {
        if (mobile.position.x === selectedCell.position.x && mobile.position.y === selectedCell.position.y)
        {
          mobile.selected = true;
          selectedMobiles.push(mobile);
        }
        else
        {
          mobile.selected = false;
        }
      });
    }
      drawingBox = false;
      console.info(selectedMobiles);
  }

  // RIGHT CLICK
  if (data.button === 2)
  {
    let targetX = Math.floor(mouseX / cellSize);
    let targetY = Math.floor(mouseY / cellSize);
    let targetV = createVector(targetX, targetY);
    let targetCell = grid.getCell(targetV);
    
    if (targetCell.passable)
    {
      for (let mobile of selectedMobiles)
      // for (let i = 0; i < numberOfMobiles; i++)
      {
        mobile.setTarget(targetCell);
      }
      
      // OCCUPIED CELLS FOR TESTING
      grid.cells[1][2].occupied = true;
      grid.cells[2][1].occupied = true;
      // console.info(grid.cells[1][2]);
      // grid.path = astar.planRoute(grid.getCell(createVector(0, 0)), targetCell);
    }
    else
    {
      console.error("Failed - Not passable");
    }
  }

}

function handleMouseDown(data)
{
  if (data.button === 0)
  {
    leftButtonDown = true;
    selectionBoxStart = createVector(mouseX, mouseY);
  }
  else
  {
    leftButtonDown = false;
  }
}

function keyPressed() {
  if (keyCode === 68)
  {
    // console.log("d pressed");
    // grid.path = [];
    // console.log(grid.path);
  }
}

function mouseDragged()
{
  if (leftButtonDown)
  {
    drawingBox = true;
  }
}

function printVectorArray(arr)
{
  const stringPath = [];
  for (let i = 0; i < arr.length - 1; i++)
  {
      stringPath.push(arr[i].x + ", " + arr[i].y);
  }

  console.log(stringPath.join(" | "));

}
