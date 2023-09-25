# BATTLESHIP STYLE BROWSER GAME

# BRIEF INTRO
While studying at General Assembly, I had been given a project to deliver within one week. The task was to create a browser-based game, using HTML, CSS and JavaScript. 
Most lines were written in JS, mainly focusing on manipulating DOM, creating functions and storing data for managing in arrays and objects. 
However, this project also contains roughly 250 lines of CSS code.

# ABOUT THE GAME
In order to make the game playable, I had to create functions that would randomly generate and place ships for the AI on a specific set of rules - the ships have to have a certain
length, they have to start and end on the same column and, for now, they had to be placed horizontally. Future updates will also include vertical placement for both AI and the
player. There is also a landing and ending page that are handled through JavaScript DOM.


# GAME INSTRUCTIONS 
In order for the game to start, the player has to place the ships found beneath his board. Once all of the ships have been placed, a button will pop up that has to be pressed to pick
who is going to start firing shots at the opponent's ship. The player will be given two options - HEADS or TAILS, each having a 50% chance of winning or losing. Once the turn has been
generated, the game can start. Each player has one shot per turn, the game ends once one player gets all of his ships destroyed.

# DEPLOYMENT 
The game can be played and tested at: https://msionut28.github.io/Battleships-Project/

INSERT GAMEPLAY GIF HERE

# STRUCTURE AND BUILDING
- HTML - ONE INDEX.HTML THAT HAS A BASIC STRUCTURE, AS WELL AS BOOTSTRAP ELEMENTS
- CSS/ Bootstrap - ALL THE STYLING HAS BEEN CONDUCTED ON A SEPERATE .CSS FILE. MOST OF THE STYLING HAS BEEN DONE THROUGH CSS, HOWEVER BOOTSTRAP WAS ALSO USED FOR MODALS AND BUTTONS
- JavaScript - THE LOGIC WAS IMPLEMENTED THROUGH JAVASCRIPT BY CREATING FUNCTIONS THAT WOULD HANDLE STARTING GAME CONDITIONS, ACTUAL GAMEPLAY AND WINNING CONDITIONS FOR BOTH AI AND PLAYER.
               ARRAYS AND OBJECTS WERE USED TO STORE AND MANAGE DATA, AS WELL AS DOM MANIPULATION.
  -GitHub - STORING AND DEPLOYING THE PROJECT
  -VS Code - WRITING THE CODE


# PLANNING

INSERT EXCALIDRAW WIREFRAME HERE

The first step in building out my project was to have a plan to follow. I had layed out my basic grid structure, as well as things that I had to focus on, as well as features of the game
such as: extra points for streak hits. I was initially planning on different design for showing up the hit and missed ships, however throughout developing my project I thought that
using special characters instead of solid boxes would be more beneficial. 

# CODING

The top section of my code was mainly focused on declaring varaibles so it would be easier to read, but also to find and compare. For the landing page, I have created a <div> in the index.HTML and 
appended buttons with attributes specific to Bootstrap using JavaScript.

for (let i = 0; i < 3; i++){
    const landingPage = document.querySelector('.landing-page')
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('id', `f${i}`)
    button.className = 'btn btn-primary btn-lg'
    landingPage.appendChild(button) 
}

Once the start button has been pressed, the <div> and all of its child elements gets removed from the parent node, so the playing boards would be visible and the game could start.

function startGame(classOf) {
    let divToRemove = document.querySelector(classOf)
    
    if(divToRemove){
        while(divToRemove.firstChild){
            divToRemove.removeChild(divToRemove.firstChild)
        }
    
        divToRemove.parentNode.removeChild(divToRemove)
        document.body.style.overflow = 'visible'
    }



The coding process of actual gameplay starts by laying out the grids of the game,based on 3 declared variables: 

    const height = 10
    const width = 10
    const cellCount = width * height

    function boardGenerator(board) {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        //ADDING CELLS TO BOARD
        board.appendChild(cell)
    }


I have also used functions for generating rows and columns, as well as setting IDs for each individual <div> element in order to set coordinates of the grid.
 
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

....MORE CODING PROCESS TO FOLLOW REGARDING ISSHIPPLACEMENTVALID, RANDOMSHIPGENERATOR, CANGAMESTART, HANDLETURN, AICELLTARGETING AND TARGET&HUNT, SCOREBOARD, CHECKGAMEOVER

# CHALLENGES

- I found updating the grid with player's placed ships quite challenging, tried different ways to for drag&drop handling, the solution that I came up with was adding IDs and Classes for <div> elements matching settings made in .CSS file.

