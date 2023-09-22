

function init() {
    //*GENERATING GRID
    const playerBoard = document.querySelector('.player-grid')
    const aiBoard = document.querySelector('.ai-grid')
    
    //*GRID CONFIG & GENERAL DATA
    
    const aiColumns = document.querySelector('.ai-columns')
    const aiRows = document.querySelector('.ai-rows')
    const battleships = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer']
    const battleshipsLengths = [5, 4, 3, 3, 2]
    const columnIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    let currentPlayer = 1
    const height = 10
    const playerColumns = document.querySelector('.player-columns')
    const playerRows = document.querySelector('.player-rows')
    const rowIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const width = 10
    const cellCount = width * height
    const hitShips = []
    const playersHitShips =[]
    const playerStats = {
        hits: 0,
        misses: 0,
        score: 1000,
    }
    let previousHit 
    const randomPlacedShips = []

    
    //*PLAYER'S BOARD
    boardGenerator(playerBoard)
    idSetter('.player-grid')
    columnAndRowGenerator(playerColumns, playerRows)
    
    //*AI'S BOARD
    boardGenerator(aiBoard)
    idSetter('.ai-grid')
    columnAndRowGenerator(aiColumns, aiRows)
    const aiShips = randomShipGenerator(aiBoard)
    const markedDivs = updateAIShipCellsOnBoard(aiShips, aiBoard)
    
    //*DATA MANAGEMENT
    const playerBoardCoordinates = getIndexOfDivs(playerBoard)
    const placedShips = []
    
    canGameStart()


//!FUNCTIONS 

    //*BOARD GENERATING FUNCTION
function boardGenerator(board) {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        // cell.innerHTML = i
        //ADDING CELLS TO BOARD
        board.appendChild(cell)
    }
}

function columnAndRowGenerator(container, row){
    for (let i = 0; i < columnIndex.length; i++){
        const colGenerator = document.createElement('div')
        colGenerator.innerText = columnIndex[i]
        container.appendChild(colGenerator)
    }
    for (let i = 0; i < rowIndex.length; i++){
        const rowGenerator = document.createElement('div')
        rowGenerator.innerText = rowIndex[i]
        row.appendChild(rowGenerator)
    }
}
    //*ID SETTING FUNCTION FOR COORDINATES
function idSetter(boardSelector) {
    const divs = document.querySelectorAll(`${boardSelector} div`)

    let startingIndex = 0
    for (let b = 0; b < columnIndex.length; b++){
        for (let c = 0; c < rowIndex.length; c++){
            const id = `${columnIndex[b]}${rowIndex[c]}`
            const div = divs[startingIndex]
            if (div){
                div.setAttribute('id', id)
                div.setAttribute('class', 'cell')
                startingIndex++
            }
        }
    }
}

function handleCellClick(e) {
    e.preventDefault()

    const cell = this
    const currClass = cell.getAttribute('class')
    const divsInCell = cell.querySelectorAll('div').length
    const playerBoard = cell.parentElement.classList.contains('player-grid')
    const newDiv = document.createElement('div')
    if (playerBoard || divsInCell > 0 || currentPlayer === 0){
        return false
    } else if (currClass === 'cell') {
        newDiv.setAttribute('id', 'red')
        newDiv.innerHTML = '<i class="fa-sharp fa-regular fa-circle-xmark"></i>'
        currentPlayer *= -1
        messageUpdater(`AI'S TURN!`)
        const miss = new Audio()
        miss.src = './assets/FX/miss.mp3'
        miss.play()
        handleMiss()
        setTimeout(handleTurn, 400)
    } else if (currClass === 'aiship'){
        newDiv.setAttribute('id', 'green')
        newDiv.innerHTML = '<i class="fa-sharp fa-solid fa-skull-crossbones fa-fade"></i>'
        handleHit()
        updateHitShips(this)
        checkGameOver() 
        currentPlayer *= -1
        messageUpdater('YOU HAVE SUCCESFULLY HIT A SHIP!')
        const hit = new Audio()
        hit.src = './assets/FX/hit.mp3'
        hit.play()
        setTimeout(handleTurn, 500)
    }
    cell.appendChild(newDiv)

}
//? HANDLING DRAG&DROP OF SHIPS

