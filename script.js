//initial screen
const initialScreen = document.querySelector('.initial-screen')
const anyDifficultButton = document.querySelectorAll('.difficult-button')
let difficult

//get ready screen
const getReadyScreen = document.querySelector('.get-ready-screen')
const getReadyDisplay = document.querySelector('.get-ready-display')

//game screen
const gameScreen = document.querySelector('.game-screen')
    //screen in percentage
    const screenTopWall = 455
    const screenRightWall = 570
    const screenBottomWall = 0
    const screenLeftWall = 0   
    //blocks
    const allBlocks = document.querySelectorAll('.block')
    let allBlocksArray
    let blockWidth
    let blockHeight
    let blockTopWall
    let blockRightWall
    let blockBottomWall    
    let blockLeftWall
    //user
    const userDisplay = document.querySelector('.user')
    let userWidth
    let userHeight
    let userTopWall
    let userRightWall      
    let userLeftWall
    //ball
    const ballDisplay = document.querySelector('.ball')
    let ballDiameter
    let ballTopWall
    let ballRightWall
    let ballLeftWall
    let ballBottomWall
    let ballXDirection
    let ballYDirection  
    //score
    let score
    const scoreDisplay = document.querySelector('.score')
    //timer
    let timer

//post game screen
const postGameScreen = document.querySelector('.post-game-screen')
const finalScoreDisplay = document.querySelector('.final-score')
const messageDisplay = document.querySelector('.message')
const playAgainButton = document.querySelector('.play-again-button')



const prepareInitialScreen = () => {
    initialScreen.style.display = 'flex'
    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'none'
    postGameScreen.style.display = 'none'
    chooseDifficult()
}

const chooseDifficult = () => {
    anyDifficultButton.forEach(button => {
        button.addEventListener('click', event => {
            difficult = event.target.id
            getReady()
        })
    })
}

const getReady = () => {
    initialScreen.style.display = 'none'
    getReadyScreen.style.display = 'flex'
    getReadyDisplay.innerHTML = 3
    setTimeout( () => {getReadyDisplay.innerHTML = 2}, 500)
    setTimeout( () => {getReadyDisplay.innerHTML = 1}, 1000)
    setTimeout( () => {getReadyDisplay.innerHTML = 'GO!'}, 1500)
    setTimeout(startGame, 2000)
}

const startGame = () => {
    resetInitialParameters()
    document.addEventListener('keydown', moveUserByKeyboard)
    if (difficult == 'easy') {
        timer = setInterval(moveBall, 50)   
    } else if (difficult == 'normal') {
        timer = setInterval(moveBall, 25)   
    } else {
        timer = setInterval(moveBall, 10)   
    }   
}

const resetInitialParameters = () => {
    //screen settings
    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'flex'
    
    //block settings
    blockWidth = 90
    blockHeight = 25
    allBlocksArray = Array.from(allBlocks)
    allBlocksArray.forEach(block => block.style.display = 'block')
    
    
    //user settings
    userWidth = 110
    userHeight = 25
    userBottomWall = 10
    userTopWall = userBottomWall + userHeight
    userLeftWall = 230
    userRightWall = userLeftWall + userWidth
    userDisplay.style.left = userLeftWall + 'px'
    
    //ball settings     
    ballDiameter = 20
    ballLeftWall = 280
    ballBottomWall = 45
    ballTopWall = ballBottomWall + ballDiameter        
    ballRightWall = ballLeftWall + ballDiameter
    ballDisplay.style.left = ballLeftWall + 'px'
    ballDisplay.style.bottom = ballBottomWall + 'px'
        //make ball direction random at the start of the game
        if (Math.floor(Math.random() * 12) >= 9) {
            ballXDirection = -5
            ballYDirection = 5
        } else if (Math.floor(Math.random() * 12) >= 6) {
            ballXDirection = -5
            ballYDirection = -5
        } else if (Math.floor(Math.random() * 12) >= 3) {
            ballXDirection = 5
            ballYDirection = -5
        } else {
            ballXDirection = 5
            ballYDirection = 5
        }
    
    //overall settings
    score = 0
    scoreDisplay.innerHTML = 0
    clearInterval(timer)
    messageDisplay.innerHTML = null
    messageDisplay.style.color = 'black'
    finalScoreDisplay.innerHTML = null
}

