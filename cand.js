var candies = ["mavi", "turuncu", "yesil", "sari", "kirmizi", "mor"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

window.onload = function() {
    startGame();

    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; 
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

           
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);  
            tile.addEventListener("dragenter", dragEnter); 
            tile.addEventListener("dragleave", dragLeave); 
            tile.addEventListener("drop", dragDrop); 
            tile.addEventListener("dragend", dragEnd); 

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}



function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    // Yatay eşleşmeler
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            if (board[r][c].src === board[r][c+1].src && 
                board[r][c+1].src === board[r][c+2].src &&
                !board[r][c].src.includes("blank")) {
                board[r][c].src = "./images/blank.png";
                board[r][c+1].src = "./images/blank.png";
                board[r][c+2].src = "./images/blank.png";
                score += 30;
            }
        }
    }

  
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            if (board[r][c].src === board[r+1][c].src && 
                board[r+1][c].src === board[r+2][c].src &&
                !board[r][c].src.includes("blank")) {
                board[r][c].src = "./images/blank.png";
                board[r+1][c].src = "./images/blank.png";
                board[r+2][c].src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows-1; r >= 0; r--) { 
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function dragStart(e) {
    currTile = this;
    e.dataTransfer.setData("text/plain", ""); // Firefox için gerekli
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!currTile || !otherTile) return;
    
    // Koordinatları al
    let currCoords = currTile.id.split("-");
    let r1 = parseInt(currCoords[0]);
    let c1 = parseInt(currCoords[1]);
    
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Sadece yan yana hareket kontrolü
    if ((Math.abs(r1 - r2) === 1 && c1 === c2) || 
        (Math.abs(c1 - c2) === 1 && r1 === r2)) {
        
      
        const tempSrc = currTile.src;
        currTile.src = otherTile.src;
        otherTile.src = tempSrc;

      
        if (!checkValid()) {
            
            setTimeout(() => {
                currTile.src = tempSrc;
                otherTile.src = currTile.src;
            }, 100);
        }
    }
}

