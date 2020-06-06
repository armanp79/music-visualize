import React, { Component, createRef } from 'react';
import songFile from './Jewel.mp3';

// Changing Variables
let ctx, x_end, y_end, bar_height;
let theme = 0;
// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 1000;
const bar_width = 0.5;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;



class Canvas extends Component {
    constructor(props) {
        super(props)
        this.audio = new Audio(songFile);
        this.canvas = createRef();
    }

    animationLooper(canvas) {
        console.log("running looper");
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");

        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;

            // Calculate height of bar based on frequency of sound
            bar_height = this.frequency_array[i] * 2;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, this.frequency_array[i], ctx, canvas);
        }
    }


    getColor(frequency) {
        if (theme === 0) {
            return ("rgb(" + frequency + ", " + frequency + ", " + 0 +")")
        }
        else if (theme === 1) {
            return ("rgb(" + frequency + ", " + frequency + ", " + 600 +")")
        }
        else if (theme === 2) {
            return ("rgb(" + 600 + ", " + frequency + ", " + 600 +")")
        }
        else if (theme === 3) {
            return ("rgb(" + 600 + ", " + frequency + ", " + frequency +")")
        }
        else if (theme === 4) {
            return ("rgb(" + frequency + ", " + 600 + ", " + frequency +")")
        }        
    }

    drawBar(x1=0, y1=0, x2=0, y2=0, frequency, ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
        ctx.fillStyle = gradient;

        const lineColor = this.getColor(frequency);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = bar_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    

    componentDidMount() {
        // create a frequency array which is the data points a computer uses to recreate sound
        
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.context.createMediaElementSource(this.audio);

        this.analyser = this.context.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);


    }

    togglePlay = () => {
        const { audio } = this;
        if(audio.paused) {
            console.log("playing now");
            this.context.resume();
            audio.play();
            this.rafId = requestAnimationFrame(this.tick);

         } else {
            console.log("pausing now");
            audio.pause();
            cancelAnimationFrame(this.rafId);
         }
    }

    toggleTheme = () => {
        if (theme === 4){
            theme = 0;
        }
        else
        {
            theme += 1;
        }
    }

    tick = () => {
        this.animationLooper(this.canvas.current);
        this.analyser.getByteTimeDomainData(this.frequency_array);
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {
        return <>
            <button onClick={this.togglePlay}>Play/Pause</button>
            <button onClick={this.toggleTheme}>Change Theme</button>
            <canvas ref={this.canvas}  />
        </>
    }
}

export default Canvas;