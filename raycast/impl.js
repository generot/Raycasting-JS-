var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;

let player = new User(canvas, "white", 10), angle = 80, ag = 0;

let choice = parseInt(prompt("Choose a level: 1-Random, 2-Test level"), 10);

let lines = choice == 1 ? rnd(6) : choice == 2 ? TestMap() : 0;
FillCanvas(canvas, col);

function update() {
    angle %= 361;
    ag %= 361;

    player.draw(mX, mY, lines, angle, ag);

    for(let i = 0; i < lines.length; i++)
        lines[i].show(ctx, "white");
}

function keydown(code) {
    switch(code) {
    case "KeyW": angle += 5; break;
    case "KeyS": angle -= 5; break; 
    case "KeyA": ag--; break; 
    case "KeyD": ag++; break; 
    }
}

function rnd(desired_len) {
    let empty_arr = [];
    let boundaries = [
        new Line(0, 0, canvas.width, 0),
        new Line(0, 0, 0, canvas.height),
        new Line(0, canvas.height, canvas.width, canvas.height),
        new Line(canvas.width, 0, canvas.width, canvas.height)
    ];
    
    for(let i = 0; i < desired_len; i++)
        empty_arr[i] = new Line(Math.random() * w, Math.random() * h, 
            Math.random() * w + 5, Math.random() * h + 5);
    
    empty_arr.concat(boundaries);
    return empty_arr;
}

function TestMap() {
    let arr = [
        new Line(0, 300, 100, 200),
        new Line(100, 200, 300, 400),
        new Line(300, 400, 400, 400),
        new Line(400, 400, 500, 200),
        new Line(500, 200, 600, 300),
        new Line(300, 250, 400, 250),
        new Line(200, 150, 300, 150)
    ]

    return arr;
}