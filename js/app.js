

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
    const height = 10
    const playerColumns = document.querySelector('.player-columns')
    const playerRows = document.querySelector('.player-rows')
    const rowIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const width = 10
    const cellCount = width * height

    //*PLAYER'S BOARD
    boardGenerator(playerBoard)
    idSetter('.player-grid')
    columnAndRowGenerator(playerRows, playerColumns)

    //*AI'S BOARD
boardGenerator(aiBoard)
idSetter('.ai-grid')
columnAndRowGenerator(aiRows, aiColumns)
const aiShips = randomShipGenerator(aiBoard)
const markedDivs = updateAIShipCellsOnBoard(aiShips, aiBoard)

    //*DATA MANAGEMENT
const playerBoardCoordinates = getIndexOfDivs(playerBoard)
const placedShips = [];



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
    e.preventDefault(); 

    const cell = this
    const currClass = cell.getAttribute('class')
    const divsInCell = cell.querySelectorAll('div').length
    const playerBoard = cell.parentElement.classList.contains('player-grid')

    const newDiv = document.createElement('div')
    newDiv.innerText = '.'
    if (playerBoard || divsInCell > 0){
        return false
    } else if (currClass === 'cell') {
        newDiv.setAttribute('id', 'red')
    } else if (currClass === 'aiship'){
        newDiv.setAttribute('id', 'green')
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
    for (let i = 0; i < shipSize; i++) {
      if (!currentCell.classList.contains('cell') || currentCell.classList.contains('over') || currCol !== currentCell.getAttribute('id').slice(0, 1)) {
        return false;
      }
      cellsToCheck.push(currentCell);
    //   if (cellsToCheck.length < shipSize){
    //     return false;
    //   }
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

function randomShipGenerator(board) {
    const randomPlacedShips = []

    for (let i = 0; i < battleships.length; i++) {
        const ship = battleships[i]
        const shipSize = battleshipsLengths[i]
        const shipCells = []

        let startingPoint = randomCellSelector(board)

        // Retry until a valid starting point is found
        while (startingPoint && !isShipPlacementValid(shipSize, startingPoint, board)) {
            startingPoint = randomCellSelector(board)
        }

        if (startingPoint) {
            for (let j = 0; j < shipSize; j++) {
                shipCells.push(startingPoint.getAttribute('id'))
                startingPoint = startingPoint.nextElementSibling
            }
            randomPlacedShips.push({ id: ship, cells: shipCells })
        } else {
            i--
        }
    }

    return randomPlacedShips;
}



function randomCellSelector(board) {
    const cells = board.querySelectorAll('div')
    const randomIndex = Math.floor(Math.random() * cells.length)
    const randomCell = cells[randomIndex]
    return randomCell
}


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

//* ONCE THE AI'S SHIPS HAVE BEEN GENERATED, WE'LL ASIGN A GREEN CLASS TO THEIR
//* CORRESPONDING DIVS ON THE BOARD

function updateAIShipCellsOnBoard(aiShips, board) {
    aiShips.forEach(function (ship) {
        ship.cells.forEach(function (cellId) {
            const cell = board.querySelector(`#${cellId}`);
            if (cell) {
                cell.removeAttribute('class');
                cell.setAttribute('class', 'aiship')
            }
        });
    });
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
console.log(playerBoardCoordinates, placedShips, aiShips);
}
window.addEventListener('DOMContentLoaded', init)