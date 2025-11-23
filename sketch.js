let wdth = 600;
let hight = 400;

function setup() {
  createCanvas(wdth, hight);
  noStroke();
  //stroke(0);
  //fill(255, 0, 0);
}

let dt = 1;
let kconst = 89.9;//89.9
let gconst = 1;

let numpro = 1;
let numneu = 1;
let numele = 30;

class Quirky {

  constructor(q,m,r,x,y,vx,vy) {
    this.q = q;
    this.m = m;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
  }
  update(ax, ay) {
    
    this.vx += dt*ax;
    this.vy += dt*ay;



    if (this.x == this.r/2 || this.x == wdth - this.r/2) {
      this.vx *= -1;
    }
    if (this.y == this.r/2 || this.y == hight - this.r/2) {
      this.vy *= -1;
    }

    //console.log(ax + " " + ay);

    this.vx = max(-10, min(10, this.vx));
    this.vy = max(-10, min(10, this.vy));

    this.x += dt*(this.vx + (0.5*ax*dt));
    this.y += dt*(this.vy + (0.5*ay*dt));
    this.x = min(wdth - this.r/2,max(this.r/2,this.x));
    this.y = min(hight - this.r/2,max(this.r/2,this.y));

  }

}


const arr = [];

for (let i = 0; i < numpro; i ++) {
  const obj = new Quirky(1,183,20,Math.random()*wdth,   Math.random()*hight, 0,0);//proton: mass 1837, radius 50

  arr.push(obj);
}

for (let i = 0; i < numneu; i ++) {
  const obj = new Quirky(0,183,20,Math.random()*wdth,     Math.random()*hight, 0,0);

  arr.push(obj);
}

for (let i = 0; i < numele; i ++) {
  const obj = new Quirky(-1,10,3,Math.random()*wdth,   Math.random()*hight, 0,0);//electron: mass 10, radius 3

  arr.push(obj);
}



function force(c1,c2) {//c1 is the primary we are focused on
  
  const F1 = [0,0];
  const F2 = [0,0];
  let dx = c1.x - c2.x;
  let dy = c1.y - c2.y;
  
  //COULOMB FORCE
  F1[0] += kconst*c1.q*c2.q*dx/(dx**2 + dy**2)**(3/2);
  F1[1] += kconst*c1.q*c2.q*dy/(dx**2 + dy**2)**(3/2);
  F2[0] -= kconst*c1.q*c2.q*dx/(dx**2 + dy**2)**(3/2);
  F2[1] -= kconst*c1.q*c2.q*dy/(dx**2 + dy**2)**(3/2);
  
  //YUKAWA POTENTIAL, INTEGRATED TO FORCE
  
}




function electro(c) {

  const Fc = [0,0];

  for (let i = 0; i < arr.length; i ++) {

    if (arr[i] == c) {
      continue;
    }

    let dx = c.x - arr[i].x;
    let dy = c.y - arr[i].y;

    Fc[0] += arr[i].q*dx/(dx**2 + dy**2)**(3/2);
    Fc[1] += arr[i].q*dy/(dx**2 + dy**2)**(3/2);
  }

  Fc[0] *= kconst*c.q;
  Fc[1] *= kconst*c.q;

  return Fc;
}




function bounce(c1,c2) {

  return (((c1.x - c2.x)**2 + (c1.y - c2.y)**2) <= ((c1.r + c2.r)**2)/4);
}







let t = 0;
function draw() {
  background(0);

  //DRAWING
  for (let i = 0; i < arr.length; i ++) {
    circle(parseInt(arr[i].x),parseInt(arr[i].y),arr[i].r);
  }



  const Fv = [];

  //SUMMING FORCES
  for (let i = 0; i < arr.length; i ++) {
    const Ft = [0,0];

    const Ftc = electro(arr[i]);
    Ft[0] += Ftc[0];
    Ft[1] += Ftc[1];

    Fv.push(Ft);
  }
  //UPDATING POS, VELOCITY
  for (let i = 0; i < arr.length; i ++) {
    arr[i].update(Fv[i][0]/(arr[i].m), Fv[i][1]/(arr[i].m));
  }

  //MOMENTUM

  for (let i = 0; i < arr.length; i ++) {
    for (let j = i + 1; j < arr.length; j ++) {
      if (bounce(arr[i],arr[j])) {//i is 1, j is 2
        
        let dx = arr[i].x - arr[j].x;
        let dy = arr[i].y - arr[j].y;
        let p = (arr[i].m * (arr[i].vx**2 + arr[i].vy**2)**0.5) + (arr[j].m * (arr[j].vx**2 + arr[j].vy**2)**0.5);

        
        arr[i].vx = (p/arr[i].m)*(dx/(dx**2 + dy**2)**0.5);
        arr[i].vy = (p/arr[i].m)*(dy/(dx**2 + dy**2)**0.5);

        arr[j].vx = -(p/arr[j].m)*(dx/(dx**2 + dy**2)**0.5);
        arr[j].vy = -(p/arr[j].m)*(dy/(dx**2 + dy**2)**0.5);
        
      }
    }
  }


}
