// CONSTANTS
let CANVAS_WIDTH=800;
let CANVAS_HEIGHT=600;
let NANONAUT_WIDTH=181;
let NANONAUT_HEIGHT=229;
let GROUND_Y=540;
let NANONAUT_Y_ACCELERATION=1;
let SPACE_KEYCODE=32;
let NANONAUT_JUMP_SPEED=20;
let NANONAUT_X_SPEED=7;
let BACKGROUND_WIDTH=1000;
let NANONAUT_NR_ANIMATION_FRAMES=7;
let NANONAUT_ANIMATION_SPEED=2;
let ROBOT_HEIGHT=139;
let ROBOT_WIDTH=141;
let ROBOT_NR_ANIMATION_FRAMES=9;
let ROBOT_ANIMATION_SPEED=5;
let ROBOT_X_SPEED=4;
let MIN_DISTANCE_BETWEEN_ROBOTS=600;
let MAX_DISTANCE_BETWEEN_ROBOTS=1200;
let MAX_ACTIVE_ROBOTS=3;
let SCREENSHAKE_RADIUS=16;
let NANONAUT_MAX_HEALTH=100;

// SETUP
let nanonautYSpeed=0;
let screenshake=false;
let canvas=document.createElement('canvas');
let c = canvas.getContext('2d');
canvas.width=CANVAS_WIDTH;
canvas.height=CANVAS_HEIGHT;
document.body.appendChild(canvas);

let nanonautImage=new Image();
nanonautImage.src='images/animatedNanonaut.png';
let robotImage=new Image();
robotImage.src="images/animatedRobot.png";
let backgroundImage=new Image();
backgroundImage.src='images/background.png';
//delete background flash in the start of game
let nanonautX=CANVAS_WIDTH/2;
let nanonautY=GROUND_Y-CANVAS_HEIGHT;
//when player press key down it will go to onKeyDwon()
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
//start after everythinh will be loaded
window.addEventListener('load', start);
//detect the jump comand
let spaceKeyIsPressed=false;
//variable to limit flying of model
let nanonautIsInTheAir=false;
//variables to fix the viewport
let cameraX=0;
let cameraY=0;
//variable to store number of devided part of image to show
let nanonautFrameNR=0;
//count game frames
let gameFrameCounter=0;
//creating background elements
let bush1Image=new Image();
bush1Image.src='images/bush1.png';
let bush2Image=new Image();
bush2Image.src='images/bush2.png';

let nanonautSpriteSheet={
    nrFramesPerRow: 5,
    spriteWidth: NANONAUT_WIDTH, 
    spriteHeight: NANONAUT_HEIGHT,
    image: nanonautImage
}

let robotSpriteSheet={
    nrFramesPerRow:3,
    spriteWidth: ROBOT_WIDTH,
    spriteHeight: ROBOT_HEIGHT,
    image: robotImage
};

let robotData=[{
    x:1000,
    y : GROUND_Y-ROBOT_HEIGHT,
    frameNr:0
}];

let nanonautCollisionRectangle={
    xOffset:60,
    yOffset:20,
    width:50, 
    height:200
};
let robotCollisionRectangle={
    xOffset:50,
    yOffset:20,
    width:50, 
    height:100
};

let bushData=generateBushes();

//start point of game
function start(){
    window.requestAnimationFrame(mainLoop);
}

function generateBushes(){
    let generatedBushData=[];
    let bushX=0;
    while(bushX<(2*CANVAS_WIDTH)){
        let bushImage;
        if(Math.random()>=0.5){
            bushImage=bush1Image;
        }else{
            bushImage=bush2Image;
        }
        generatedBushData.push({
            x:550+Math.random()*CANVAS_WIDTH*3, 
            y:75+Math.random()*20,
            image: bushImage
        });
        bushX+=150+Math.random()*250;
    }
    
    return generatedBushData;
}

let nanonautHealth=NANONAUT_MAX_HEALTH;



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
    gameFrameCounter+=1;
    //allows figure to move horisontally
    nanonautX+=NANONAUT_X_SPEED+2;
    //to allow jumping only when figure is not in the air
    if(spaceKeyIsPressed && !nanonautIsInTheAir){
        nanonautYSpeed=-NANONAUT_JUMP_SPEED;
        nanonautIsInTheAir=true;
    }
    //update man and gravity
    nanonautY+=nanonautYSpeed;
    nanonautYSpeed+=NANONAUT_Y_ACCELERATION;
    //part for figure not to go down from visible area
    if(nanonautY>(GROUND_Y-NANONAUT_HEIGHT)){
        nanonautY=GROUND_Y-NANONAUT_HEIGHT;
        nanonautYSpeed=0;
        nanonautIsInTheAir=false;
    }
    //update animation
    if((gameFrameCounter%NANONAUT_ANIMATION_SPEED)===0){
        nanonautFrameNR+=1;
        if(nanonautFrameNR>=NANONAUT_NR_ANIMATION_FRAMES){
            nanonautFrameNR=0;
        }
    }
    //updating camera position to fix the figure and move background
    cameraX=nanonautX-150;
    //scroll two elements to return later
    for(let i=0; i<bushData.length; i++){
        if((bushData[i].x -cameraX)<-CANVAS_WIDTH){
            bushData[i].x+=(2*CANVAS_WIDTH)+150;
        }
    }
    //update robot
    // updateRobots();
    screenshake=false;
    var nanonautTouchedRobot=updateRobots();
    if(nanonautTouchedRobot){
        screenshake=true;
        if(nanonautHealth>0) nanonautHealth-=1;
    }

}

