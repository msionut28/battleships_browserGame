

    function init() {
        //*GENERATING GRID
    const playerBoard = document.querySelector('.player-grid')
    const aiBoard = document.querySelector('.ai-grid')

        //*GRID CONFIG
    const width = 10
    const height = 10
    const cellCount = width * height
    const columnIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const rowIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

        //*PLAYER'S BOARD
    boardGenerator(playerBoard)
    idSetter('.player-grid')
        //*AI'S BOARD
    boardGenerator(aiBoard)
    idSetter('.ai-grid')

        //*DATA MANAGEMENT
    const playerBoardCoordinates = getIndexOfDivs(playerBoard)
    console.log(playerBoardCoordinates);


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
        this.removeAttribute('id-hover', 'over')
        this.removeAttribute('class', 'cell')

        // * BY THE AID OF THIS FOR LOOP, ALL OF THE DIVS CONTAINED BY A SHIP WILL 
        //* ACCORDINGLY UPDATE THE BOARD, INSTEAD OF JUST ONE DIV!
        let currentCell = this
        const shipName = draggedShipElData.className.split(' ')[0]

        if (currentCell.classList.contains('cell')){}
        for(let i = 0; i < shipSize; i++){
            currentCell.classList.add('over', shipName)
            currentCell = currentCell.nextElementSibling;
        }
        draggedShipElData.innerHTML = ''
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
    });
    return divsCoordinates
 }

}

    window.addEventListener('DOMContentLoaded', init)
console.log();