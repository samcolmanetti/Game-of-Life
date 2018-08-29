var game = new Phaser.Game(660, 660, Phaser.AUTO, 'gameDiv');
var board; 
var SIZE = 20;
var cellSize = 33; // blocks are 33x33px

var mainState = {

    // This function is called first and loads all of the game assets
    preload: function() {
        board = new Array(SIZE); 
        for (var i = 0; i < SIZE; i++){
            board[i] = new Array(SIZE); 
        }
        for (var i = 0; i < SIZE; i++){
            for (var j = 0; j < SIZE; j++){
                board[i][j] = false; 
            }
        }
        
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('alive', 'assets/alive_33.png');  
        game.load.image('dead', 'assets/dead_33.png');      
    },

    // This fuction is called after 'preload' to setup the game 
    create: function() {
        placeGlider(12,12); 
        placeBlock(8,8); 
        placeVerticalBlinker(15,15);
        
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(nextStep, this); 

        //this.steps = 0;
        //this.labelScore = this.game.add.text(20, 15, "0", { font: "30px Arial", fill: "#ffffff" });  
    }
    
};

function displayBoard (){
     for (var i = 0; i < SIZE; i++){
            for (var j = 0; j < SIZE; j++){
                if (board[i][j] == true){
                    game.add.image(cellSize*i, cellSize*j, "alive"); 
                }else {
                    game.add.image(cellSize*i,cellSize*j,"dead"); 
                }
            }
        }
}

function placeGlider (x, y){
    if (x > 0 && x+2 < SIZE-1 && y+2 < SIZE-1 && y > 0) {
        board[y][x] = true;
        board[y][x+1] = true;
        board[y][x+2] = true;
        board[y+1][x] = true;
        board[y+2][x+1] = true;
        displayBoard();
    }
}
function placeBlock (x, y){
    if (x+1 < SIZE-1 && x>0 && y+1 < SIZE-1 && y>0) {
        board[y][x] = true;
        board[y + 1][x] = true;
        board[y + 1][x + 1] = true;
        board[y][x + 1] = true;
        displayBoard();
    }
}
function placeVerticalBlinker (x, y){
    if (y+2 < SIZE - 1 && y > 0 && x < SIZE-1 && x>0) {
        board[y][x] = true;
        board[y+1][x] = true;
        board[y+2][x] = true;
        displayBoard();
    } 
}
function nextStep (){
    var temp = clone(board);

    for (var i = 1; i < SIZE-1; i++){
        for (var j = 1; j < SIZE - 1; j++){
            if (board[i][j]) {    // if alive
                if (!continueLiving(i,j))
                    temp[i][j] = false;
            } else {              // if dead
                if (comeBack(i,j))
                    temp[i][j] = true;
            }
        }
    }
    board = temp;
    displayBoard();
}
function clone (b){
        var result = new Array(SIZE); 
        for (var i = 0; i < SIZE; i++){
            result[i] = new Array(SIZE); 
        }
        
        for (var i = 0; i < SIZE; i++){
            for (var j = 0; j < SIZE; j++){
                if (board[i][j])
                    result[i][j] = true;
                else
                    result[i][j] = false;
            }
        }
        return result;
}

function continueLiving (x, y){
    var count = countLiveNeighbors(x,y);
    return (count == 2 || count == 3);
}

function comeBack (x, y){
    return (countLiveNeighbors(x,y) == 3)
}
function countLiveNeighbors (x, y){
    var count = 0;
        if (board[x+1][y])
            count++;
        if (board[x-1][y])
            count++;
        if (board[x][y+1])
            count++;
        if (board[x][y-1])
            count++;
        if (board[x+1][y+1])
            count++;
        if (board[x+1][y-1])
            count++;
        if (board[x-1][y+1])
            count++;
        if (board[x-1][y-1])
            count++;
        return count;
}

game.state.add('main', mainState);
game.state.start('main');