const moveUserByKeyboard = (e) => {   
    if (e.key == 'ArrowLeft' && userLeftWall != screenLeftWall) {
        userLeftWall -= 23
        userRightWall -= 23
        userDisplay.style.left = userLeftWall + 'px'
    } else if (e.key =='ArrowRight' && userRightWall != screenRightWall) {
        userLeftWall += 23
        userRightWall += 23
        userDisplay.style.left = userLeftWall + 'px'
    }
    userTopWallCollision()
    userLeftWallCollision()
    userRightWallCollision()
}

const moveUserByClick = (direction) => {
    if (direction == 'left' && userLeftWall != screenLeftWall) {
        userLeftWall -= 23
        userRightWall -= 23
        userDisplay.style.left = userLeftWall + 'px'
    } else if (direction == 'right' && userRightWall != screenRightWall) {
        userLeftWall += 23
        userRightWall += 23
        userDisplay.style.left = userLeftWall + 'px'
    }
    userTopWallCollision()
    userLeftWallCollision()
    userRightWallCollision()
}

const moveBall = () => {        
    ballLeftWall += ballXDirection
    ballBottomWall += ballYDirection
    ballTopWall += ballYDirection
    ballRightWall += ballXDirection
    ballDisplay.style.left = ballLeftWall + "px"
    ballDisplay.style.bottom = ballBottomWall + "px"
    checkAllCollisions()        
} 

const checkAllCollisions = () => {
    screenTopWallCollision()
    screenRightWallCollision()
    screenBottomWallCollision()
    screenLeftWallCollision()        
    
    userTopWallCollision()
    userRightWallCollision()
    userLeftWallCollision()
    
    blockTopWallCollision()
    blockRightWallCollision()
    blockBottomWallCollision()
    blockLeftWallCollision()        
}

