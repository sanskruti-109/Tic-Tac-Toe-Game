const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const difficulty = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

function handleClick(e) {
    const index = e.target.dataset.index;
    if (board[index] || gameOver) return;

    board[index] = "X";
    e.target.textContent = "X";

    if (checkWinner("X")) {
    message.textContent = "🎉 You win!";
    gameOver = true;
    return;
}

    if (isDraw()) {
    message.textContent = "It's a draw!";
    gameOver = true;
    return;
}

    setTimeout(robotMove, 500);
}

function robotMove() {
    let move;
    if (difficulty.value === "easy") {
    const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
    } else {
    move = getBestMove();
    }

    if (move != null) {
    board[move] = "O";
    cells[move].textContent = "O";
    }

    if (checkWinner("O")) {
    message.textContent = "🤖 Robot wins!";
    gameOver = true;
    } else if (isDraw()) {
    message.textContent = "It's a draw!";
    gameOver = true;
    }
}

function checkWinner(player) {
    const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
    ];
    return wins.some(combo => combo.every(i => board[i] === player));
}

function isDraw() {
    return board.every(cell => cell !== "");
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    gameOver = false;
    message.textContent = "";
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
        bestScore = score;
        move = i;
        }
    }
    }
    return move;
}

function minimax(board, depth, isMax) {
    if (checkWinner("O")) return 1;
    if (checkWinner("X")) return -1;
    if (isDraw()) return 0;

    if (isMax) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
        board[i] = "O";
        let eval = minimax(board, depth + 1, false);
        board[i] = "";
        maxEval = Math.max(maxEval, eval);
        }
    }
    return maxEval;
    } else {
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
        board[i] = "X";
        let eval = minimax(board, depth + 1, true);
        board[i] = "";
        minEval = Math.min(minEval, eval);
        }
    }
    return minEval;
    }
}
