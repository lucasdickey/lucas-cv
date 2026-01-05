document.addEventListener('DOMContentLoaded', () => {
    const numPlayersInput = document.getElementById('num-players');
    const startGameButton = document.getElementById('start-game');
    const playerNamesContainer = document.getElementById('player-names');
    const setupDiv = document.getElementById('setup');
    const gameDiv = document.getElementById('game');
    const scoreboardDiv = document.getElementById('scoreboard');
    const currentPlayerSelect = document.getElementById('current-player');
    const scoreInput = document.getElementById('score-input');
    const addScoreButton = document.getElementById('add-score');

    let players = [];

    loadGame();

    startGameButton.addEventListener('click', () => {
        const numPlayers = parseInt(numPlayersInput.value, 10);
        if (numPlayers > 0 && numPlayers <= 10) {
            createPlayerNameInputs(numPlayers);
        } else {
            alert('Please enter a number of players between 1 and 10.');
        }
    });

    function createPlayerNameInputs(numPlayers) {
        playerNamesContainer.innerHTML = '';
        for (let i = 1; i <= numPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Player ${i} Name`;
            input.id = `player-name-${i}`;
            playerNamesContainer.appendChild(input);
        }
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm Players';
        confirmButton.id = 'confirm-players';
        playerNamesContainer.appendChild(confirmButton);

        document.getElementById('confirm-players').addEventListener('click', () => {
            initializeGame(numPlayers);
        });
    }

    function initializeGame(numPlayers) {
        players = [];
        for (let i = 1; i <= numPlayers; i++) {
            const playerNameInput = document.getElementById(`player-name-${i}`);
            players.push({
                name: playerNameInput.value || `Player ${i}`,
                score: 0,
                history: []
            });
        }
        setupDiv.classList.add('hidden');
        gameDiv.classList.remove('hidden');
        renderScoreboard();
        updateCurrentPlayerOptions();
        saveGame();
    }

    function renderScoreboard() {
        scoreboardDiv.innerHTML = '';
        players.forEach((player, index) => {
            const playerScore = document.createElement('div');
            playerScore.classList.add('player-score');
            playerScore.innerHTML = `
                <span><strong>${player.name}:</strong></span>
                <span>${player.score}</span>
            `;
            scoreboardDiv.appendChild(playerScore);
        });
    }

    function updateCurrentPlayerOptions() {
        currentPlayerSelect.innerHTML = '';
        players.forEach((player, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = player.name;
            currentPlayerSelect.appendChild(option);
        });
    }

    addScoreButton.addEventListener('click', () => {
        const selectedPlayerIndex = currentPlayerSelect.value;
        const score = parseInt(scoreInput.value, 10);

        if (!isNaN(score)) {
            updateScore(selectedPlayerIndex, score);
            scoreInput.value = '';
        } else {
            alert('Please enter a valid score.');
        }
    });

    function updateScore(playerIndex, points) {
        players[playerIndex].score += points;
        players[playerIndex].history.push(points);
        renderScoreboard();
        saveGame();
    }

    function saveGame() {
        localStorage.setItem('dartsGame', JSON.stringify(players));
    }

    function loadGame() {
        const savedGame = localStorage.getItem('dartsGame');
        if (savedGame) {
            players = JSON.parse(savedGame);
            if (players.length > 0) {
                setupDiv.classList.add('hidden');
                gameDiv.classList.remove('hidden');
                renderScoreboard();
                updateCurrentPlayerOptions();
            }
        }
    }
});
