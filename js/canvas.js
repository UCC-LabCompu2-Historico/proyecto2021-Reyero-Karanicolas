canvas = document.getElementById("canvas");
canvas.width = 1360;
canvas.height = 700;
context = canvas.getContext("2d");
function clearCanvas() {
  context.fillStyle = "rgb(32, 32, 32)";
  context.fillRect(0, 0, canvas.width, canvas.height); 
}
class Vector {
     constructor(x, y) {
        this.x = x;
        this.y = y;
     }
    add(vector) {
      this.x+= vector.x;
      this.y+= vector.y;
    }
  }
  function inbounds(x, y, w, h) {
    if(x > canvas.width || (x+w) < 0 || (y+h) < 0 || y > canvas.height) {
       return false;
    } else {
       return true;
    }
  }
  function random(min, max) {
    return Math.random() * (max-min) + min;
  }
  class Smoke {
    constructor(x, y) {
      this.color = "red";
      this.maxSize = random(4, 6);
    
      var maxLifetime = 150;
      this.maxLifetime = maxLifetime;
      this.lifetime = random(1, maxLifetime);
      this.age = 0;
      
      this.gravity = new Vector(0, .05);
      this.windSpeed = .18;
      this.position = new Vector((x - this.maxSize/2), y);
      
      var maxVelocity = 5;
      this.maxVelocity = maxVelocity;
      this.velocity = new Vector(random(-maxVelocity, maxVelocity), random(0, maxVelocity));
    }
    animate() {
      var position = this.position;
      var velocity = this.velocity;
      
      velocity.add(this.gravity);
      velocity.x+= random(-this.windSpeed, this.windSpeed);
      
      position.add(velocity)
     
      var size = this.maxSize * (1 - (this.age / this.lifetime));
      
      context.fillStyle = this.color;
      context.fillRect(position.x, position.y, size, size);
      this.age++;
    }
  }
  class SmokeTrail {
    
    constructor(rocket) {
      this.rocket = rocket;
      this.smokes = [];
      this.smokesPerAnimation = 25;
    }
    animate() {
      var smokes = this.smokes;
      var rocket = this.rocket;
      for(var x = 0; x < this.smokesPerAnimation; x++) {
        smokes.push(new Smoke((rocket.position.x + rocket.width/2), (rocket.position.y + rocket.height)));
      }
      for(var x = 0; x < smokes.length; x++) {
        var smoke = smokes[x]; 
        if( !inbounds(smoke.position.x, smoke.position.y, smoke.size, smoke.size)
            || smoke.age >= smoke.lifetime) {
          smokes.splice(x, 1);
          x--;
        }
          smoke.animate();
      }
    }
  }
  class Rocket {
    constructor() {
      this.color = "cyan";
      this.width = 10;
      this.height = 20;
      this.acceleration = new Vector(0, -.15);
      
      this.smokeTrail = new SmokeTrail(this);
      
      this.reset();
    }
    reset() {
      this.position = new Vector((canvas.width - this.width)/2, canvas.height - this.height);
      this.velocity = new Vector(0, 0);
    }
    animate() {
      var position = this.position;
      this.velocity.add(this.acceleration);
      position.add(this.velocity);
      if(!inbounds(position.x, position.y, this.width, this.height)) {
        this.reset();
      }
      this.smokeTrail.animate();
      context.fillStyle = this.color;
      context.fillRect(position.x, position.y, this.width, this.height);
    }
  }
  rocket = new Rocket();
  function loop() {
    clearCanvas();
    rocket.animate();
  }
  setInterval(loop, 1000/60);