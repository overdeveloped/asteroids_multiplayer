
// file:///G:/My_Repos/P5/p5-rts-like-warcraft/rts-in-node/public/index.html
// http://localhost:3000/

// Networking Tutorial:
// https://www.youtube.com/watch?v=ZjVyKXp9hec&list=PLRqwX-V7Uu6aRpfixWba8ZF6tJnZy5Mfw&index=6

// Asteroids Tutorial
// https://www.youtube.com/watch?v=hacZU523FyM&list=PLRqwX-V7Uu6aRpfixWba8ZF6tJnZy5Mfw&index=9


// const io = require("socket.io-client");
var connectionOptions =  
{
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

let canv;
let canvasWidth;
let canvasHeight;
let socket;



// const bounds = [[0, 500], [0, 500]];
// const dimentions = [20, 20];
// const grid = new SpacialHashGrid(bounds, dimentions);

// const client = grid.NewClient([50, 50], [20, 20]);

// grid2.UpdatePosition(client);

// const nearby = grid.FindNearby(location, bounds);

// grid2.RemoveClient(client);

let otherData;

// Mobiles
let player;
let players = [];

let bullets = [];
let bullets_foreign = [];

let asteroids = [];

// Controls
let leftIsDown = false;
let rightIsDown = false;
let upIsDown = false;
let downIsDown = false;

let vertDirection = 0
let horDirection = 0
let acceleration = 0.1;

// FRAMERATE
let lastLoop = new Date();

function setup()
{
    frameRate(60);

    otherData =
    {
        x: -500,
        y: -500
    }

    socket = io("http://192.168.0.10:3000", connectionOptions);
    // socket = io("http://localhost:3000", connectionOptions);
    socket.on("mouse", (data, err) =>
    {
        if (data)
        {
            otherData = data;
            // console.log("data");
            // console.log(data);
        }
    
        if (err)
        {
            console.error(err);
        }

    });

    // canvasWidth = 500;
    // canvasHeight = 600;

    socket.on("heartbeat", (data, err) =>
    {
        players = data.players;
        
        if (data.asteroids)
        {
            let _asteroids = data.asteroids;

            for (let _asteroid of _asteroids)
            {
                let localAsteroid = asteroids.find(a => a.id === _asteroid.id);
                if (localAsteroid)
                {
                    localAsteroid.position.x = _asteroid.x;
                    localAsteroid.position.y = _asteroid.y;
                }
            }
        }

        if (err)
        {
            console.error("HEARTBEAT: " + err);
        }
    });

    socket.on("start", (data, err) =>
    {
        if (data.width)
        {
            canvasWidth = data.width;
        }

        if (data.height)
        {
            canvasHeight = data.height;
        }

        if (data.asteroids)
        {
            console.log(data);
            for (let asteroid of data.asteroids)
            {
                console.log("ASTEROID ADDED");
                asteroids.push(new Asteroid(asteroid.id, asteroid.x, asteroid.y, asteroid.randomX, asteroid.randomY, asteroid.radius, asteroid.points, asteroid.radiusOffsets));    
            }
        }
            
        if (err)
        {
            console.error("ASTEROIDS: " + err);
        }

        canv = createCanvas(canvasWidth, canvasHeight);

        // Populate environment
        player = new Player(socket.id, width / 2, height / 2);

        let startData =
        {
            x: player.position.x,
            y: player.position.y,
            heading: player.heading
        };
        socket.emit("start", startData);

    
        // Controls
        canv.mousePressed(handleMouseDown);

    });

    socket.on("new-bullet", (data, err) =>
    {
        console.log("NEW BULLET")
        if (data)
        {
            bullets_foreign.push(new Bullet(data.id, data.x, data.y, createVector(data.vel.x, data.vel.y)));

        }

    });

    socket.on('disconnect', () =>
    {
        asteroids = [];
    });





}


function draw() //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
    background(0);            
    
    ///////////////// FRAMERATE //////////////////
    let thisLoop = new Date();                  //
    let fps = 1000 / (thisLoop - lastLoop);     //
    lastLoop = thisLoop;                        //
                                                //
    stroke(0);                                  //
    fill(255);                                  //
    text(Math.floor(fps), 20, 20);              //
                                                //
    noStroke();                                 //
    fill(0, 255, 255);                          //
    //////////////////////////////////////////////



    rect(otherData.x, otherData.y, 40 ,40);
    // player.turn(0.1);
    player.update();
    player.draw();

    let data =
    {
        x: player.position.x,
        y: player.position.y,
        heading: player.heading,
        bullets: bullets
    };

    socket.emit("update", data);

    for (let bullet of bullets)
    {
        bullet.update();
        bullet.setColour(255, 0, 0);
        bullet.draw();
        
        // Cull bullets
        if (bullet.selfDestruct)
        {
            console.info("Remove bullet");
            removeFromArray(bullet, bullets);
            socket.emit("remove-bullet", bullet.id);
        }
    }

    for (let bullet of bullets_foreign)
    {
        // console.log(bullet);
        bullet.update();
        bullet.setColour(255, 255, 0);
        bullet.draw();
        
        // Cull foreign bullets
        if (bullet.selfDestruct)
        {
            removeFromArray(bullet, bullets_foreign);

            // let data =
            // {
            //     id: bullet.id,
            //     x: bullet.position.x,
            //     y: bullet.position.y,
            //     bullets: bullets
            // };
                    
            // socket.emit("remove-bullet", bullet.id);
        }
    }

    // Foreign players
    for (let p of players)
    {
        if (p.id != socket.id)
        {
            fill(255, 255, 0)
            // ellipse(p.x, p.y, 20, 20);
            push();
            translate(p.x, p.y);
            rotate(p.heading + PI / 2);
            triangle(-20, 20, 20, 20, 0, -20);
            pop();
    
        }
    }

    for (let b of bullets_foreign)
    {
        if (b.id != socket.id)
        {
            fill(255, 255, 0)
            // ellipse(b.x, b.y, 5, 5);
        }
    }

    for (let a of asteroids)
    {
        // a.update();
        a.draw();
    }


}

