function init() {

    //*GRID CONFIG & GENERAL DATA
    const width = 10
    const height = 10
    const cellCount = width * height
    const playerBoard = document.querySelector('.player-grid')
    const aiBoard = document.querySelector('.ai-grid')
    const columnIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const rowIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const battleships = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer']
    const battleshipsLengths = [5, 4, 3, 3, 2]

    //*PLAYER'S BOARD
boardGenerator(playerBoard)
idSetter('.player-grid')
    //*AI'S BOARD
boardGenerator(aiBoard)
idSetter('.ai-grid')
randomShipGenerator(aiBoard)

    //*DATA MANAGEMENT
const playerBoardCoordinates = getIndexOfDivs(playerBoard)
const placedShips = [];


//!FUNCTIONS 

    //*BOARD GENERATING FUNCTION
function boardGenerator(board) {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        cell.innerHTML = i
        //ADDING CELLS TO BOARD
        board.appendChild(cell)
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

//? HANDLING DRAG&DROP OF SHIPS

const gridCells = document.querySelectorAll('.cell')
const ships = document.querySelectorAll('.ship')

    //* ADDING EVENTLISTENERS AND FUNCTIONS TO SHIPS AND CELLS
ships.forEach(function (ship) {
    ship.addEventListener('dragstart', handleDragStart)
})

gridCells.forEach(function (cell) {
    cell.addEventListener('dragover', handleDragOver)
    cell.addEventListener('dragenter', handleDragEnter)
    cell.addEventListener('dragleave', handleDragLeave)
    cell.addEventListener('drop', handleDrop)
})

    //* STYLING OUT THE FUNCTIONS AND THE EVENTS THAT SHOULD HAPPEN WHILE DRAGGING
    //* AND DROPPING
function handleDragStart(e) {
    draggedShipElData = this;
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
        draggedShipElData.style.opacity = 1;
        return;
    }
    
    // * BY THE AID OF THIS FOR LOOP, ALL OF THE DIVS CONTAINED BY A SHIP WILL 
    //* ACCORDINGLY UPDATE THE BOARD, INSTEAD OF JUST ONE DIV!
    const shipName = draggedShipElData.className.split(' ')[0]

    if (isShipPlacementValid(shipSize, this)) {
        let currentCell = this
        const cellsToCheck = [] //*USED FOR CHECKING IF SHIP CAN BE PLACED
        const shipCells = [] //*USED FOR STORING INFORMATION REGARDING SHIP COORDINATES

        if (currentCell.classList.contains('cell')){
            for(let i = 0; i < shipSize; i++){
                currentCell.classList.remove('cell')
                currentCell.classList.add('over', shipName)
                shipCells.push(currentCell.getAttribute('id'))
                currentCell = currentCell.nextElementSibling;
            }
            draggedShipElData.innerHTML = ''
        }
        this.classList.remove('cell')
        this.removeAttribute('id-hover', 'over')
        placedShips.push({id: shipName, cells: shipCells})
    } else {
        this.removeAttribute('id-hover', 'over')
    }
    }

    //* THIS FUNCTION CHECKS WHETHER A SHIP CAN BE PLACED OR NOT BASED ON SEVERAL CONDITIONS
    //* SUCH AS, THE SHIP MUST START AND END ON THE SAME ROW, THE SHIPS MUST NOT OVERLAP
function isShipPlacementValid(shipSize, currentCell) {
    const cellsToCheck = [];
    const currId = currentCell.getAttribute('id')
    const currCol = currId.slice(0, 1)
    let cell= currentCell;
    for (let i = 0; i < shipSize; i++) {
      if (!currentCell.classList.contains('cell') || currentCell.classList.contains('over') || currCol !== currentCell.getAttribute('id').slice(0, 1)) {
        alert('You cannot place the ship here!')
        return false;
      }
      cellsToCheck.push(currentCell);
      currentCell = currentCell.nextElementSibling;
    }
  //IF STATEMENT TO THECK IF ANY OF THE CELLS CONTAINS THE CLASS "OVER" THAT REPRESENTS
  //THE FACT THAT A SHIP HAS BEEN ALREADY PLACED THERE
    if (cellsToCheck.some(cell => cell.classList.contains('over'))) {

      return false;
    }
    return true
    
}

//*FUNCTIONS FOR AI BATTLESHIP PLACEMENT

function randomShipGenerator (board) {
    const randomPlacedShips = []
    let startingPoint = randomCellSelector(board)
    
    for (let i = 0; i < battleships.length; i++){
        const ship = battleships[i]
        const shipSize = battleshipsLengths[i]
        const shipCells = []
        if (isShipPlacementValid(shipSize, startingPoint)){
            for(let j = 0; j < shipSize; j++){
                shipCells.push(startingPoint.getAttribute('id'))
                startingPoint = startingPoint.nextElementSibling
            }
        }
        randomPlacedShips.push({id: ship, cells: shipCells})
    }
    return randomPlacedShips
}
function randomCellSelector(board) {
    const cells = board.querySelectorAll('div')
    const randomCell = cells[Math.floor(Math.random()* cells.length)]
    const id = randomCell.getAttribute('id')
    return id
}

console.log(randomCellSelector(aiBoard));

//* FUNCTIONS FOR DATA STORAGE AND MANAGEMENT

function getIndexOfDivs(board){
const divs = board.querySelectorAll('div')
const divsCoordinates = {};
//LOOPING THROUGH ALL THE DIVS TO STORE THE INFO
divs.forEach(function (div, index) {
    const id = div.getAttribute('id')
    if (id !== null) {
        divsCoordinates[id] = index
    }
})
return divsCoordinates
}

//  function getCoordinatesOfShips(board){
//     const divs = board.querySelectorAll('div')
//     const shipCoordinates = {};
//     divs.forEach(function (div, index) {
//         const id = div.getAttribute('id')
//         for (let i = 0; i < battleships.length; i++){
//             if (id === battleships[i]){
//                 shipCoordinates[index] = id
//             }
//         }
//     })
//     return shipCoordinates
//  }
console.log(playerBoardCoordinates, placedShips);
}
window.addEventListener('DOMContentLoaded', init)