const gridCells = document.querySelectorAll('.cell')
const ships = document.querySelectorAll('.ship')
const aiShipDivs = document.querySelectorAll('.aiship')

    //* ADDING EVENTLISTENERS AND FUNCTIONS TO SHIPS AND CELLS
ships.forEach(function (ship) {
    ship.addEventListener('dragstart', handleDragStart)
})

gridCells.forEach(function (cell) {
    cell.addEventListener('dragover', handleDragOver)
    cell.addEventListener('dragenter', handleDragEnter)
    cell.addEventListener('dragleave', handleDragLeave)
    cell.addEventListener('drop', handleDrop)
    cell.addEventListener('click', handleCellClick)
})

aiShipDivs.forEach(function (cell) {
    cell.addEventListener('click', handleCellClick)
})
    //* STYLING OUT THE FUNCTIONS AND THE EVENTS THAT SHOULD HAPPEN WHILE DRAGGING
    //* AND DROPPING
function handleDragStart(e) {
    draggedShipElData = this
    shipSize = parseInt(this.getAttribute('ship-size'))
}

function handleDragOver(e) {
    e.preventDefault()
}

function handleDragEnter(e) {
    e.preventDefault()
    this.setAttribute('id-hover', 'over')
}

function handleDragLeave(e) {
    e.preventDefault()
    this.removeAttribute('id-hover', 'over')
}

function handleDrop(e) {
    e.preventDefault()
    if (this.parentElement.classList.contains('ai-grid')){
        this.removeAttribute('id-hover', 'over')
        draggedShipElData.style.opacity = 1
        return
    }
    const placedShip = new Audio()
    placedShip.src = './assets/FX/placedShip.wav'
    placedShip.play()
    // * BY THE AID OF THIS FOR LOOP, ALL OF THE DIVS CONTAINED BY A SHIP WILL 
    //* ACCORDINGLY UPDATE THE BOARD, INSTEAD OF JUST ONE DIV!
    const shipName = draggedShipElData.className.split(' ')[0]

    const hand = document.querySelector('.moving-div')
    hand.style.visibility = 'hidden'

    if (isShipPlacementValid(shipSize, this)) {
        let currentCell = this
        const shipCells = [] //*USED FOR STORING INFORMATION REGARDING SHIP COORDINATES

        if (currentCell.classList.contains('cell')){
            for(let i = 0; i < shipSize; i++){
                // currentCell.classList.remove('cell')
                currentCell.classList.add('over', shipName)
                shipCells.push(currentCell.getAttribute('id'))
                currentCell = currentCell.nextElementSibling
            }
            draggedShipElData.innerText = ' '
        }
        this.classList.remove('cell')
        this.removeAttribute('id-hover', 'over')
        placedShips.push({id: shipName, cells: shipCells})
    } else {
        this.removeAttribute('id-hover', 'over')
    }
    canGameStart()
    }

    //* THIS FUNCTION CHECKS WHETHER A SHIP CAN BE PLACED OR NOT BASED ON SEVERAL CONDITIONS
    //* SUCH AS, THE SHIP MUST START AND END ON THE SAME ROW, THE SHIPS MUST NOT OVERLAP
function isShipPlacementValid(shipSize, currentCell) {
    const cellsToCheck = []
    const currId = currentCell.getAttribute('id')
    const currCol = currId.slice(0, 1)
    for (let i = 0; i < shipSize; i++) {
      if (!currentCell.classList.contains('cell') || currentCell.classList.contains('over') || currCol !== currentCell.getAttribute('id').slice(0, 1)) {
        return false
      }
      cellsToCheck.push(currentCell)
      currentCell = currentCell.nextElementSibling
    }
  //IF STATEMENT TO THECK IF ANY OF THE CELLS CONTAINS THE CLASS "OVER" THAT REPRESENTS
  //THE FACT THAT A SHIP HAS BEEN ALREADY PLACED THERE
    if (cellsToCheck.some(cell => cell.classList.contains('over'))) {

      return false
    }
    return true
    
}