function removeFromArray(cell, arr)
{
    for (let i = arr.length - 1; i >= 0; i--)
    {
        if (arr[i] === cell)
        {
            arr.splice(i, 1);
        }
    }
}

function mouseDragged()
{
    // checkControls();
    let data =
    {
        x: mouseX,
        y: mouseY
    };

    socket.emit("mouse", data);
    noStroke();
    fill(255, 0, 255);
    rect(mouseX - 25, mouseY - 25, 50 ,50);

}

function keyPressed()
{
    // console.log("Key pressed: " + keyCode);

    // LEFT
    if (keyCode == 37)
    {
        leftIsDown = true;
        vertDirection = -acceleration;
        // console.log("leftIsDown: " + leftIsDown);
    }

    // RIGHT
    if (keyCode == 39)
    {
        rightIsDown = true;
        vertDirection = acceleration;
        // console.log("rightIsDown: " + rightIsDown);
    }

    // UP
    if (keyCode == 38)
    {
        upIsDown = true;
        horDirection = -acceleration;
        // console.log("upIsDown: " + upIsDown);
        player.setBoosting(true);
    }

    // DOWN
    if (keyCode == 40)
    {
        downIsDown = true;
        horDirection = acceleration;
        // console.log("downIsDown: " + downIsDown);
    }

    // console.log(keyCode);

    // SPACE
    if (keyCode == 32)
    {
        fireBullet();
    }



    // console.log("leftIsDown: " + leftIsDown);
    // console.log("rightIsDown: " + rightIsDown);
    // console.log("upIsDown: " + upIsDown);
    // console.log("downIsDown: " + downIsDown);

}

function keyReleased()
{
    // LEFT
    if (keyCode == 37)
    {
        leftIsDown = false;
        vertDirection = 0;
        player.setRotation(0);
    }

    // RIGHT
    if (keyCode == 39)
    {
        rightIsDown = false;
        vertDirection = 0;
        player.setRotation(0);

    }

    // UP
    if (keyCode == 38)
    {
        upIsDown = false;
        horDirection = 0;
        player.setBoosting(false);

    }

    // DOWN
    if (keyCode == 40)
    {
        downIsDown = false;
        horDirection = 0;
    }
}

function handleMouseDown(data)
{
    if (data.button === 0)
    {
        console.log("mouse left");
        leftButtonDown = true;
        // fireBullet();
    }
    else
    {
        leftButtonDown = false;
    }
}

function fireBullet()
{
    let _bullet = new Bullet(socket.id + "-" + Date.now(), player.position.x, player.position.y, p5.Vector.fromAngle(player.heading).mult(5));
    console.log(_bullet);
    bullets.push(_bullet);

    let data =
    {
        id: _bullet.id,
        x: _bullet.position.x,
        y: _bullet.position.y,
        vel: _bullet.velocity
    };

    console.log(data);
    socket.emit("bullet", data);
}
