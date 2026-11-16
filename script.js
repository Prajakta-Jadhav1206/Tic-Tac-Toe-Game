
const btns = document.querySelectorAll(".btn");
const resetBtn = document.querySelector("#reset");
const newGameBtn = document.querySelector("#new-reset");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const gameMode = document.querySelector("#gameMode");
const turnText = document.querySelector("#turn");

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

let turnO = true;
let gameOver = false;
let computerThinking = false;

function getWinner(board) {
    for (const pattern of winPatterns) {
        const [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] &&
            board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function getBoard() {
    return Array.from(btns, btn => btn.innerText);
}

function updateTurn() {
    if (gameMode.value === "1") {
        turnText.innerText = "Your turn (O)";
    } else {
        turnText.innerText =
            turnO ? "Player O's turn" : "Player X's turn";
    }
}

function finishGame(winner) {
    gameOver = true;

    if (winner) {
        if (gameMode.value === "1") {
            msg.innerText = winner === "O"
                ? "Congratulations! You Win!"
                : "Computer Wins!";
        } else {
            msg.innerText = `Player ${winner} Wins!`;
        }
    } else {
        msg.innerText = "It's a Draw!";
    }

    msgContainer.classList.remove("hide");
    btns.forEach(btn => btn.disabled = true);
}

function checkGame() {
    const board = getBoard();
    const winner = getWinner(board);

    if (winner) {
        finishGame(winner);
        return true;
    }

    if (board.every(cell => cell !== "")) {
        finishGame(null);
        return true;
    }

    return false;
}

// AI: Minimax algorithm
function minimax(board, isMaximizing) {
    const winner = getWinner(board);

    if (winner === "X") return 10;
    if (winner === "O") return -10;
    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                bestScore = Math.max(
                    bestScore, minimax(board, false)
                );
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                bestScore = Math.min(
                    bestScore, minimax(board, true)
                );
                board[i] = "";
            }
        }
        return bestScore;
    }
}

function computerMove() {
    if (gameOver) return;

    computerThinking = true;
    turnText.innerText = "Computer is thinking...";

    setTimeout(() => {
        const board = getBoard();
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";

                const score = minimax(board, false);

                board[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        if (bestMove !== -1 && !gameOver) {
            btns[bestMove].innerText = "X";
            btns[bestMove].disabled = true;
        }

        computerThinking = false;

        if (!checkGame()) {
            turnO = true;
            updateTurn();
        }
    }, 500);
}

btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (gameOver || computerThinking || btn.disabled) return;

        if (gameMode.value === "1" && !turnO) return;

        btn.innerText = turnO ? "O" : "X";
        btn.disabled = true;

        if (checkGame()) return;

        turnO = !turnO;

        if (gameMode.value === "1") {
            computerMove();
        } else {
            updateTurn();
        }
    });
});

function resetGame() {
    turnO = true;
    gameOver = false;
    computerThinking = false;

    btns.forEach(btn => {
        btn.innerText = "";
        btn.disabled = false;
    });

    msgContainer.classList.add("hide");
    updateTurn();
}

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
gameMode.addEventListener("change", resetGame);

resetGame();