//*FUNCTIONS FOR AI BATTLESHIP PLACEMENT
function randomShipGenerator(board) {
    let generatedShips = 0

    while (generatedShips < 5) {
        let ship = battleships[generatedShips]
        let shipSize = battleshipsLengths[generatedShips]
        let shipCells = []

        let startingPoint = null

        while (!startingPoint || !isShipPlacementValid(shipSize, startingPoint, board)) {
            startingPoint = randomCellSelector(board)
        }

        for (let j = 0; j < shipSize; j++) {
            shipCells.push(startingPoint.getAttribute('id'))
            startingPoint = startingPoint.nextElementSibling
        }
        
        randomPlacedShips.push({ id: ship, cells: shipCells })
        generatedShips++
    }

    return randomPlacedShips
}


//*RANDOM CELL SELECTOR THAT WILL BE USED FOR MULTIPLE OTHER FUNCTIONS
function randomCellSelector(board) {
    const cells = board.querySelectorAll('div')
    const randomIndex = Math.floor(Math.random() * cells.length)
    const randomCell = cells[randomIndex]
    return randomCell
}


//* FUNCTIONS FOR DATA STORAGE AND MANAGEMENT

function getIndexOfDivs(board){
const divs = board.querySelectorAll('div')
const divsCoordinates = {}
//LOOPING THROUGH ALL THE DIVS TO STORE THE INFO
divs.forEach(function (div, index) {
    const id = div.getAttribute('id')
    if (id !== null) {
        divsCoordinates[id] = index
    }
})
return divsCoordinates
}

//* ONCE THE AI'S SHIPS HAVE BEEN GENERATED, WE'LL ASIGN A AISHIP CLASS TO THEIR
//* CORRESPONDING DIVS ON THE BOARD

function updateAIShipCellsOnBoard(aiShips, board) {
    aiShips.forEach(function (ship) {
        ship.cells.forEach(function (cellId) {
            const cell = board.querySelector(`#${cellId}`)
            if (cell) {
                cell.removeAttribute('class')
                cell.setAttribute('class', 'aiship')
            }
        })
    })
}

function handleTurn () {
    if (checkGameOver()) { 
        return
    }
    if (currentPlayer === -1){   //! -1 IS THE AI
        const cellsToTarget = aiCellTargeting()
        const newDiv = document.createElement('div')
        if (cellsToTarget.classList.contains('over')){
            cellsToTarget.classList.add('hit')
            newDiv.setAttribute('id', 'green')
            newDiv.innerHTML = '<i class="fa-sharp fa-solid fa-skull-crossbones fa-fade"></i>'
            updatePlayersHitShips(cellsToTarget)
            previousHit = cellsToTarget
            checkGameOver() 
        } else {
            cellsToTarget.classList.add('miss')
            newDiv.setAttribute('id', 'red')
            newDiv.innerHTML = '<i class="fa-sharp fa-regular fa-circle-xmark"></i>'
        }
        cellsToTarget.appendChild(newDiv)
        currentPlayer *= -1 //!SWITCHING TURNS
        if (currentPlayer === 1) {
            messageUpdater(`PLAYER'S TURN!`)
        } else if (currentPlayer === -1) {
            messageUpdater(`AI's TURN!`)
        }
    } else if (currentPlayer === 1){ //!1 IS THE PLAYER
        console.log(`PLAYER'S TURN`)
    }
}                                       

//*RANDOM PICKER FOR AI'S TURN AS WELL AS TARGET & HUNT
function aiCellTargeting() {
    const playerCells = playerBoard.querySelectorAll('.cell')

    if (previousHit) {
        const id = previousHit.getAttribute('id')
        const col = id.charAt(0)
        let row = parseInt(id.charAt(1))
        const targetCells = [
            document.getElementById(`${col}${row - 1}`), // LEFT
            document.getElementById(`${col}${row + 1}`), // RIGHT
        ]
        const validTargets = targetCells.filter(cell => {
            return cell && !cell.classList.contains('hit') && !cell.classList.contains('miss')
        })

        //*CHECKING WHETHER THERE ARE ANY POSSIBLE TARGETS LEFT OR NOT
        if (validTargets.length > 0) {
            const randomPick = Math.floor(Math.random() * validTargets.length)
            return validTargets[randomPick]
        }
    }

    const cellsShouldTarget = Array.from(playerCells).filter(cell => !cell.classList.contains('hit') && !cell.classList.contains('miss'))
    if (cellsShouldTarget.length === 0) {
        return
    }

    const randomPick = Math.floor(Math.random() * cellsShouldTarget.length)
    return cellsShouldTarget[randomPick]
}


