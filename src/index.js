class Board {
    static #instance;
    static EMPTY = 0;
    static X = 1;
    static O = 2;
    static HTML = [
        "",
        "<img src=\"img/x.png\" alt=\"X\">",
        "<img src=\"img/o.png\" alt=\"O\">"
    ];

    static getInstance() {
        return Board.#instance;
    }

    #cell;
    #cellElts;
    #status;
    #statusElt;
    #gameOver;
    //Must forward declare private properties

    draw() {
        for(let i = 0; i < 9; i++) {
            this.#cellElts[i].innerHTML = Board.HTML[this.#cell[i]];
        }
        this.#statusElt.innerHTML = this.#status;
    }
    
    move(cellRef) {
        if(this.#gameOver || this.#cell[cellRef] != Board.EMPTY) return;
        this.#cell[cellRef] = Board.O;
        this.#cellElts[cellRef].innerHTML = Board.HTML[Board.O];
    }

    newGame() {
        for(let i = 0; i < 9; i++) {
            this.#cell[i] = Board.EMPTY;
        }
        this.#gameOver = false;
        this.#status = "Let's Play!";
        fetch('http://localhost:9876/')
            .then(response => response.text())
            .then(text => {this.#status = text;this.draw();})
            .catch(error => {
                console.error('Error retrieving status:', error);
            });
        this.draw();
    }

    constructor(boardElt) { //Singleton Pattern
        if (!Board.#instance) {
            Board.#instance = this;
            this.#cellElts = boardElt.getElementsByClassName('boardcell');
            for (let i = 0; i < 9; i++) {
                this.#cellElts[i].addEventListener("click", ((index) => {
                    return (e) => {
                        Board.#instance.move(index);
                    };
                })(i));
            }
            this.#cell = [Board.X, Board.O, Board.X, Board.O, Board.X, Board.O, Board.X, Board.O, Board.X];
            this.#gameOver = true;
            this.#statusElt = document.getElementById('boardstatus'); 
            this.#status = "Game Over";
            this.draw();
        }
        return Board.#instance;
    }
}

window.onload = function() {
    board = new Board(document.getElementById('board'));
    document.getElementById('btnNewGame').addEventListener(
        "click",
        function (e) {
            Board.getInstance().newGame();
        }
    );
}
