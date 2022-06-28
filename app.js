const game = (() => {
    let mode = null;
    let activePlayer = null;
    const getActivePlayer = () => activePlayer;
    const toggleActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const resetActivePlayer = () => {
        activePlayer = player1;
    }
    const playerMove = (e) => {
        // check if the cell is empty
        const board = gameBoard.getBoard();
        const i = e.target.dataset.index;
        if (board[i]) return;

        gameBoard.placeMarker(i);

        if (!game.isOver()) {
            if (mode === 'easy') {
                easyMove();
                isOver();
            }
            if (mode === 'impossible') {
                impossibleMove();
                isOver();
            }
        }
    }
    const easyMove = () => {
        const board = gameBoard.getBoard();

        let i;
        do {
            // random index from 0 to 9
            i = Math.floor(Math.random() * 9);
        } while (board[i]);
        gameBoard.placeMarker(i);
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
                displayController.updateOutput(`${activePlayer.getName()} won`);
                displayController.toggleRestart();

                game.toggleActivePlayer();
                return true;
            }

        // check for a draw
        let markerCount = 0;
        for (const i in board) {
            if (board[i]) markerCount++;
        }
        if (markerCount === 9) {
            displayController.updateOutput(`It's a draw`);
            displayController.toggleRestart();

            game.toggleActivePlayer();
            return true;
        }
        game.toggleActivePlayer();
        displayController.updateOutput(`${game.getActivePlayer().getName()} move`);
        return false;
    }
    const init = () => {
        gameBoard.resetBoard();
        game.resetActivePlayer();
        displayController.updateOutput('');
        displayController.updateGrid();
        displayController.toggleRestart();
        displayController.updateBlur();
    }
    const initNext = () => {
        init();
        displayController.updateOutput(`${game.getActivePlayer().getName()} move`);
    }
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
    }
    return {
        getActivePlayer,
        toggleActivePlayer,
        resetActivePlayer,
        playerMove,
        isOver,
        init,
        initNext,
        savePref,
    }
})();

const gameBoard = (() => {
    let board = [];
    const getBoard = () => board;
    const placeMarker = (i) => {
        const marker = game.getActivePlayer().getMarker();
        board[i] = marker;
        displayController.updateGrid();
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
            cell.addEventListener('click', game.playerMove);
        }
    }
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
    }
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
    }
    const toggleRestart = () => {
        const restartBtn = document.querySelector('#restart-btn');
        restartBtn.classList.toggle('active');
        updateBlur();
    }
    return {
        updateGrid,
        updateOutput,
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
