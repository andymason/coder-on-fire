/*
    Title:      HTML5 canvas galaxy experiment
    Version:    0.1
    Author:     Andrew Mason
    Contact:    andrew@coderonfire.com
    Site:       http://coderonfire.com/
    
    Description:
        Inspired by @seb_ly's talk at @fullfrontalconf, I started playing
        around with particles and practive more OOP JavaScript.
        
        This is very much a work in progress.
        
    Licence:
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// Galaxy Class
function galaxy() {
    // Constructor initalisation
    var particle_count = 500;
    var fps = 1000/25; // 25fps
    var time = 0;
    var speed_offset = 0;
    var canvas;
    var ctx;
    var center_x;
    var center_y;
    var max_width = 700;
    var img_dot;
    var img_src = 'blue_dot.png';
    var game_interval;
    var particles = new Array();

    function addParticle(count) {
        var particle = createParticle(count);
        particles.push(particle);
    }

    function createParticle(count) {
        //var radius = (Math.log(count) / Math.log(2) * 20) + 10;
        var radius = count/2 + 10;
        var particle = new Particle(radius);
        return particle;
    }

    function updateParticles() {
        var particleCount = particles.length;
        for (var i=0; i<particleCount; i++) {
            particles[i].move();
        }
    }

    function drawParticles() {
        var particleCount = particles.length;
        //ctx.globalCompositeOperation = 'lighter';
        for (var i=0; i<particleCount; i++) {
            var position = particles[i].getPosition();
            ctx.fillRect(position.x, position.y, 1, 1);
            //ctx.drawImage(img_dot, x, y);
        }
        //ctx.globalCompositeOperation = 'source-over';
    }

    function releaseParticles() {
        for (var i=0; i < particle_count; i++) {
            addParticle(i);
        }
    }

    function setupCanvas() {
        var page_width = document.body.offsetWidth;
        canvas = document.querySelector('canvas');
        resizeCanvas();
        ctx = canvas.getContext('2d');
        center_x = canvas.width / 2;
        center_y = canvas.height / 2;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function setupWindowResize() {
        window.addEventListener('resize', resizeCanvas, false);
    }
    
    function resizeCanvas() {
        var page_width = document.body.offsetWidth;
        // Prevent the canvas getting too big
        if (page_width >= max_width) {
            page_width = max_width;
        }
        canvas.width = page_width;
        center_x = canvas.width / 2;
        center_y = canvas.height / 2;
    }

    function gameLoop() {
        // Clear the canvas
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);        
        ctx.fillStyle = 'rgb(255, 255, 255)';

        // Update and draw all particles
        updateParticles();
        drawParticles();
    }

    function startEngine() {
        game_interval = setInterval(gameLoop, fps);
    }

    
    function setupControls() {
        var slider = document.querySelector('input[type="range"]');
        slider.onchange = changeSpeed;
    }
    
    function changeSpeed() {
        speed_offset = this.value/800;
    }
    
    // Particle Class
    var Particle = function(radius) {
        // Constructor initialisation
        var radius = radius;
        var x = Math.cos(Math.random()) * radius;
        var y = Math.sin(Math.random()) * radius;
        var speed = 1/(radius*3);
        //var speed = (Math.log(radius) / Math.log(2)) / 1500;
        var angle = Math.random()*Math.PI*2;
        
        // Method that returns x, y position object
        this.getPosition = function() {
            return {'x' : x, 'y' : y};
        }
        
        // Mathod that moves the partile's position based on speed and radius
        this.move = function() {
            x = center_x + (Math.cos(angle) * radius);
            y = center_y + (Math.sin(angle) * radius);
            angle = angle + (speed + speed_offset);
        }
    }

    // Privileged method to be called outside class
    this.init = function() {
        setupCanvas();
        releaseParticles();
        setupControls();
        setupWindowResize();
        startEngine();
    }
}

// Initialise and run
var galaxy = new galaxy;
galaxy.init();
