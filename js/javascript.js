
  //변수선언
  const map = document.querySelector('.map')
  const intro = document.querySelector('.intro')
  const snakeFrame = document.querySelector('.snakeFrame')
  const snakeHead = snakeFrame.querySelector('.snakeHead')
  let snakeBody = snakeFrame.querySelectorAll('span:not(.snakeHead')
  const start = document.querySelector('.game_start')
  const reStart = document.querySelector('.newGame')
  let gameStart;
  let x = 0;
  let y = 0;
  let inc = 60;
  let direction = "right"
  let prevX , prevY ;
  let keyState = true;
  let bodyArea = [] ;
  let feedRect ;
  let headRect = 1 ;
  let mapRect ;
  let wallRect;
  let apple;
  let speed = 800 ;
  
  // 움직임 함수
  const moveSnake =()=>{
    let nextX = x ;
    let nextY = y ;
    let wallArr = map.querySelectorAll('.wall')
    let bodyArr = snakeFrame.querySelectorAll('span:not(.snakeHead)')
    mapRect = map.getBoundingClientRect() 
    headRect = snakeHead.getBoundingClientRect();
    apple = document.querySelector('.apple')
    feedRect = apple.getBoundingClientRect();
    keyState = true;

    if( direction == "right"){
      nextX += inc;
    }else if( direction == 'left'){
      nextX -= inc;
    }else if( direction == 'top'){
      nextY -= inc;
    }else if(direction == 'bottom'){
      nextY += inc;
    }
    prevX = x
    prevY = y

    // map 밖에 나가면 게임 종료
    if (nextX < 0 || nextX + 60 >= mapRect.width || nextY < 0 || nextY + 60 >= mapRect.height) {
      gameOver();
      clearInterval(gameStart);
      return;
    }
    // 머리가 몸통과 닿으면 게임 종료
    for (let i = 0; i < bodyArr.length; i++) {
      if (nextX+"px" == bodyArr[i].style.left&& nextY+"px" == bodyArr[i].style.top) {
        gameOver();
        clearInterval(gameStart);
        return;
      }
    }
    // 머리와 장애물이 충돌하면 게임 종료
    for( let t = 0 ; t <wallArr.length ; t++){
      if( nextX+"px" == wallArr[t].style.left && nextY+"px" == wallArr[t].style.top){
        gameOver();
        clearInterval(gameStart);
        return;
        console.log(111)
      }
    }

    x = nextX;
    y = nextY;
    snakeHead.style.left = x +"px"
    snakeHead.style.top = y +"px"

    // 몸통 움직임
    for (let i = 0; i < bodyArea.length; i++) {
      const currentBody = bodyArea[i];
      const tempX = currentBody.style.left;
      const tempY = currentBody.style.top;

      currentBody.style.left = prevX + 'px';
      currentBody.style.top = prevY + 'px';

      prevX = parseInt(tempX);
      prevY = parseInt(tempY);
    }

    // 먹이 먹기
    if( headRect.left == feedRect.left && headRect.right == feedRect.right && headRect.top == feedRect.top && headRect.bottom == feedRect.bottom ){
      map.removeChild(apple);
      feed();
      addBody();
      if(speed < 300){
        speed = speed
        clearInterval(gameStart)
        gameStart = setInterval(moveSnake , speed)
      }else{ 
        speed = speed - 30 ;
        clearInterval(gameStart)
        gameStart = setInterval(moveSnake , speed)
      }
    }

    // 몸통 색깔
    for(let k=0;k<snakeBody.length; k++){
      let rColor = Math.floor((Math.random()*30)+90)
      let gColor = Math.floor((Math.random()*30)+170)
      let bColor = Math.floor((Math.random()*30)+90)
      snakeBody[k].style.background = "rgb("+ rColor +","+ gColor +","+ bColor +")"
    }
  }
  //장애물 발생
  const wall =()=>{
    for( let u = 0 ; u<5 ; u++){
      let wallX = Math.floor(Math.random()*6)+3
      let wallY = Math.floor(Math.random()*6)+3
      let newWall = document.createElement('span')
      newWall.classList.add('wall')
      map.appendChild(newWall)
      newWall.style.left = (wallX * 60) +"px"
      newWall.style.top = (wallY * 60) +"px"
    }
  }
  //먹이 발생 
  const feed=()=>{
    let wallArr = document.querySelectorAll('.wall');
    let ablePosi = [];
    let posIndex ;  
    let posIndex2 ;
    let wallXY =[]
    let bodyXY =[]
    for (let i = 0; i < 10; i++) {
      for(let j = 0 ; j < 10; j++){
        ablePosi.push({ x : i*60+"px" , y : j*60+"px" });
      }
    }
    // 장애물이 없는 공간 탐색
    for(let i = 0; i < wallArr.length; i++){
      wallXY.push({ x : wallArr[i].style.left , y : wallArr[i].style.top })
    }

    for(let i= 0; i<wallXY.length ; i++){
      posIndex = ablePosi.findIndex((item) => item.x == wallXY[i].x && item.y == wallXY[i].y )
      ablePosi.splice(posIndex,1)
    }

    // 몸통이 없는 공간 탐색
    let nowBody = snakeFrame.querySelectorAll('span:not(.snakeHead)')
    for(let i= 0 ; i < nowBody.length; i++){
      bodyXY.push({ x : nowBody[i].style.left , y : nowBody[i].style.top })
    }
    for(let i= 0; i<bodyXY.length ; i++){
      posIndex2 = ablePosi.findIndex((item) => item.x == bodyXY[i].x && item.y == bodyXY[i].y )
      ablePosi.splice(posIndex2,1)
    }

    const randomIndex = ablePosi[Math.floor(Math.random() * ablePosi.length)]
    const randomX = randomIndex.x
    const randomY = randomIndex.y
    let newFeed = document.createElement('span');
    newFeed.classList.add('apple');
    map.appendChild(newFeed);
    newFeed.style.left = randomX;
    newFeed.style.top = randomY;
  }
  // 몸통 추가
  const addBody =()=>{
    let newSpan = document.createElement("span");
    let gColor = Math.floor((Math.random()*30)+200)
    newSpan.style.left = prevX +'px'
    newSpan.style.top = prevY +'px'
    newSpan.style.background = "rgb(73,"+ gColor + ",56)"
    snakeFrame.appendChild(newSpan)
    bodyArea.push(newSpan)
  }

  // 몸통 배열에 추가
  for(let j = 0 ; j < snakeBody.length; j++){
    bodyArea.push(snakeBody[j])
  }

  // 이벤트 관리 부분 게임시작
  start.addEventListener('click', ()=>{
    gameStart = setInterval(moveSnake , speed)
    wall();
    feed();
    start.style.display = 'none';
    intro.style.top = '-100%'
  })
  //게임종료
  const gameOver = ()=>{
    clearInterval(gameStart);
    alert('GAME OVER!');
    location.reload();
  }
  //방향키,방향 관리
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && keyState && direction != 'left') {
      direction = 'right';
      snakeHead.style.transform = 'rotate(0deg)';
    } else if (e.key === 'ArrowLeft' && keyState && direction != 'right' ) {
      direction = 'left';
      snakeHead.style.transform = 'rotate(180deg)';
    } else if (e.key === 'ArrowUp' && keyState && direction != 'bottom') {
      direction = 'top';
      snakeHead.style.transform = 'rotate(-90deg)';
    } else if (e.key === 'ArrowDown' && keyState && direction != 'top') {
      direction = 'bottom';
      snakeHead.style.transform = 'rotate(90deg)';
    }
    keyState = false
  });