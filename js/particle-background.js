let particles = [];
const numParticles = 75; // Number of particles
const connectDistance = 120; // Max distance to connect particles

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block'); // Remove scrollbars if any
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1'); // Put canvas behind other content

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(random(width), random(height)));
    }
}

function draw() {
    clear(); // Clear canvas each frame to draw on transparent background (body bg will show)
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
        particles[i].edges();
        for (let j = i + 1; j < particles.length; j++) {
            particles[i].connectParticles(particles[j]);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(0.2, 0.8)); // Slower speed
        this.size = random(2, 4);
        this.color = color(200, 200, 200, 150); // Light gray, slightly transparent
    }

    update() {
        this.pos.add(this.vel);
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    edges() {
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }
        // Ensure particles stay within bounds if they somehow escape
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
    }

    connectParticles(other) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < connectDistance) {
            let alpha = map(d, 0, connectDistance, 200, 0); // Line opacity based on distance
            stroke(200, 200, 200, alpha * 0.5); // Lighter, more transparent lines
            strokeWeight(0.5); // Thinner lines
            line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
    }
}
