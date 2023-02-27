let canvas=document.createElement('canvas');
canvas.width=800;
canvas.height=600;
document.body.appendChild(canvas);

let c=canvas.getContext('2d');

let image=new Image();  //creating object
image.src='images/nanonaut.png';

//points-keys from where to start drawing animation
let x=0;
let y=40;

window.addEventListener("load", start);

function start(){
    // c.fillStyle='green';
    // //coordinates of area to fill
    // c.fillRect(10,10,30,30); 

    // //object and coordinates where to put it 
    // c.drawImage(image,20,40);  

    window.requestAnimationFrame(loop);
}

function loop(){
    //following will clear unnecessary and only show moved one
    c.clearRect(0,0,800,600);
    //drawing code will go there
    c.drawImage(image, x, y)
    x+=1;
    //comand to draw intentions
    window.requestAnimationFrame(loop);
}

document.body.appendChild(canvas);
