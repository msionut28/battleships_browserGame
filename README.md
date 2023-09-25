# BATTLESHIP STYLE BROWSER GAME

## 1. BRIEF INTRO 📖
While studying at **General Assembly**, I had been given a project to deliver within one week. The task was to create a browser-based game, using **HTML**, **CSS** and **JavaScript**. 
Most lines were written in JS, mainly focusing on manipulating DOM, creating functions and storing data for managing in arrays and objects. 
However, this project also contains roughly 250 lines of CSS code.

## 2. ABOUT THE GAME 🛳️
In order to make the game playable, I had to create functions that would randomly generate and place ships for the AI on a specific set of rules - the ships have to have a certain length, they have to start and end on the same column and, for now, they had to be placed horizontally. Future updates will also include vertical placement for both AI and the
player. There is also a landing and ending page that are handled through JavaScript DOM.


## 3. GAME INSTRUCTIONS 📋
In order for the game to start, the player has to place the ships found beneath his board. Once all of the ships have been placed, a button will pop up that has to be pressed to pick
who is going to start firing shots at the opponent's ship. The player will be given two options - **HEADS** or **TAILS**, each having a 50% chance of winning or losing. Once the turn has been
generated, the game can start. Each player has one shot per turn, the game ends once one player gets all of his ships destroyed.

