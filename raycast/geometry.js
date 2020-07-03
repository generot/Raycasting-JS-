class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Returns a unit vector, built from a given angle
    static BuildFromAngle(angle) {
        let x = Math.cos(toRadians(angle)), y = Math.sin(toRadians(angle));
        return new Vector(x, y);
    }

    //Returns the coordinates of the closer to "target" point(where the points are vec1 and vec2)
    static GetSmallerDist(target, vec1, vec2) {
        let d1 = distSq(target.x, target.y, vec1.x, vec1.y),
        d2 = distSq(target.x, target.y, vec2.x, vec2.y);

        if(d1 > d2) return vec2;
        else return vec1;
    }
}

class User {
    constructor(canvas, stk, rad) {
        this.stk = stk;
        this.rad = rad;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    draw(x, y, lns, ang, spin) {
        FillCanvas(this.canvas, col);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.rad, 0, 2*Math.PI);
        this.ctx.closePath();
        this.ctx.strokeStyle = this.stk;
        this.ctx.stroke();

        for(let i = -ang/2 + spin; i < ang/2 + spin; i += 0.4) {
            let vec = Vector.BuildFromAngle(i);
            let toX = x + vec.x * 600 * 2, toY = y + vec.y * 600 * 2;

            let ln1 = new Line(x, y, toX, toY), intPoints = [];
            let toDrawTo;

            for(let j = 0; j < lns.length; j++) {
                let int = AreIntrs(ln1, lns[j]);

                if(int != undefined)
                    intPoints.push(int);
            }

            toDrawTo = intPoints[0];
            for(let k = 0; k < intPoints.length; k++) {
                let pos = new Vector(x, y);
                toDrawTo = Vector.GetSmallerDist(pos, toDrawTo, intPoints[k]);
            }

            if(toDrawTo != undefined){
                let ln = new Line(x, y, toDrawTo.x, toDrawTo.y);
                ln.show(this.ctx, "white");
            } else ln1.show(this.ctx, "white");
        }
    }
}

function toRadians(deg) { return deg*Math.PI/180; }
function distSq(x1, y1, x2, y2) { return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1); }

let Line = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

Line.prototype.show = function(ctx, col) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = col;
    ctx.stroke();
    ctx.closePath();
}

function FillCanvas(canvas, col) {
    let sz = 4*canvas.width*canvas.height, newTexture = new Uint8ClampedArray(sz);
    for(let i = 0; i < sz; i += 4) {
        newTexture[i] = col.r;
        newTexture[i+1] = col.g;
        newTexture[i+2] = col.b;
        newTexture[i+3] = col.a;
    }

    let imData = new ImageData(newTexture, canvas.width, canvas.height);
    ctx.putImageData(imData, 0, 0);
}

function AreIntrs(ln1, ln2) {
    let commonDnm = (ln1.x1 - ln1.x2)*(ln2.y1 - ln2.y2) - (ln1.y1 - ln1.y2)*(ln2.x1 - ln2.x2);

    let t = ((ln1.x1 - ln2.x1)*(ln2.y1 - ln2.y2) - (ln1.y1 - ln2.y1)*(ln2.x1 - ln2.x2))/commonDnm;
    let u = -((ln1.x1 - ln1.x2)*(ln1.y1 - ln2.y1) - (ln1.y1 - ln1.y2)*(ln1.x1 - ln2.x1))/commonDnm;

    if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        let x = ln2.x1 + u*(ln2.x2 - ln2.x1), y = ln2.y1 + u*(ln2.y2 - ln2.y1);
        return new Vector(x, y);
    } else return undefined;
}

let col = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
};