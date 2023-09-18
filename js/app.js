

    function init() {
        //*GENERATING GRID
    const playerBoard = document.querySelector('.player-grid')
    const aiBoard = document.querySelector('.ai-grid')

        //*GRID CONFIG
    const width = 10
    const height = 10
    const cellCount = width * height
    const columnIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const rowIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        //*PLAYER'S BOARD
    boardGenerator(playerBoard)
    idSetter('.player-grid')
        //*AI'S BOARD
    boardGenerator(aiBoard)
    idSetter('.ai-grid')


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
        this.style.opacity = '0.5'
        e.dataTransfer.effectAllowed= 'move'
        e.dataTransfer.setData('text/html', '')
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    function handleDragEnter(e) {
        e.preventDefault()
        this.classList.add('over')
    }

    function handleDragLeave(e) {
        e.preventDefault()
        this.classList.remove('over')
    }

    function handleDrop(e) {
        e.preventDefault()
        this.classList.add('over')
        if(draggedShipElData !== null) {
            this.innerHTML = e.dataTransfer.getData('text/html', )
            draggedShipElData.innerHTML = '';
            draggedShipElData = null
        }
    }
    }

    window.addEventListener('DOMContentLoaded', init)
