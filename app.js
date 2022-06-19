const game = (() => {
    let activePlayer = null;
    const getActivePlayer = () => activePlayer;
    const toggleActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const resetActivePlayer = () => {
        activePlayer = player1;
    }
    return {
        getActivePlayer,
        toggleActivePlayer,
        resetActivePlayer,
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
        game.toggleActivePlayer();
    };
    return {
        getBoard,
        placeMarker,
    };
})();

const displayController = (() => {
    const gridCells = document.querySelectorAll('.grid-cell');

    for (const cell of gridCells) {
        cell.addEventListener('click', gameBoard.placeMarker);
    }
    const updateGrid = () => {
        const board = gameBoard.getBoard();
        for (const i in board) {
            gridCells[i].textContent = board[i];
        }
    };
    return {
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
