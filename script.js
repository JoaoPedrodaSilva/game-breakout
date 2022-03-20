const initialScreen = document.querySelector('#initial-screen')
const getReadyScreen = document.querySelector('#get-ready-screen')
const gameScreen = document.querySelector('#game-screen')
const postGameScreen = document.querySelector('#post-game-screen')
const anyDifficultButton = document.querySelectorAll('.difficult-button')
const getReadyDisplay = document.querySelector('#get-ready')
const scoreDisplay = document.querySelector('#score')
const finalScoreDisplay = document.querySelector('#final-score')
const messageDisplay = document.querySelector('#message')
const playAgainButton = document.querySelector('#play-again')
let allBlocks

const screenRightMargin = 570 //% of #iframe-container - maybe i can link it 
const screenLeftMargin = 0
const screenTopMargin = 513 //% of #iframe-container - maybe i can link it 
const screenBottomMargin = 0

const blockWidth = 100 // maybe could link it to the .block HTML element
const blockHeight = 20 // maybe could link it to the .block HTML element
let blocksArray

let user
let userCurrentPosition

let ball
let ballCurrentPosition
let ballXDirection
let ballYDirection
const ballDiameter = 20 // maybe could link it to the .ball HTML element

let difficult
let timer
let score
let playAgainFlag = false

class Block {
    constructor(xAxis, yAxis) {
        this.topEdge = yAxis + blockHeight
        this.rightEdge = xAxis + blockWidth
        this.bottomEdge = yAxis
        this.leftEdge = xAxis
    }
}

prepareInitialScreen = () => {
    initialScreen.style.display = 'flex'
    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'none'
    postGameScreen.style.display ='none'
    chooseDifficult()
}

