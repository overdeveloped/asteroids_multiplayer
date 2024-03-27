// Solution to broken socket.io:
// https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error?rq=1

// const p5 = require("p5");

let width = 1000;
let height = 600;
let padding = 50;

let players = [];
let bullets = [];
let asteroids = [];

function Player(id, x, y, heading) 
{
    this.id = id,
    this.x = x,
    this.y = y,
    this.heading = heading
}

function Bullet(id, x, y, vel)
{
    this.id = id,
    this.x = x,
    this.y = y,
    this.vel = vel
}

function Asteroid(id, x, y, randomX, randomY, radius, points, radiusOffsets)
{
    this.id = id,
    this.x = x,
    this.y = y,
    this.randomX = randomX,
    this.randomY = randomY,
    this.radius = radius,
    this.points = points,
    this.radiusOffsets = radiusOffsets;
}

for (let i = 0; i < 5; i++)
{
    let randomX = randomNumber(-1, 1);
    let randomY = randomNumber(-1, 1);
    let radius = randomNumber(30, 40);
    let points = randomNumber(8, 20);
    let radiusOffsets = [];

    for(let i = 0; i < points; i++)
    {
        radiusOffsets[i] = randomNumber(-5, 10);
    }

    asteroids.push(new Asteroid(i, Math.random() * width, Math.random() * height, randomX, randomY, radius, points, radiusOffsets));
}

function randomNumber(min, max)
{
    return Math.random() * (max - min) + min;
}

const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, 
    {
        cors: {
            origin: "*",
            // origins: ["http://127.0.0.1:3000"],
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

setInterval(heartbeat, 10);

function heartbeat()
{
    for (let asteroid of asteroids)
    {
        asteroid.x += asteroid.randomX;   
        asteroid.y += asteroid.randomY;   
        
        if (asteroid.x < -padding)
        {
            asteroid.x = width + padding;
        }
        if (asteroid.x > width + padding)
        {
            asteroid.x = -padding;
        }
        if (asteroid.y < -padding)
        {
            asteroid.y = height + padding;
        }
        if (asteroid.y > height + padding)
        {
            asteroid.y = -padding;
        }
    }

    io.sockets.emit("heartbeat",
    {
        "players": players,
        // "bullets": bullets
        "asteroids": asteroids

    });
}


app.use(express.static("public"));

io.on("connection", (socket, err) =>
{
    if (socket)
    {
        console.info("New connection: " + socket.id);
        socket.on('disconnect', () =>
        {
            let currentPlayer = players.find(p => p.id === socket.id);
            
            if (currentPlayer)
            {
                console.info("DISCONNECT PLAYER " + currentPlayer.id);
                removeFromArray(currentPlayer, players);
            }
        });

        let startData = 
        {
            "width": width,
            "height": height,
            "asteroids": asteroids
        }
        socket.emit("start", startData);

        socket.on("start", (data, err) =>
        {
            if (data)
            {
                console.log(socket.id + " X:" + data.x + " Y:" + data.y);
                players.push(new Player(socket.id, data.x, data.y, data.heading));

                console.info("Number of players: " + players.length);

                for (let player of players)
                {
                    console.info(player);
                }
            }
        
            if (err)
            {
                console.error(err);
            }
        });

        socket.on("bullet", (data, err) =>
        {
            if (data)
            {
                // console.log("BULLET!");
                // console.log(data);
                bullets.push(new Bullet(data.id, data.x, data.y, data.vel));
            }

            socket.broadcast.emit("new-bullet", new Bullet(data.id, data.x, data.y, data.vel));
            // io.sockets.emit("new-bullet", new Bullet(data.id, data.x, data.y, data.vel));
            console.log(bullets.length);
        });

        socket.on("remove-bullet", (data, err) =>
        {
            if (data)
            {
                let _bulletToCull = bullets.find(b => b.id == data);

                if (_bulletToCull != null)
                {
                    console.log(_bulletToCull);
                    removeFromArray(_bulletToCull, bullets);
                }
            }
        });

        socket.on("update", (data, err) =>
        {
            if (data)
            {
                // console.log(socket.id + " X:" + data.x + " Y:" + data.y);
                let currentPlayer = players.find(p => p.id === socket.id);

                // console.log(currentPlayer);

                if (currentPlayer != undefined)
                {
                    currentPlayer.x = data.x;
                    currentPlayer.y = data.y;
                    currentPlayer.heading = data.heading;
                }
            }
        
            if (err)
            {
                console.error(err);
            }
        });

    }

    if (err)
    {
        console.error(err);
    }
});

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


server.listen(3000, () =>
{
    console.info("**** SERVER LISTENING ****");
});

