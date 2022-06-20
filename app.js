const game = (() => {
    let activePlayer = null;
    const getActivePlayer = () => activePlayer;
    const toggleActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const resetActivePlayer = () => {
        activePlayer = player1;
    }
    const isOver = () => {
        // get current board state
        const board = gameBoard.getBoard();

        // check if someone won
        if (
            // rows
            board[0] && board[0] === board [1] && board[0] === board[2] ||
            board[3] && board[3] === board [4] && board[3] === board[5] ||
            board[6] && board[6] === board [7] && board[6] === board[8] ||

            // columns
            board[0] && board[0] === board [3] && board[0] === board[6] ||
            board[1] && board[1] === board [4] && board[1] === board[7] ||
            board[2] && board[2] === board [5] && board[2] === board[8] ||

            // diagonals
            board[0] && board[0] === board [4] && board[0] === board[8] ||
            board[6] && board[6] === board [4] && board[6] === board[2]
            ) {
                displayController.disableGrid();

                displayController.updateOutput(`${activePlayer.getName()} won`);
                displayController.toggleRestart();

                return;
            }

        // check for a draw
        let markerCount = 0;
        for (const i in board) {
            if (board[i]) markerCount++;
        }
        if (markerCount === 9) {
            displayController.disableGrid();

            displayController.updateOutput(`It's a draw`);
            displayController.toggleRestart();

            return;
        }
    }
    const init = () => {
        const popups = document.querySelectorAll('.popup');
        for (const popup of popups) {
            popup.classList.remove('active');
        }

        gameBoard.resetBoard();
        game.resetActivePlayer();
        displayController.updateOutput('');
        displayController.updateGrid();
        displayController.disableBlur();
        displayController.enableGrid();
    }
    return {
        getActivePlayer,
        toggleActivePlayer,
        resetActivePlayer,
        isOver,
        init,
    }
})();

const gameBoard = (() => {
    let board = [];
    const getBoard = () => board;
    const placeMarker = (e) => {
        // check if the cell is empty
        const i = e.target.dataset.index;
        if (board[i]) return;

        const marker = game.getActivePlayer().getMarker();
        board[i] = marker;
        displayController.updateGrid();
        game.isOver();
        game.toggleActivePlayer();
    };
    const resetBoard = () => {
        board = [];
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
            cell.addEventListener('click', gameBoard.placeMarker);
        }
    }
    const disableGrid = () => {
        for (const cell of gridCells) {
            cell.removeEventListener('click', gameBoard.placeMarker);
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
    }
    const toggleBlur = () => {
        grid.classList.toggle('blur');
    };
    const disableBlur = () => {
        grid.classList.remove('blur');
    }
    const toggleRestart = () => {
        const restartBtn = document.querySelector('#restart-btn');

        toggleBlur();
        restartBtn.classList.toggle('active');
    }
    return {
        enableGrid,
        disableGrid,
        updateGrid,
        updateOutput,
        toggleBlur,
        disableBlur,
        toggleRestart,
    };
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    return {
        getName,
        getMarker,
    };
};

// define players
const player1 = Player('Player 1', 'O');
const player2 = Player('Player 2', 'X');

// add event listeners
const restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', game.init);

// init
game.init();