//*FUNCTION TO DISPLAY WHO'S TURN IT IS
function messageUpdater(message){
    textToUpdate = document.getElementById('message')
    return textToUpdate.innerText = message
}

//*UPDATE HIT SHIPS BY THE PLAYER OR AI
function updateHitShips(element){
    id = element.getAttribute('id')
    hitShips.push(id) 
    }
function updatePlayersHitShips(element){
    id = element.getAttribute('id')
    playersHitShips.push(id)
}

//*FUNCTION TO CHECK IF THE GAME CAN START
function canGameStart() {
    const overCells = Array.from(playerBoard.querySelectorAll('.over'))
    
    if (overCells.length < 16) {
        currentPlayer = 0
        messageUpdater('PLEASE PLACE YOUR SHIPS')
    } else {
        messageUpdater('THE GAME CAN START! PLEASE PRESS THE BUTTON')
        const button = document.getElementById('coin-flip')
        const heads = document.getElementById('heads')
        const scoreboard = document.querySelector('.scoreboard')
        const tails = document.getElementById('tails')
        button.style.visibility = 'visible'
        
        button.addEventListener('click', coinSound)
        heads.addEventListener('click', function () {
            assignRandomPlayer()
            button.style.visibility = 'hidden'
            scoreboard.style.visibility = 'visible'
            coinSound()
            if (currentPlayer === 1) {
                messageUpdater(`PLAYER STARTS!`)
            } else if (currentPlayer === -1) {
                messageUpdater(`AI STARTS!`)
            }
        })
        tails.addEventListener('click', function () {
            assignRandomPlayer()
            button.style.visibility = 'hidden'
            scoreboard.style.visibility = 'visible'
            coinSound()
            if (currentPlayer === 1) {
                messageUpdater(`PLAYER STARTS!`)
            } else if (currentPlayer === -1) {
                messageUpdater(`AI STARTS!`)
            }
        })
        function assignRandomPlayer() {
            if (Math.random() < 0.5) {
                currentPlayer = -1
                setTimeout(handleTurn, 500)
            } else{
                currentPlayer = 1
            } 
        }
    }
}

//*SCOREBOARD AND UPDATES
const scoreboardContainer = document.createElement('div')
scoreboardContainer.classList.add('scoreboard')

 //SCOREBOARD ELEMENTS
const hitsElement = createStatElement('Hits', 'hits', playerStats.hits)
const missesElement = createStatElement('Misses', 'misses', playerStats.misses)
const scoreElement = createStatElement('Score', 'score', playerStats.score)

scoreboardContainer.append(hitsElement, missesElement, scoreElement)

document.body.appendChild(scoreboardContainer)


function createStatElement(label, id, initialValue) {
    const statElement = document.createElement('p')
    statElement.innerHTML = `${label}: <span id="${id}">${initialValue}</span>`
    return statElement
}

function updateScoreboard() {
    hitsElement.querySelector('span').textContent = playerStats.hits
    missesElement.querySelector('span').textContent = playerStats.misses
    scoreElement.querySelector('span').textContent = playerStats.score
}

function handleHit() {
    playerStats.hits++
    playerStats.score += 100
    updateScoreboard()

    if (playerStats.hits >= 2) {
        playerStats.score += 50
        updateScoreboard()
    }
}


function handleMiss() {
    playerStats.misses++
    playerStats.score -= 20
    updateScoreboard()
}

