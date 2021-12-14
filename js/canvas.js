/**
 * Guarda vehiculo en local storage
 * @method saveVehicle
 * @param {string} rocket - vehiculo
 */
function saveVehicle(rocket) {
    localStorage.setItem("cohete", rocket);
}


/**
 * Guarda destino en local storage
 * @method saveDestination
 * @param {string} destination - destino
 */
function saveDestination(destination) {
    localStorage.setItem("destino", destination);
}


/**
 * toma destino en local storage
 * @method tomarDestination
 */
function tomarDestination() {
    var destination = localStorage.getItem("destino");
    document.getElementById("list 1").value = destination;
}


/**
 * toma vehiculo en local storage
 * @method tomarVehicle
 */
function tomarVehicle() {
    var rocket = localStorage.getItem("cohete");
    document.getElementById("list 2").value = rocket;
}


/**
 * Ejecuta canvas
 * @method launch
 */
function launch() {
    var select = 0;
    if (document.getElementById("list 1").value == 0)
        alert("No selecciono el destino");
    if (document.getElementById("list 2").value == 0)
        alert("No selecciono el vehículo");
    else {
        var time = (document.getElementById("list 1").value) / document.getElementById("list 2").value;
        alert("El viaje tomo : " + time / 86400 + " dias");
        window.location.href = "canvas.html";
        select =1;
    }
}

canvas = document.getElementById("canvas");
canvas.width = 1366;
canvas.height = 768;
context = canvas.getContext("2d");

context.font = "30px Arial";
context.fillText("HOLA", 0, 0);


/**
 * Resetea canvas
 * @method clearCanvas
 */
function clearCanvas() {
    context.fillStyle = "rgb(32, 32, 32)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * Setea coordenadas
 * @method Vector
 */
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
}


/**
 * Representa los limites del canvas
 * @method inbounds
 * @param {number} x - coordenada en eje x
 * @param {number} y - coordenada en eje x
 * @param {number} w - largo
 * @param {number} h - ancho
 * @return Valor devuelve verdadero si se puede ver en canvas
 */
function inbounds(x, y, w, h) {
    if (x > canvas.width || (x + w) < 0 || (y + h) < 0 || y > canvas.height) {
        return false;
    } else {
        return true;
    }
}


/**
 * toma un valor aleatorio
 * @method random
 * @param {number} min - valor minimo
 * @param {number} max - valor maximo
 * @return Valor en el rango especificado
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Representa una particula de humo, cada una se representa con un cuadrado que tiene una edad y un tiempo de duracion
 * @method Smoke
 */
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
        this.position = new Vector((x - this.maxSize / 2), y);

        var maxVelocity = 5;
        this.maxVelocity = maxVelocity;
        this.velocity = new Vector(random(-maxVelocity, maxVelocity), random(0, maxVelocity));
    }

    /**
     * Setea particulas de humo y las dibuja en el canvas
     * @method animate
     */
    animate() {
        var position = this.position;
        var velocity = this.velocity;

        velocity.add(this.gravity);
        velocity.x += random(-this.windSpeed, this.windSpeed);

        position.add(velocity)

        var size = this.maxSize * (1 - (this.age / this.lifetime));

        context.fillStyle = this.color;
        context.fillRect(position.x, position.y, size, size);
        this.age++;
    }
}


/**
 * Representa un grupo de particulas de humo que trabajan conjuntamente
 * @method SmokeTrail
 */
class SmokeTrail {
    constructor(rocket) {
        this.rocket = rocket;
        this.smokes = [];
        this.smokesPerAnimation = 25;
    }

    /**
     * Setea nuevas particualas y elimina las que superiaron su periodo de vida o estan fuera del canvas
     * @method animate
     */
    //
    animate() {
        var smokes = this.smokes;
        var rocket = this.rocket;
        for (var x = 0; x < this.smokesPerAnimation; x++) {
            smokes.push(new Smoke((rocket.position.x + rocket.width / 2), (rocket.position.y + rocket.height)));
        }
        for (var x = 0; x < smokes.length; x++) {
            var smoke = smokes[x];

            if (!inbounds(smoke.position.x, smoke.position.y, smoke.size, smoke.size)
                || smoke.age >= smoke.lifetime) {

                smokes.splice(x, 1);
                x--;
            }

            smoke.animate();
        }
    }
}


/**
 * Representa el cohete con una posicion, velocidad, aceleracion y el humo que expulsa
 * @method SmokeTrail
 */
class Rocket {
    constructor() {
        this.color = "black";
        this.width = 10;
        this.height = 20;


        if (localStorage.getItem("cohete") == 299999999) {
            this.acceleration = new Vector(0, -10);
        }
        if (localStorage.getItem("cohete") == 73888.77) {
            this.acceleration = new Vector(0, -1);
        }
        if (localStorage.getItem("cohete") == 48277.77) {
            this.acceleration = new Vector(0, -.70);
        }
        if (localStorage.getItem("cohete") == 16093.33) {
            this.acceleration = new Vector(0, -.30);
        }
        if (localStorage.getItem("cohete") == 5127.77) {
            this.acceleration = new Vector(0, -.10);
        }
        if (localStorage.getItem("cohete") == 4794.72) {
            this.acceleration = new Vector(0, -.3);
        }
        this.smokeTrail = new SmokeTrail(this);
        this.reset();
    }

    /**
     * Posiciona el cohete abajo del canvas
     * @method reset
     */
    reset() {
        this.position = new Vector((canvas.width - this.width) / 2, canvas.height - this.height);
        this.velocity = new Vector(0, 0);
    }

    /**
     * Setea las propiedades del cohete
     * @method animate
     */
    animate() {
        var position = this.position;

        this.velocity.add(this.acceleration);
        position.add(this.velocity);

        if (!inbounds(position.x, position.y, this.width, this.height)) {
            this.reset();
        }

        this.smokeTrail.animate();

        context.fillStyle = this.color;
        context.fillRect(position.x, position.y, this.width, this.height);
    }
}

rocket = new Rocket();

/**
 * Setea el canvas y dibuja el cohete
 * @method loop
 */
function loop() {
    clearCanvas();
    rocket.animate();
}

/**
 * Setea canvas para que se repita a 60fps
 * @method setInterval
 */
setInterval(loop, 1000 / 60);
