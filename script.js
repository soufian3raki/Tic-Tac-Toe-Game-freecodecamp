const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const chooseXBtn = document.getElementById('chooseX');
const chooseOBtn = document.getElementById('chooseO');
const modePvCBtn = document.getElementById('modePvC');
const modePvPBtn = document.getElementById('modePvP');

let playerSymbol = 'X';
let computerSymbol = 'O';
let currentBoard = Array(9).fill('');
let gameActive = true;
let currentPlayer = 'X';
let gameMode = "PvC"; // "PvC" o "PvP"

// Marcadores
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
];

// Inicializar el juego
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true });
        cell.textContent = '';
        cell.style.color = '';
    });
    currentBoard = Array(9).fill('');
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = '¡Es tu turno!';
}

// Manejar el click en una celda
function handleClick(e) {
    if (!gameActive) return;

    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (currentBoard[index] !== '') return;

    makeMove(index, currentPlayer);

    if (checkWin(currentPlayer)) {
        if (currentPlayer === 'X') scoreX++;
        else scoreO++;
        endGame(`¡Jugador ${currentPlayer} ha ganado!`);
        updateScoreboard();
        return;
    }

    if (checkDraw()) {
        scoreDraw++;
        endGame("¡Empate!");
        updateScoreboard();
        return;
    }

    if (gameMode === "PvC") {
        setTimeout(computerMove, 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Turno de ${currentPlayer}`;
    }
}

// Realizar un movimiento
function makeMove(index, symbol) {
    currentBoard[index] = symbol;
    cells[index].textContent = symbol;
    cells[index].style.color = symbol === 'X' ? '#3498db' : '#e74c3c';
}

// Movimiento de la computadora
function computerMove() {
    if (!gameActive) return;

    const bestMove = findBestMove();
    makeMove(bestMove, computerSymbol);

    if (checkWin(computerSymbol)) {
        scoreO++;
        endGame("¡La computadora ha ganado!");
        updateScoreboard();
        return;
    }

    if (checkDraw()) {
        scoreDraw++;
        endGame("¡Empate!");
        updateScoreboard();
        return;
    }

    status.textContent = "¡Es tu turno!";
}

// Encontrar el mejor movimiento usando el algoritmo Minimax
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = 0;
    
    for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === '') {
            currentBoard[i] = computerSymbol;
            let score = minimax(currentBoard, 0, false);
            currentBoard[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

// Algoritmo Minimax
function minimax(board, depth, isMaximizing) {
    if (checkWin(computerSymbol, board)) return 1;
    if (checkWin(playerSymbol, board)) return -1;
    if (checkDraw(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Verificar si hay un ganador
function checkWin(symbol, boardState = currentBoard) {
    return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === symbol);
    });
}

// Verificar si hay empate
function checkDraw(boardState = currentBoard) {
    return boardState.every(cell => cell !== '');
}

// Terminar el juego
function endGame(message) {
    status.textContent = message + " Pulsa Reiniciar para jugar otra vez.";
    gameActive = false;
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

// Cambiar el símbolo del jugador
function changePlayerSymbol(symbol) {
    playerSymbol = symbol;
    computerSymbol = symbol === 'X' ? 'O' : 'X';
    chooseXBtn.classList.toggle('active', symbol === 'X');
    chooseOBtn.classList.toggle('active', symbol === 'O');
    initGame();
}

// Actualizar marcador
function updateScoreboard() {
    document.getElementById('scoreX').textContent = scoreX;
    document.getElementById('scoreO').textContent = scoreO;
    document.getElementById('scoreDraw').textContent = scoreDraw;
}

// Event listeners
resetBtn.addEventListener('click', initGame);
chooseXBtn.addEventListener('click', () => changePlayerSymbol('X'));
chooseOBtn.addEventListener('click', () => changePlayerSymbol('O'));

modePvCBtn.addEventListener('click', () => {
    gameMode = "PvC";
    modePvCBtn.classList.add('active');
    modePvPBtn.classList.remove('active');
    initGame();
});

modePvPBtn.addEventListener('click', () => {
    gameMode = "PvP";
    modePvPBtn.classList.add('active');
    modePvCBtn.classList.remove('active');
    initGame();
});

// Iniciar el juego
initGame();
updateScoreboard();
