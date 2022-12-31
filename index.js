//Game board variables
let pixelSize = 25
let rows = 30
let colmuns = 30
let board
let ctx
let difficulty = 5
let gameOver = false
let moves = 0
let highScore = localStorage.getItem("snake-high-score")
let timeOut

//Sound effects
const win = new Audio('./win.mp3')
const lose = new Audio('./lose.mp3')

//Snake head variables
let headX = pixelSize * 6
let headY = pixelSize * 6
let velocityX = 0
let velocityY = 0
let tailLength = 2
let gap = 1
let snakeBody = []

//Food variables
let foodX
let foodY
let collectedFoods = 0

//Dom elements
const levels = document.querySelector('.levels')
const foods = document.querySelector('.foods')
const resetBtn = document.querySelector('.reset-btn')
const statusTxt = document.querySelector(".status")
const highScoreTxt = document.querySelector(".high-score")


foodRandomPlace()
highScoreTxt.textContent = `High score: ${highScore ? highScore : 0}`

function startGame () {

    foods.textContent = `foods: ${collectedFoods}`
    levels.textContent = 'difficulty: noob'

    statusTxt.style.display = "flex"
    board = document.querySelector(".canvas")
    board.width = colmuns * pixelSize
    board.height = rows * pixelSize
    ctx = board.getContext("2d")
    document.addEventListener("keyup", changeDirection)

    if (collectedFoods > 14) {
        difficulty = 15
        levels.textContent = "level: hell"
    } else if (collectedFoods > 9) {
        difficulty = 12.5
        levels.textContent = "level: expert"
    } else if (collectedFoods > 4) {
        difficulty = 10
        levels.textContent = "level: beginner"
    }

    timeOut = setTimeout(startGame, 1000 / difficulty)
    update()

}

function update () {
    headX += velocityX * pixelSize
    headY += velocityY * pixelSize
    
    if (gameOver) {
        return
    }
    
    ctx.fillStyle = "#111"
    ctx.fillRect(0,0,board.width,board.height)

 
    if (velocityX || velocityY) {
        moves ++
    }

    snakeBody.push([headX,headY])
    if (snakeBody.length > tailLength + 1) {
            snakeBody.shift()
    }

    foodCollision()  
    ctx.fillStyle = "green"
    ctx.fillRect(foodX + gap, foodY + gap, pixelSize - gap * 2, pixelSize - gap * 2)

    for (let i = 0; i < tailLength; i++) {
        if (velocityX || velocityY) {   
            ctx.fillStyle = "tomato"
            ctx.fillRect(snakeBody[i][0] + gap, snakeBody[i][1] + gap, pixelSize - gap * 2, pixelSize - gap * 2)
        }
    }

    ctx.fillStyle = "orange"
    ctx.fillRect(headX + gap, headY + gap, pixelSize - gap * 2, pixelSize - gap * 2)



    if (headX < 0 || headX == colmuns * pixelSize || headY < 0 || headY == rows * pixelSize) {
        statusTxt.innerText = "game over"
        velocityX = 0
        velocityY = 0
        gameOver = true
        lose.play()
    } else {
        statusTxt.innerText = ""
        gameOver = false
    }
    
    for (let i = 0; i < tailLength; i++) {
        if (moves > tailLength) {
            if (snakeBody[i][0] == headX && snakeBody[i][1] == headY) {
                document.querySelector(".status").innerText = "game over"
                gameOver = true
                lose.play()
                        break
            }
        }
        
    }
}

function changeDirection (event) {
    if (event.code == "ArrowUp") {
        if (velocityY == 1) {
            return
        }
        velocityX = 0
        velocityY = -1
    }
    else if (event.code == "ArrowDown") {
        if (velocityY == -1) {
            return
        }
        velocityX = 0
        velocityY = 1
    }
    else if (event.code == "ArrowLeft") {
        if (velocityX == 1) {
            return
        }
        velocityX = -1
        velocityY = 0
    }
    else if (event.code == "ArrowRight") {
        if (velocityX == -1) {
            return
        }
        velocityX = 1
        velocityY = 0
    }
}

function foodRandomPlace () {
    foodX = Math.floor(Math.random() * colmuns) * pixelSize
    foodY = Math.floor(Math.random() * rows) * pixelSize
}

function foodCollision () {
    if (headX == foodX && headY == foodY) { 
        foodRandomPlace()
        setTimeout(()=>{tailLength ++}, 300)
        collectedFoods++
        foods.textContent = `foods: ${collectedFoods}`
        if (collectedFoods > highScore) {
            localStorage.setItem("snake-high-score", collectedFoods)
        }
        highScore = localStorage.getItem("snake-high-score")
        highScoreTxt.textContent = `High score: ${highScore}`

        win.play()
    }
}

resetBtn.addEventListener("click", resetHandler)

function resetHandler () {
    headX = pixelSize * 6
    headY = pixelSize * 6
    difficulty = 5
    gameOver = false
    velocityX = 0
    velocityY = 0
    tailLength = 2
    snakeBody = []
    moves = 0
    collectedFoods = 0
    statusTxt.style.display = "none"
    highScoreTxt.textContent = `High score: ${localStorage.getItem("snake-high-score")}`
    clearTimeout(timeOut)
    foodRandomPlace()
    startGame()
}

startGame()