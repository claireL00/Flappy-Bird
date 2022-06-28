c = document.getElementById("canvas")
var context = c.getContext("2d");
const bird = new Image();
bird.src="bird.png"
birdX = birdDY = score = bestScore = 0; //BirdDY vertical speed of bird 
interval = birdSize = pipeWidth = topPipeBottomY= 24;
birdY = pipeGap= 200;
canvasSize = pipeX =   400;
c.onclick = () => (birdDY = 9)
setInterval(() => {
    context.fillStyle = "skyblue";
    context.fillRect(0,0,canvasSize,canvasSize); //Draw sky
    birdY-= birdDY -= 0.5; //gravity
    context.drawImage(bird,birdX,birdY, birdSize*(524/374), birdSize); //Draw bird
    context.fillStyle="green";
    pipeX -=8;
    pipeX < -pipeWidth && 
        ((pipeX = canvasSize), (topPipeBottomY = pipeGap* Math.random())); //pipe offscreen? create another pipe
    context.fillRect(pipeX,0,pipeWidth, topPipeBottomY);//draw top pipe
    context.fillRect(pipeX,topPipeBottomY+pipeGap,pipeWidth, canvasSize);//draw bottom pipe
    context.fillStyle="black";
    context.font="15px Courier New";
    context.fillText(score++,9,25); //display score
    bestScore=bestScore < score ? score : bestScore; //if bestscore < score, bestscore= score else bestscore=bestscore
    context.fillText(`Best: ${bestScore}`,9,50); //displaybestscore
    (((birdY < topPipeBottomY || birdY > topPipeBottomY+ pipeGap)//Bird hit pipe
    && pipeX < birdSize * (524/374)) || birdY > canvasSize) //bird falls off the screen
    && ((birdDY=0), (birdY=200), (pipeX=canvasSize),(score = 0)); //bird died
},interval)
