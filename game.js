class GameOfLife {
    constructor(canvas, size = 50) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.cellSize = 10;
        this.grid = Array(size).fill().map(() => Array(size).fill(0));
        this.isRunning = false;
        this.animationId = null;
        this.speed = 5;

        // Set canvas size
        this.canvas.width = size * this.cellSize;
        this.canvas.height = size * this.cellSize;

        // Add click event listener
        this.canvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.cellSize);
        
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
            this.grid[y][x] = this.grid[y][x] ? 0 : 1;
            this.draw();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.ctx.fillStyle = this.grid[y][x] ? '#4CAF50' : 'white';
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
            }
        }
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newX = x + i;
                const newY = y + j;
                if (newX >= 0 && newX < this.size && newY >= 0 && newY < this.size) {
                    count += this.grid[newY][newX];
                }
            }
        }
        return count;
    }

    update() {
        const newGrid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const neighbors = this.countNeighbors(x, y);
                if (this.grid[y][x] === 1) {
                    newGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    newGrid[y][x] = neighbors === 3 ? 1 : 0;
                }
            }
        }
        
        this.grid = newGrid;
        this.draw();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.animationId = requestAnimationFrame(() => {
            setTimeout(() => this.animate(), 1000 / this.speed);
        });
    }

    clear() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.draw();
    }

    random() {
        this.grid = Array(this.size).fill().map(() => 
            Array(this.size).fill().map(() => Math.random() > 0.7 ? 1 : 0)
        );
        this.draw();
    }

    setSpeed(speed) {
        this.speed = speed;
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new GameOfLife(canvas);

    // Set up controls
    document.getElementById('start').addEventListener('click', () => game.start());
    document.getElementById('stop').addEventListener('click', () => game.stop());
    document.getElementById('clear').addEventListener('click', () => game.clear());
    document.getElementById('random').addEventListener('click', () => game.random());
    document.getElementById('speed').addEventListener('input', (e) => {
        game.setSpeed(e.target.value);
    });

    // Initial draw
    game.draw();
}); 