## 4. DEPLOYMENT 🕸️
The game can be played and tested **[here](https://msionut28.github.io/Battleships-Project/)**.

![Actual gameplay](/assets/gameplay.gif)

## 5. STRUCTURE AND BUILDING 🏗️
+ **HTML** - One index.html that has a basic structure, as well as bootstrap elements.
+ **CSS/ Bootstrap** - All the styling has been conducted on a separate .css file. Most of the styling has been done through CSS, however Bootstrap was also used for modals and buttons.
+ **JavaScript** - The logic was implemented through JavaScript by creating functions that would handle starting game conditions, actual gameplay and winning conditions for both AI and Player. Arrays and Objects were used to store and manage data, as well as DOM Manipulation.
+ **GitHub** - Storing and deploying the project.
+ **VS Code** - Writing the code.

## 6. PLANNING 🤔

![My Excalidraw wireframe](/assets/wireframe.png)

The first step in building out my project was to have a plan to follow. I had layed out my basic grid structure, as well as things that I had to focus on, but also features of the game
such as: extra points for streak hits. I was initially planning on a different design for showing up the hit and missed ships, however throughout developing my project I thought that
using special characters instead of solid boxes would be more beneficial. 

## 7. CODING 💻

The top section of my code was mainly focused on declaring variables so it would be easier to read, but also to find and compare them. For the landing page, I have created a **`<div>`** in the index.html and appended buttons with attributes specific to Bootstrap using JavaScript DOM.
```js
for (let i = 0; i < 3; i++){
    const landingPage = document.querySelector('.landing-page')
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('id', `f${i}`)
    button.className = 'btn btn-primary btn-lg'
    landingPage.appendChild(button) 
}
```
Once the start button has been pressed, the **`<div>`** and all of its child elements gets removed from the parent node, so the playing boards would be visible and the game could start. By doing so, there was no need for multiple HTML files to be used, therefore to project was as simple as possible.

```js
function startGame(classOf) {
    let divToRemove = document.querySelector(classOf)
    
    if(divToRemove){
        while(divToRemove.firstChild){
            divToRemove.removeChild(divToRemove.firstChild)
        }
    
        divToRemove.parentNode.removeChild(divToRemove)
        document.body.style.overflow = 'visible'
    }
```


The coding process of actual gameplay starts by laying out the grids of the game, based on 3 declared variables. The number of cells displaying on the board can be adjusted by modifying the height and the width, this will return a different amount of squares. They were appended to the board by iterating and using **`.appendChild`** function.

```js
    const height = 10
    const width = 10
    const cellCount = width * height

    function boardGenerator(board) {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        //ADDING CELLS TO BOARD
        board.appendChild(cell)
    }
}
```

I have also used functions for generating rows and columns, as well as setting IDs for each individual **`<div>`** element in order to set coordinates of the grid.

 ```js
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
```
Once the board was getting done with and was all set, there was an obvious need to check whether ships could be placed on a specific position or not, so they would not overlap with any existing ones and to also begin and end the placement on the same row, so I created a function called **`isShipPlacementValid`** that takes in two parameters: **`shipSize`** and **`currentCell`**. 
```js
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
```

For the AI placement purposes, I came up with a function called **`randomShipGenerator`** which only takes in one parameter **`board`**. It was designed so for future development of the game as I am planning on introducing a **FEELING LUCKY** button for the player that will randomly generate ships on his board. 
```js
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
```

Before the actual start of the game, I had to make sure that everything was in place, but also to accordingly update the message in the header, as well as knowing when the coin flip button should show up. 

```js
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
        
        //*COIN FLIP FEATURE TO MAKE THE GAME MORE INTERACTIVE
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

        //*RANDOMLY ASSIGNING A PLAYER 
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
```

AI's turn is being regulated through multiple functions, such as **`handleTurn`** or **`aiCellTargeting`**. While the first one deals with cell selecting and updating the board after each turn, the **`aiCellTargeting`** was handling the actual **Targeting and Hunting** ships. 

```js
HANDLING TURN
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

AI CELL TARGETING

function aiCellTargeting() {
    const playerCells = playerBoard.querySelectorAll('.cell')

    //*IF THERE WAS A PREVIOUS HIT, THEN THE AI MUST TARGET THE LEFT AND RIGHT OF
    //*THAT CELL IN ORDER TO DESTROY THE SHIP
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

```

Last but not least, I have created another function called **`checkGameOver`** that is quite self-descriptive. Its main aim was to check if the conditions for the game to be over were met and, if so, how to handle each scenario. Furthermore, this is also the function that helped me generate an ending page for the game, that is focusing on the same principle as the landing page - generating and appending a new **`<div>`**, with all of its classes and childs.

```js
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
        const button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.setAttribute('id', `restart`)
        button.className = 'btn btn-primary btn-lg'
        button.addEventListener('click',() => {
            location.reload();
        })
        button.innerText = 'HAVE ANOTHER GO!'
        endingPageDiv.appendChild(button)
        document.body.insertBefore(endingPageDiv, document.body.firstChild)
    }
    //*PLAYER WIN SCENARIO
    if (hitShips.length === aiShipCount){
        messageUpdater('PLAYER WINS!')
        title.innerText = 'PLAYER WINS!'
        message.innerText = `Congratulations on your win! AI was about to conquer the world, but you sank all of your opponent's ships and now he is gone. At least for now.. He might be back sooner rather than later, so make sure you hit that restart button to keep an eye on him. `
        const winner = new Audio()
        winner.autoplay = true
        winner.src = './assets/FX/winner.mp3'
        setTimeout(winner.play, 1000)
        const scoreboard = document.querySelector('.scoreboard')
        scoreboard.style.visibility = 'hidden'
        setTimeout(endGame, 1500)
    } else if (playersHitShips.length > 16) { //*AI WIN SCENARIO
        messageUpdater('AI WINS!')
        title.innerText = 'AI WINS!'
        message.innerText = `Well played! Unfortunately, you did not manage to stop the AI from conquering the world.  3 months have passed since you two fought and he has defeated every country on Earth.     P.S. -Pss.. quick hint for you, since the AI really enjoyed the battle, it gave you the opportunity to fight him once again and summoned a button that acts as a a rewind wand.. Hit that button if you want to have another go and save the world!`
        const loser = new Audio()
        loser.autoplay = true
        loser.src = './assets/FX/fail.mp3'
        loser.play()
        const scoreboard = document.querySelector('.scoreboard')
        scoreboard.style.visibility = 'hidden'
        setTimeout(endGame, 1500)
    }
    return
}
```

## 8. CHALLENGES 🏆

+ I found updating the grid with player's placed ships quite challenging, tried different ways for drag&drop handling, the solution that I came up with was adding IDs and Classes for **`<div>`** elements matching settings made in .CSS file.
+ Another challenge in building out this game was the check of ship placement. There was a bug where a player could place a 5 length size ship starting on A8 and it would generate all the way up to B2 for example. As previously mentioned, this was solved by storing the future cells where the ship was going to be placed in an array called **`cellsToCheck`** and then used **`.some`** function to find out whether at least one cell had a ship already placed there - avoiding overlaping - as well as **`currCol !== currentCell.getAttribute('id').slice(0, 1)`** that was meant to check whether if all the cells had the same letter in the ID or not (if they did, it would mean they were all on the same row) and return false if they did not.

## 9. BUGS 🐛

+ I did not get the chance to thoroughly inspect and test every single aspect of the game, but one bug that I am currently aware of is that **`isShipPlacementValid`** would not properly function on the column **J** when it comes to ship length.
+ Sometimes, sound would not load on Safari browsers. However, works perfectly fine on Firefox and Chrome.

## 10. FUTURE IMPROVEMENTS 🏫

+ Players will be able to randomly generate ships if they're feeling lucky.
+ Ships will also be both placed and generated vertically as well as horizontally
+ Keeping track of scoreboard
+ 2 Player function - either locally or online

