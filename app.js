const gameBoard = (() => {
    let board = ['','X','','','O','','X','X','O'];
    const getBoard = () => board;
    return {
        getBoard,
    };
})();

const displayController = (() => {
    const gridCell = document.querySelectorAll('.grid-cell');
    const updateGrid = () => {
        const board = gameBoard.getBoard();
        for (const i in board) {
            gridCell[i].textContent = board[i];
        }
    };
    return {
        updateGrid,
    };
})();

displayController.updateGrid();