const chooseDifficult = () => {
    anyDifficultButton.forEach( button => {
        button.addEventListener('click', e => {
            difficult = e.target.id 
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
    resetParameters()  
    createBlocks()
    addBlocksToScreen()
    addUserToScreen()
    addBallToScreen()
    document.addEventListener('keydown', updateUserPosition)
    if (difficult == 'easy') {
        timer = setInterval(updateBallPosition, 8)
    } else if (difficult == 'normal') {
        timer = setInterval(updateBallPosition, 4)
    } else {
        timer = setInterval(updateBallPosition, 1)
    }    
}

const resetParameters = () => {
    if (playAgainFlag) {
        removeElements()
    }

    //make ball direction random at the start of the game
    if (Math.floor(Math.random() * 12) >= 9) {
        ballXDirection = -1
        ballYDirection = 1
    } else if (Math.floor(Math.random() * 12) >= 6) {
        ballXDirection = -1
        ballYDirection = -1
    } else if (Math.floor(Math.random() * 12) >= 3) {
        ballXDirection = 1
        ballYDirection = -1
    } else {
        ballXDirection = 1
        ballYDirection = 1
    }

    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'block'
    blocksArray = []  
    clearInterval(timer)
    score = 0
    scoreDisplay.innerHTML = 0
    ballCurrentPosition = [290, 50]
    userCurrentPosition = [250, 25]
}

const createBlocks = () => {
    // maybe i could do this with a loop      
    blocksArray.push(new Block(10, 470))
    blocksArray.push(new Block(10 + 110 * 1, 470))
    blocksArray.push(new Block(10 + 110 * 2, 470))
    blocksArray.push(new Block(10 + 110 * 3, 470))
    blocksArray.push(new Block(10 + 110 * 4, 470))
    blocksArray.push(new Block(10, 440))
    blocksArray.push(new Block(10 + 110 * 1, 440))
    blocksArray.push(new Block(10 + 110 * 2, 440))
    blocksArray.push(new Block(10 + 110 * 3, 440))
    blocksArray.push(new Block(10 + 110 * 4, 440))
    blocksArray.push(new Block(10, 410))
    blocksArray.push(new Block(10 + 110 * 1, 410))
    blocksArray.push(new Block(10 + 110 * 2, 410))
    blocksArray.push(new Block(10 + 110 * 3, 410))
    blocksArray.push(new Block(10 + 110 * 4, 410))
}

const addBlocksToScreen = () => {
    for(let i = 0; i < blocksArray.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocksArray[i].leftEdge + 'px'
        block.style.bottom = blocksArray[i].bottomEdge + 'px'
        gameScreen.appendChild(block)
    }    
}

const addUserToScreen = () => {
    user = document.createElement('div')
    user.classList.add('user')
    user.style.left = userCurrentPosition[0] + 'px'
    user.style.bottom = userCurrentPosition[1] + 'px'
    gameScreen.appendChild(user)
}

const addBallToScreen = () => {
    ball = document.createElement('div')
    ball.classList.add('ball')
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
    gameScreen.appendChild(ball)
}

const updateBallPosition = () => {
    ballCurrentPosition[0] += ballXDirection
    ballCurrentPosition[1] += ballYDirection
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
    checkCollision()
}

const checkCollision = () => { 

    // check for collision with screen margins except bottom
    if (        
        ballCurrentPosition[0] >= screenRightMargin - ballDiameter ||
        ballCurrentPosition[0] <= screenLeftMargin ||
        ballCurrentPosition[1] >= screenTopMargin - ballDiameter        
    ) {
        changeDirection()
    }
    // check for collision with bottom
    else if (ballCurrentPosition[1] <= screenBottomMargin) {
        gameOver()
    }

    //check for collision with user
    if (
        ballCurrentPosition[0] + ballDiameter > userCurrentPosition[0] &&
        ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth &&
        ballCurrentPosition[1] + ballDiameter > userCurrentPosition[1] &&
        ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight
    ) {
        changeDirection()
    }

    // check for collision with any block
    for (let i = 0; i < blocksArray.length; i++) {
        if(
            ballCurrentPosition[0] + ballDiameter > blocksArray[i].leftEdge &&
            ballCurrentPosition[0] < blocksArray[i].rightEdge &&
            ballCurrentPosition[1] + ballDiameter > blocksArray[i].bottomEdge &&
            ballCurrentPosition[1] < blocksArray[i].topEdge
            
        ) {            
            changeDirection()   
            allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocksArray.splice(i, 1)
            score++
            scoreDisplay.innerHTML = score
            checkWin()
        }
    }    
}

const changeDirection = () => {
    //the ball movement does not seem very natural...

    // if ball moving right and down
    if (ballXDirection == 1 && ballYDirection == -1) {
        // move ball left and down
        ballXDirection = -1
    }
    // if ball moving left and down
    else if (ballXDirection == -1 && ballYDirection == -1) {
        // move ball left and up
        ballYDirection = 1
    }
    // if ball moving left and up
    else if (ballXDirection == -1 && ballYDirection == 1) {
        // move ball right and up
        ballXDirection = 1
    }
    // if ball moving right and up
    else if (ballXDirection == 1 && ballYDirection == 1) {
        // move ball left and up
        ballYDirection = -1
    }
}

const checkWin = () => {
    if (blocksArray.length == 0) {
        clearInterval(timer)
        document.removeEventListener('keydown', updateUserPosition)
        gameScreen.style.display = 'none'
        postGameScreen.style.display = 'flex'    
        messageDisplay.innerHTML = 'Nice! You won!'
        finalScoreDisplay.innerHTML = `Final score: ${score}`
        playAgain()
    }
}

const updateUserPosition = (e) => {
    if (e.key == 'ArrowLeft') {
        if (userCurrentPosition[0] > screenLeftMargin) {
            userCurrentPosition[0] -= 10
            user.style.left = userCurrentPosition[0] + 'px'
        }        
    } else if (e.key == 'ArrowRight') {
        if (userCurrentPosition[0] < screenRightMargin - blockWidth) {
            userCurrentPosition[0] += 10
            user.style.left = userCurrentPosition[0] + 'px'
        }    
    }
}

const gameOver = () => {
    clearInterval(timer)
    document.removeEventListener('keydown', updateUserPosition)
    gameScreen.style.display = 'none'
    postGameScreen.style.display = 'flex'    
    messageDisplay.innerHTML = 'Oh no...you lost!'
    finalScoreDisplay.innerHTML = `Final score: ${score}`
    playAgain()
}

const playAgain = () => {
    playAgainButton.addEventListener('click', () => {
        playAgainFlag = true
        prepareInitialScreen()
    })
}

const removeElements = () => {
    //remove blocks
    allBlocks = document.querySelectorAll('.block')
    Array.from(allBlocks).map( b => {
        b.parentElement.removeChild(b)
    })

    //remove user
    user = document.querySelector('.user')
    user.parentElement.removeChild(user)

    //remove ball
    ball = document.querySelector('.ball')
    ball.parentElement.removeChild(ball)
}

window.onload = prepareInitialScreen()