//*FUNCTION TO CHECK IF THE GAME IS OVER
function checkGameOver(){
    const endingPageDiv = document.createElement('div')
    endingPageDiv.className = 'ending-page'
    const title = document.createElement('h1')
    title.setAttribute('class', 'endTitle')
    const message =document.createElement('p')
    message.setAttribute('class', 'endMessage')
    const aiShipCount = aiShipDivs.length
    function endGame(){
        endingPageDiv.appendChild(title)
        endingPageDiv.appendChild(message)
        document.body.insertBefore(endingPageDiv, document.body.firstChild)
    }
    if (hitShips.length === aiShipCount){
        messageUpdater('PLAYER WINS!')
        title.innerText = 'PLAYER WINS!'
        message.innerText = `Congratulations on your win! AI was about to conquer the world, but you sank all of your opponent's ships and now he is gone forever. However, he might be back rather sooner than later, so constantly hit that refresh button to keep an eye on him. `
        const winner = new Audio()
        winner.autoplay = true
        winner.src = './assets/FX/winner.mp3'
        setTimeout(winner.play, 1000)
        const scoreboard = document.querySelector('.scoreboard')
        scoreboard.style.visibility = 'hidden'
        setTimeout(endGame, 2000)
    } else if (playersHitShips.length > 16) {
        messageUpdater('AI WINS!')
        title.innerText = 'AI WINS!'
        message.innerText = `Well played! Unfortunately, you did not manage to stop the AI from conquering the world. 3 months have passed since you two fought and he has defeated every country on Earth. P.S. -Pss.. quick hint for you, since the AI really enjoyed the battle, it changed the functionality of the refresh button and now it's a rewind wand.. Hit that button if you want to have another go!`
        const loser = new Audio()
        loser.autoplay = true
        loser.src = './assets/FX/fail.mp3'
        loser.play()
        const scoreboard = document.querySelector('.scoreboard')
        scoreboard.style.visibility = 'hidden'
        setTimeout(endGame, 2000)
    }
    return
}

//*BACKGROUND MUSIC

function bgMusic(){
    const bgMusic = new Audio()
    bgMusic.autoplay = true
    bgMusic.loop = true
    bgMusic.src = './assets/FX/backgroundMusic.mp3'
    bgMusic.play()
}

//*LANDING PAGE
    //CREATING BUTTONS FOR LANDING PAGE AND APPENDING THEM
for (let i = 0; i < 3; i++){
    const landingPage = document.querySelector('.landing-page')
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('id', `f${i}`)
    button.className = 'btn btn-primary btn-lg'
    landingPage.appendChild(button) 
}

const startButton = document.getElementById('f0')
startButton.innerText = 'START'

const aboutButton = document.getElementById('f1')
aboutButton.innerText = 'ABOUT'
aboutButton.setAttribute('type', 'button')
aboutButton.setAttribute('class', 'btn btn-primary')
aboutButton.setAttribute('data-bs-toggle', 'modal')
aboutButton.setAttribute('data-bs-target', "#exampleModal")
const helpButton = document.getElementById('f2')
helpButton.innerText= 'HOW TO PLAY'
helpButton.setAttribute('type', 'button')
helpButton.setAttribute('class', 'btn btn-primary')
helpButton.setAttribute('data-bs-toggle', 'modal')
helpButton.setAttribute('data-bs-target', "#rulesModal")

startButton.addEventListener('click', coinSound)
aboutButton.addEventListener('click', coinSound)
helpButton.addEventListener('click', coinSound)

//*GET RID OF LANDING PAGE IN ORDER TO START THE GAME
function startGame(classOf) {
    let divToRemove = document.querySelector(classOf)

    if(divToRemove){
        while(divToRemove.firstChild){
            divToRemove.removeChild(divToRemove.firstChild)
        }

        divToRemove.parentNode.removeChild(divToRemove)
        document.body.style.overflow = 'show'
    }
}

function startButtonClickHandle(e) {
    startGame('.landing-page')
    bgMusic()
}

function coinSound (e) {
    const coin = new Audio()
    coin.src = './assets/FX/coin-flip.mp3'
    coin.play()
}

startButton.addEventListener('click', startButtonClickHandle)

}
window.addEventListener('DOMContentLoaded', init)