const screenTopWallCollision = () => {
    //if ball moving left and up
    if (ballXDirection < 0 && ballYDirection > 0) {
        //and hits screen top wall
        if (ballTopWall == screenTopWall) {
            //change ball direction to left and down
            changeDirection('left', 'down')
        }
    }
    //if ball moving right and up
    if (ballXDirection > 0 && ballYDirection > 0) {
        //and hits screen top wall
        if (ballTopWall == screenTopWall) {
            //change ball direction to right and down
            changeDirection('right', 'down')
        }
    }
}
const screenRightWallCollision = () => {
    //if ball moving right and up
    if (ballXDirection > 0 && ballYDirection > 0) {
        //and hits screen right wall
        if (ballRightWall == screenRightWall) {
            //change ball direction to left and up
            changeDirection('left', 'up')
        }
    }
    //if ball moving right and down
    if (ballXDirection > 0 && ballYDirection < 0) {
        //and hits screen right wall
        if (ballRightWall == screenRightWall) {
            //change ball direction to left and down
            changeDirection('left', 'down')
        }
    }
}
const screenBottomWallCollision = () => {
    if (ballBottomWall == screenBottomWall) {
        gameOver()
    }
}
const screenLeftWallCollision = () => {
    //if ball moving left and up
    if (ballXDirection < 0 && ballYDirection > 0) {
        //and hits screen left wall
        if (ballLeftWall == screenLeftWall) {
            //change ball direction to right and up
            changeDirection('right', 'up')
        }
    }
    //if ball moving left and down
    if (ballXDirection < 0 && ballYDirection < 0) {
        //and hits screen left wall
        if (ballLeftWall == screenLeftWall) {
            //change ball direction to right and down
            changeDirection('right', 'down')
        }
    }
}
const userTopWallCollision = () => {
    //if ball moving left and down
    if (ballXDirection < 0 && ballYDirection < 0) {
        //and hits user top wall
        if (
            ballBottomWall == userTopWall &&
            ballLeftWall <= userRightWall &&
            ballRightWall >= userLeftWall
            ) {
            //change ball direction to left and up
            changeDirection('left', 'up')
        }
    }
    //if ball moving right and down
    if (ballXDirection > 0 && ballYDirection < 0) {
        //and hits user top wall
        if (
            ballBottomWall == userTopWall &&
            ballLeftWall <= userRightWall &&
            ballRightWall >= userLeftWall
            ) {
            //change ball direction to right and up
            changeDirection('right', 'up')
        }
    }
}
const userRightWallCollision = () => {
    //if ball moving right and down
    if (ballXDirection > 0 && ballYDirection < 0) {
        //and hits user right wall
        if (
            ballRightWall == userLeftWall &&
            ballBottomWall < userTopWall
            ) {
            //change ball direction to left and down
            changeDirection('left', 'down')
        }
    }
}
const userLeftWallCollision = () => {
    //if ball moving left and down
    if (ballXDirection < 0 && ballYDirection < 0) {
        //and hits user left wall
        if (
            ballLeftWall == userRightWall &&
            ballBottomWall < userTopWall
            ) {
            //change ball direction to right and down
            changeDirection('right', 'down')
        }
    }
}
const blockTopWallCollision = () => {
    allBlocksArray.forEach(block => {
        //block settings            
        blockBottomWall = Number(window.getComputedStyle(block, null).bottom.replace('px', ''))
        blockLeftWall = Number(window.getComputedStyle(block, null).left.replace('px', ''))
        blockTopWall = blockBottomWall + blockHeight
        blockRightWall = blockLeftWall + blockWidth

        //if ball moving left and down
        if (ballXDirection < 0 && ballYDirection < 0) {
            //and hits block top wall
            if (
                ballBottomWall == blockTopWall &&
                ballLeftWall <= blockRightWall &&
                ballRightWall >= blockLeftWall
                ) {
                //change ball direction to left and up
                changeDirection('left', 'up')
                blockHit(block)
            }
        }
        //if ball moving right and down
        if (ballXDirection > 0 && ballYDirection < 0) {
            //and hits block top wall
            if (
                ballBottomWall == blockTopWall &&
                ballLeftWall <= blockRightWall &&
                ballRightWall >= blockLeftWall
                ) {
                //change ball direction to right and up
                changeDirection('right', 'up')
                blockHit(block)
            }
        }
    })
}
const blockRightWallCollision = () => {
    allBlocksArray.forEach(block => {
        //block settings            
        blockBottomWall = Number(window.getComputedStyle(block, null).bottom.replace('px', ''))
        blockLeftWall = Number(window.getComputedStyle(block, null).left.replace('px', ''))
        blockTopWall = blockBottomWall + blockHeight
        blockRightWall = blockLeftWall + blockWidth

        //if ball moving left and down
        if (ballXDirection < 0 && ballYDirection < 0) {
            //and hits block right wall
            if (
                ballLeftWall == blockRightWall &&
                ballBottomWall < blockTopWall &&
                ballTopWall > blockBottomWall
                ) {
                //change ball direction to right and down
                changeDirection('right', 'down')
                blockHit(block)
            }
        }
        //if ball moving left and up
        if (ballXDirection < 0 && ballYDirection > 0) {
            //and hits block right wall
            if (
                ballLeftWall == blockRightWall &&
                ballBottomWall < blockTopWall &&
                ballTopWall > blockBottomWall
                ) {
                //change ball direction to right and up
                changeDirection('right', 'up')
                blockHit(block)
            }
        }
    })
}
const blockBottomWallCollision = () => {
    allBlocksArray.forEach(block => {
        //block settings            
        blockBottomWall = Number(window.getComputedStyle(block, null).bottom.replace('px', ''))
        blockLeftWall = Number(window.getComputedStyle(block, null).left.replace('px', ''))
        blockTopWall = blockBottomWall + blockHeight
        blockRightWall = blockLeftWall + blockWidth
        
        //if ball moving left and up
        if (ballXDirection < 0 && ballYDirection > 0) {
            //and hits block bottom wall
            if (
                ballTopWall == blockBottomWall &&
                ballLeftWall <= blockRightWall &&
                ballRightWall >= blockLeftWall
                ) {
                //change ball direction to left and down
                changeDirection('left', 'down')
                blockHit(block)                  
            }
        }
        //if ball moving right and up
        if (ballXDirection > 0 && ballYDirection > 0) {
            //and hits block bottom wall
            if (
                ballTopWall == blockBottomWall &&
                ballLeftWall <= blockRightWall &&
                ballRightWall >= blockLeftWall
                ) {
                //change ball direction to right and down
                changeDirection('right', 'down')
                blockHit(block)              
            }
        }
    })
}
const blockLeftWallCollision = () => {
    allBlocksArray.forEach(block => {
        //block settings            
        blockBottomWall = Number(window.getComputedStyle(block, null).bottom.replace('px', ''))
        blockLeftWall = Number(window.getComputedStyle(block, null).left.replace('px', ''))
        blockTopWall = blockBottomWall + blockHeight
        blockRightWall = blockLeftWall + blockWidth

        //if ball moving right and down
        if (ballXDirection > 0 && ballYDirection < 0) {
            //and hits block left wall
            if (
                ballRightWall == blockLeftWall &&
                ballBottomWall < blockTopWall &&
                ballTopWall > blockBottomWall
                ) {
                //change ball direction to left and down
                changeDirection('left', 'down')
                blockHit(block)
            }
        }
        //if ball moving right and up
        if (ballXDirection > 0 && ballYDirection > 0) {
            //and hits block left wall
            if (
                ballRightWall == blockLeftWall &&
                ballBottomWall < blockTopWall &&
                ballTopWall > blockBottomWall
                ) {
                //change ball direction to left and up
                changeDirection('left', 'up')
                blockHit(block)
            }
        }
    })
}    