function updateRobots(){
    //move and animate robot
    let nanonautTouchedRobot=false;
    for(let i =0; i<robotData.length; i++){
        if(doesOverlapRobot(nanonautX+nanonautCollisionRectangle.xOffset, nanonautY+nanonautCollisionRectangle.yOffset, nanonautCollisionRectangle.width,
            nanonautCollisionRectangle.height,
            robotData[i].x +robotCollisionRectangle.xOffset,
            robotData[i].y +robotCollisionRectangle.yOffset,
            robotCollisionRectangle.width,
            robotCollisionRectangle.height)){
                nanonautTouchedRobot=true;
        }
        robotData[i].x-=ROBOT_X_SPEED;
        if((gameFrameCounter%ROBOT_ANIMATION_SPEED)===0){
            robotData[i].frameNr+=1;
            if(robotData[i].frameNr>=ROBOT_NR_ANIMATION_FRAMES){
                robotData[i].frameNr=0;
            }
        }
    }
    //remove robots that have gone off-screen
    let robotIndex=0;
    while(robotIndex<robotData.length){
        if(robotData[robotIndex].x<cameraX-ROBOT_WIDTH) {
            robotData.splice(robotIndex,1);
            console.log("robot removed");
        }else {
            robotIndex+=1;
        }
    }

    if(robotData.length<MAX_ACTIVE_ROBOTS){
        
       
        let lastRobotX=CANVAS_WIDTH;
        if(robotData.length>0){
            lastRobotX=robotData[robotData.length-1].x;
        } 
        let newRobotX=lastRobotX+MIN_DISTANCE_BETWEEN_ROBOTS+Math.random()*(MAX_DISTANCE_BETWEEN_ROBOTS-MIN_DISTANCE_BETWEEN_ROBOTS);
        robotData.push({
            x: newRobotX,
            y: GROUND_Y-ROBOT_HEIGHT,
            frameNr:0
        });
    }
    return nanonautTouchedRobot;
}

function doesOverlap(nanonautNearX, nanonautFarX, robotNearX, robotFarX){
    let nanonautOverlapsNearRobotEdge=(nanonautFarX>=robotNearX) && (nanonautFarX<=robotFarX);
    let nanonautOverlapsFarRobotEdge=(nanonautNearX>=robotNearX) && (nanonautNearX<= robotFarX);
    let nanonautOverlapsEntireRobot=(nanonautNearX<=robotNearX) && (nanonautFarX>=robotFarX);
    return nanonautOverlapsNearRobotEdge || nanonautOverlapsFarRobotEdge || nanonautOverlapsEntireRobot;
}

function doesOverlapRobot(nanonautX, nanonautY, nanonautWidth, nanonautHeight, robotX , robotY, robotWidth, robotHeight){
    let nanonautOverlapsRobotOnXAxis=doesOverlap(
        nanonautX, 
        nanonautX+nanonautWidth, 
        robotX, 
        robotX+robotWidth
    );
    let nanonautOverlapsRobotOnYAxis=doesOverlap(
        nanonautY, 
        nanonautY+nanonautHeight,
        robotY, 
        robotY+robotHeight
    );
    return nanonautOverlapsRobotOnXAxis && nanonautOverlapsRobotOnYAxis;
}

//DRAWING

function draw(){
    //shake camera if necessary
    let shakenCameraX=cameraX;
    let shakenCameraY=cameraY;
    if(screenshake){
        //to do:shake camera at X and Y
        shakenCameraX+=(Math.random()-.5)*SCREENSHAKE_RADIUS;
        shakenCameraY+=(Math.random()-.5)*SCREENSHAKE_RADIUS;

    }

    c.clearRect(0, 0 , CANVAS_WIDTH, CANVAS_HEIGHT);
    //draw the background: sky, ground 
    c.fillStyle='LightSkyBlue';
    c.fillRect(0,0,CANVAS_WIDTH,GROUND_Y-40);
    c.fillStyle='ForestGreen';
    c.fillRect(0, GROUND_Y-40, CANVAS_WIDTH,CANVAS_HEIGHT-GROUND_Y+40);
    //draw background and making it scrolls without gaps
    let backgroundX=-(shakenCameraX%BACKGROUND_WIDTH);
    c.drawImage(backgroundImage,backgroundX,-210);
    c.drawImage(backgroundImage, backgroundX+BACKGROUND_WIDTH, -210);

    //draw elements from store
    for(let i=0; i<bushData.length; i++){
        c.drawImage(bushData[i].image, bushData[i].x -shakenCameraX, GROUND_Y- bushData[i].y -shakenCameraY);
    }

    //draw the robot
    for(let i=0; i<robotData.length; i++){
        drawAnimatedSprite(robotData[i].x-shakenCameraX,
            robotData[i].y -shakenCameraY, robotData[i].frameNr, robotSpriteSheet);
    }

    //draw the nano
    drawAnimatedSprite(nanonautX-shakenCameraX, nanonautY-shakenCameraY, nanonautFrameNR, nanonautSpriteSheet);

    //draw health bar
    c.fillStyle='red';
    c.fillRect(400,10, nanonautHealth/NANONAUT_MAX_HEALTH*380,20);
    c.strokeStyle='red';
    c.strokeRect(400,10,380,20);

    //draw animated sprite
    function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet){
        let spriteSheetRow=Math.floor(frameNr/spriteSheet.nrFramesPerRow);
        let spriteSheetColumn=frameNr%spriteSheet.nrFramesPerRow;
        let spriteSheetX=spriteSheetColumn*spriteSheet.spriteWidth;
        let spriteSheetY=spriteSheetRow*spriteSheet.spriteHeight;
        c.drawImage(
            spriteSheet.image,
            spriteSheetX, spriteSheetY,
            spriteSheet.spriteWidth, spriteSheet.spriteHeight, screenX, screenY,
            spriteSheet.spriteWidth, spriteSheet.spriteHeight
        );
    }

}