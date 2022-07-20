const game = (() => {
    let mode = null;
    let activePlayer = null;
    const getActivePlayer = () => activePlayer;
    const toggleActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const resetActivePlayer = () => {
        activePlayer = player1;
    };
    const playerMove = (e) => {
        // check if the cell is empty
        const board = gameBoard.getBoard();
        const i = e.target.dataset.index;
        if (board[i]) return;

        gameBoard.placeMarker(i);

        // check if game is over
        if (checkWinner(false)) return;
        if (mode === 'easy') randomMove();
        if (mode === 'impossible') bestMove();
    };
    const randomMove = () => {
        const board = gameBoard.getBoard();

        let i;
        do {
            // random index from 0 to 9
            i = Math.floor(Math.random() * 9);
        } while (board[i]);

        gameBoard.placeMarker(i);
    };
    const bestMove = () => {
        const board = gameBoard.getBoard();
        const marker = game.getActivePlayer().getMarker();
        let bestScore = -Infinity;
        let move;

        // find empty cells
        for (const i in board) {
            if (!board[i]) {
                // temporarily put marker in the cell
                board[i] = marker;
                let score = minimax(board, 0, false);
                // delete marker after checking it
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameBoard.placeMarker(move);
    };
    const minimax = (board, depth, isMaximizing) => {
        let result = checkWinner(false);
        // check if game is over
        if (result) {
            const marker = getActivePlayer().getMarker();
            // active player wins
            if (result === marker) return 1;
            // game ends in a draw
            if (result === 'draw') return 0;
            // active player lose
            return -1;
        }

        // maximizing
        if (isMaximizing) {
            let bestScore = -Infinity;
            const marker = game.getActivePlayer().getMarker();
            // find empty cells
            for (const i in board) {
                if (!board[i]) {
                    board[i] = marker;
                    let score = minimax(board, depth + 1, false);
                    // delete marker after checking it
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }

        // minimizing
        let bestScore = Infinity;
        const marker = game.getActivePlayer().getMarker() === 'O' ? 'X' : 'O';
        // find empty cells
        for (const i in board) {
            if (!board[i]) {
                board[i] = marker;
                let score = minimax(board, depth + 1, true);
                // delete marker after checking it
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    };
    const checkWinner = (displayOutcome) => {
        // get current board state
        const board = gameBoard.getBoard();

        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        let outcome = false;

        // check for a draw
        let markerCount = 0;
        for (const i in board) {
            if (board[i]) markerCount++;
        }
        if (markerCount === 9) {
            outcome = 'draw';
        }
        // check if someone won
        for (const combo of winCombos) {
            const a = combo[0];
            const b = combo[1];
            const c = combo[2];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                outcome = board[a];
            }
        }
        // display game outcome if displayOutcome parameter is true
        if (outcome && displayOutcome) {
            displayController.displayResult(outcome);
            displayController.toggleRestart();
        }

        return outcome;
    };
    const init = () => {
        gameBoard.resetBoard();
        game.resetActivePlayer();
        displayController.updateOutput('');
        displayController.updateGrid();
        displayController.toggleRestart();
        displayController.updateBlur();
    };
    const initNext = () => {
        init();
        displayController.updateOutput(`${game.getActivePlayer().getName()} move`);
    };
    const savePref = () => {
        const name1 = document.querySelector('#name1').value;
        const name2 = document.querySelector('#name2').value;
        player1.setName(name1 || 'Player 1');
        player2.setName(name2 || 'Player 2');

        const radioModes = document.querySelectorAll('input[name=mode]');
        for (const i in radioModes) {
            if (radioModes[i].checked) {
                mode = radioModes[i].value;
            }
        }

        displayController.updateOutput(`${game.getActivePlayer().getName()} move`);
        displayController.toggleMenu();
    };
    return {
        getActivePlayer,
        toggleActivePlayer,
        resetActivePlayer,
        playerMove,
        checkWinner,
        init,
        initNext,
        savePref,
    };
})();

const gameBoard = (() => {
    let board = Array(9).fill(null);
    const getBoard = () => board;
    const placeMarker = (i) => {
        const marker = game.getActivePlayer().getMarker();
        board[i] = marker;
        displayController.updateGrid();
        // stop if game over
        if (game.checkWinner(true)) return;
        // otherwise toggle active player and update output
        game.toggleActivePlayer();
        displayController.updateOutput(`${game.getActivePlayer().getName()} move`);
    };
    const resetBoard = () => {
        board = Array(9).fill(null);
    };
    return {
        getBoard,
        placeMarker,
        resetBoard,
    };
})();

const displayController = (() => {
    const grid = document.querySelector('#grid');
    const gridCells = document.querySelectorAll('.grid-cell');

    const enableGrid = () => {
        for (const cell of gridCells) {
            cell.addEventListener('click', game.playerMove);
        }
    };
    const disableGrid = () => {
        for (const cell of gridCells) {
            cell.removeEventListener('click', game.playerMove);
        }
    };
    const updateGrid = () => {
        const board = gameBoard.getBoard();
        for (let i = 0; i < 9; i++) {
            gridCells[i].textContent = board[i];
        }
    };
    const updateOutput = (message) => {
        const output = document.querySelector('#output');
        output.textContent = message;
    };
    const displayResult = (result) => {
        if (result === 'O' || result === 'X') {
            const winner = result === player1.getMarker() ? player1.getName() : player2.getName();
            updateOutput(`${winner} won`);
        }
        if (result === 'draw') {
            updateOutput(`It's a draw`);
        }
    };
    const updateBlur = () => {
        const menu = document.querySelector('#menu');
        const restartBtn = document.querySelector('#restart-btn');

        if (
            menu.classList.contains('active') ||
            restartBtn.classList.contains('active')
            ) {
            grid.classList.add('blur');
            disableGrid();
        } else {
            grid.classList.remove('blur');
            enableGrid();
        }
    };
    const toggleMenu = () => {
        const menu = document.querySelector('#menu');
        menu.classList.toggle('active');
        updateBlur();
    };
    const toggleRestart = () => {
        const restartBtn = document.querySelector('#restart-btn');
        restartBtn.classList.toggle('active');
        updateBlur();
    };
    return {
        updateGrid,
        updateOutput,
        displayResult,
        updateBlur,
        toggleMenu,
        toggleRestart,
    };
})();

const Player = (name, marker) => {
    let _name = name;
    let _marker = marker;

    const getName = () => _name;
    const getMarker = () => _marker;
    const setName = (name) => _name = name;
    const setMarker = (marker) => _marker = marker;
    return {
        getName,
        getMarker,
        setName,
        setMarker,
    };
};

// define players
const player1 = Player('Player 1', 'O');
const player2 = Player('Player 2', 'X');

// add event listeners
const playBtn = document.querySelector('#play-btn');
playBtn.addEventListener('click', game.savePref);

const restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', game.initNext);

// init
game.init();
