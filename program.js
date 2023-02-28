// CONSTANTS

let CANVAS_WIDTH=800;
let CANVAS_HEIGHT=600;
let NANONAUT_WIDTH=181;
let NANONAUT_HEIGHT=229;
let GROUND_Y=540;
let NANONAUT_Y_ACCELERATION=1;
let SPACE_KEYCODE=32;
let NANONAUT_JUMP_SPEED=20;

// SETUP
let nanonautYSpeed=0;

let canvas=document.createElement('canvas');
let c = canvas.getContext('2d');
canvas.width=CANVAS_WIDTH;
canvas.height=CANVAS_HEIGHT;
document.body.appendChild(canvas);

let nanonautImage=new Image();
nanonautImage.src='images/nanonaut.png';

let backgroundImage=new Image();
backgroundImage.src='images/background.png';

let nanonautX=50;
let nanonautY=40;

//when player press key down it will go to onKeyDwon()
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

window.addEventListener('load', start);

function start(){
    window.requestAnimationFrame(mainLoop);
}

let spaceKeyIsPressed=false;

//MAIN LOOP

function mainLoop(){
    update();
    draw();
    window.requestAnimationFrame(mainLoop);
}

//PLAYER INPUT

function onKeyDown(event){
    //listen to events and look what exactly event
    console.log(event.keyCode);

    //check if the space was entered
    if (event.keyCode===SPACE_KEYCODE){
        spaceKeyIsPressed=true;
    }
}

function onKeyUp(event){
    //listen a jump command
    if(event.keyCode === SPACE_KEYCODE){
        spaceKeyIsPressed=false;
    }
}

//UPDATING

function update(){
    //
    if(spaceKeyIsPressed){
        nanonautYSpeed=-NANONAUT_JUMP_SPEED;
    }
    //update man and gravity
    nanonautY+=nanonautYSpeed;
    nanonautYSpeed+=NANONAUT_Y_ACCELERATION;
    //part for figure not to go down from visible area
    if(nanonautY>(GROUND_Y-NANONAUT_HEIGHT)){
        nanonautY=GROUND_Y-NANONAUT_HEIGHT;
        nanonautYSpeed=0;
    }
}

//DRAWING

function draw(){
    c.clearRect(0, 0 , CANVAS_WIDTH, CANVAS_HEIGHT);
    //draw the background: sky, ground 
    c.fillStyle='LightSkyBlue';
    c.fillRect(0,0,CANVAS_WIDTH,GROUND_Y-40);
    c.fillStyle='ForestGreen';
    c.fillRect(0, GROUND_Y-40, CANVAS_WIDTH,CANVAS_HEIGHT-GROUND_Y+40);
    //draw background
    c.drawImage(backgroundImage,0,-210);
    //draw the man figure
    c.drawImage(nanonautImage, nanonautX, nanonautY);
}