const changeDirection = (xDirection, yDirection) => {

    //COUNTER CLOCKWISE
    if (xDirection == 'left' && yDirection == 'up') {            
        ballXDirection = -5 //change x direction to left
        ballYDirection = 5  //change y direction to up
    }
    else if (xDirection == 'left' && yDirection == 'down') {            
        ballXDirection = -5 //change x direction to left
        ballYDirection = -5  //change y direction to down
    }
    else if (xDirection == 'right' && yDirection == 'down') {            
        ballXDirection = 5 //change x direction to right
        ballYDirection = -5  //change y direction to down
    }
    else if (xDirection == 'right' && yDirection == 'up') {            
        ballXDirection = 5 //change x direction to right
        ballYDirection = 5  //change y direction to up
    }

    //CLOCKWISE
    else if (xDirection == 'right' && yDirection == 'up') {            
        ballXDirection = 5 //change x direction to right
        ballYDirection = 5  //change y direction to up
    }
    else if (xDirection == 'right' && yDirection == 'down') {            
        ballXDirection = 5 //change x direction to right
        ballYDirection = -5  //change y direction to down
    }
    else if (xDirection == 'left' && yDirection == 'down') {            
        ballXDirection = -5 //change x direction to left
        ballYDirection = -5  //change y direction to down
    }
    else if (xDirection == 'left' && yDirection == 'up') {            
        ballXDirection = -5 //change x direction to left
        ballYDirection = 5  //change y direction to up
    }
}

const blockHit = (block) => {
    score++
    scoreDisplay.innerHTML = score
    block.style.display = 'none'
    allBlocksArray.splice(allBlocksArray.indexOf(block), 1)
    checkWin()  
}

const checkWin = () => {
    if (allBlocksArray.length == 0) {
        clearInterval(timer)
        document.removeEventListener('keydown', moveUserByKeyboard)
        gameScreen.style.display = 'none'
        postGameScreen.style.display = 'flex'    
        messageDisplay.innerHTML = 'Nice! You won!'
        playAgain()
    }
}

const gameOver = () => {
    clearInterval(timer)
    document.removeEventListener('keydown', moveUserByKeyboard)
    gameScreen.style.display = 'none'
    postGameScreen.style.display = 'flex'    
    messageDisplay.innerHTML = 'Oh no...you lost, try again!'
    messageDisplay.style.color = 'red'
    finalScoreDisplay.innerHTML = `Final score: ${score}`
    playAgain()
}

const playAgain = () => {
    playAgainButton.addEventListener('click', () => {
        prepareInitialScreen()
    })
}

prepareInitialScreen()
