class Teleprompter {
    constructor() {
        this.isPlaying = false;
        this.position = 0;
        this.speed = 0.5;
        this.fontSize = 24;
        this.animationFrame = null;

        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.container = document.getElementById('prompter');
        this.textDisplay = document.getElementById('text-display');
        this.playPauseBtn = document.getElementById('playPause');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.inputText = document.getElementById('input-text');
        this.fontSizeDisplay = document.getElementById('fontSize');
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            this.speedValue.textContent = `${this.speed.toFixed(1)}x`;
        });
        this.inputText.addEventListener('input', (e) => {
            this.textDisplay.textContent = e.target.value;
        });
        document.getElementById('increaseFont').addEventListener('click', () => this.changeFontSize(2));
        document.getElementById('decreaseFont').addEventListener('click', () => this.changeFontSize(-2));

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    this.reset();
                    break;
                case 'ArrowUp':
                    this.speed = Math.min(this.speed + 0.1, 5);
                    this.updateSpeedControls();
                    break;
                case 'ArrowDown':
                    this.speed = Math.max(this.speed - 0.1, 0.1);
                    this.updateSpeedControls();
                    break;
            }
        });
    }

    updateSpeedControls() {
        this.speedSlider.value = this.speed;
        this.speedValue.textContent = `${this.speed.toFixed(1)}x`;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playPauseIcon.textContent = this.isPlaying ? '⏸' : '▶';
        
        if (this.isPlaying) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    animate() {
        if (!this.isPlaying) return;

        this.position += this.speed;
        const maxScroll = this.container.scrollHeight - this.container.clientHeight;

        if (this.position >= maxScroll) {
            this.position = maxScroll;
            this.isPlaying = false;
            this.playPauseIcon.textContent = '▶';
            return;
        }

        this.container.scrollTop = this.position;
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    reset() {
        this.position = 0;
        this.container.scrollTop = 0;
        this.isPlaying = false;
        this.playPauseIcon.textContent = '▶';
        cancelAnimationFrame(this.animationFrame);
    }

    changeFontSize(delta) {
        this.fontSize = Math.min(Math.max(this.fontSize + delta, 12), 48);
        this.textDisplay.style.fontSize = `${this.fontSize}px`;
        this.fontSizeDisplay.textContent = this.fontSize;
    }
}

// Initialize the teleprompter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Teleprompter();
});