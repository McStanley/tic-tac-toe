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

                const resultOutput = document.querySelector('#result');
                resultOutput.textContent = `${activePlayer.getName()} won`;

                return;
            }

        // check for a draw
        let markerCount = 0;
        for (const i in board) {
            if (board[i]) markerCount++;
        }
        if (markerCount === 9) {
            displayController.disableGrid();

            const resultOutput = document.querySelector('#result');
            resultOutput.textContent = `It's a draw`;

            return;
        }
    }
    return {
        getActivePlayer,
        toggleActivePlayer,
        resetActivePlayer,
        isOver,
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
    return {
        getBoard,
        placeMarker,
    };
})();

const displayController = (() => {
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
        for (const i in board) {
            gridCells[i].textContent = board[i];
        }
    };
    return {
        enableGrid,
        disableGrid,
        updateGrid,
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

// init
game.resetActivePlayer();
displayController.updateGrid();
displayController.enableGrid();
