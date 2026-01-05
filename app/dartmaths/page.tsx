'use client';

export default function DartmathsPage() {
  return (
    <>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f0f2f5;
          color: #333;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
        }

        #app {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
        }

        h1, h2 {
          text-align: center;
          color: #1c1e21;
        }

        h1 {
          margin-top: 0;
        }

        #setup, #game {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        #setup > div, #dart-entry {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        label {
          font-weight: bold;
        }

        input[type="number"],
        input[type="text"],
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 16px;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #0056b3;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        #player-names {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        #scoreboard {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          background-color: #f9f9f9;
        }

        .player-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          font-size: 16px;
        }

        .player-score:last-child {
          border-bottom: none;
        }

        .player-name {
          font-weight: bold;
          flex: 1;
        }

        .player-remaining {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          min-width: 80px;
          text-align: right;
        }

        .player-remaining.active {
          background-color: #e7f3ff;
          padding: 5px 10px;
          border-radius: 4px;
        }

        .player-remaining.bust {
          color: #dc3545;
        }

        .player-remaining.winner {
          color: #28a745;
          font-size: 24px;
        }

        .turn-info {
          background-color: #e7f3ff;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 10px;
        }


        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
          text-align: center;
        }

        .hidden {
          display: none !important;
        }
      `}</style>

      <div id="app">
        <h1>501 Darts</h1>

        <div id="setup">
          <h2>Setup Game</h2>
          <div>
            <label htmlFor="num-players">Number of Players:</label>
            <input type="number" id="num-players" min="1" max="10" defaultValue={2} />
          </div>
          <button id="start-game">Start Game</button>
          <div id="player-names"></div>
        </div>

        <div id="game" className="hidden">
          <div id="turn-info" className="turn-info"></div>
          <h2>Scoreboard</h2>
          <div id="scoreboard"></div>

          <div id="dart-entry">
            <label htmlFor="score-input">Enter your score for this round:</label>
            <input type="number" id="score-input" min="0" placeholder="Score" />

            <label htmlFor="is-finishing-double">
              <input type="checkbox" id="is-finishing-double" /> This is a finishing double
            </label>

            <button id="submit-score">Submit Score</button>
            <div id="error-message" className="error-message hidden"></div>
          </div>

          <div id="winner-modal" className="hidden" style={{marginTop: "20px", padding: "20px", backgroundColor: "#d4edda", borderRadius: "8px", textAlign: "center"}}>
            <h2 style={{color: "#155724", marginTop: "0"}}>🎉 <span id="winner-name"></span> Wins!</h2>
            <button id="new-game">Start New Game</button>
          </div>
        </div>
      </div>

      <script>{`
        document.addEventListener('DOMContentLoaded', () => {
          const numPlayersInput = document.getElementById('num-players');
          const startGameButton = document.getElementById('start-game');
          const playerNamesContainer = document.getElementById('player-names');
          const setupDiv = document.getElementById('setup');
          const gameDiv = document.getElementById('game');
          const scoreboardDiv = document.getElementById('scoreboard');
          const turnInfoDiv = document.getElementById('turn-info');
          const scoreInput = document.getElementById('score-input');
          const isFinishingDoubleCheckbox = document.getElementById('is-finishing-double');
          const submitScoreButton = document.getElementById('submit-score');
          const errorMessageDiv = document.getElementById('error-message');
          const winnerModal = document.getElementById('winner-modal');
          const winnerNameSpan = document.getElementById('winner-name');
          const newGameButton = document.getElementById('new-game');

          let players = [];
          let currentPlayerIndex = 0;
          let gameWon = false;

          const STARTING_SCORE = 501;

          loadGame();

          // Setup event listeners
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
              input.placeholder = \`Player \${i} Name\`;
              input.id = \`player-name-\${i}\`;
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
              const playerNameInput = document.getElementById(\`player-name-\${i}\`);
              players.push({
                name: playerNameInput.value || \`Player \${i}\`,
                remaining: STARTING_SCORE,
                history: [],
                busted: false
              });
            }
            currentPlayerIndex = 0;
            gameWon = false;
            setupDiv.classList.add('hidden');
            gameDiv.classList.remove('hidden');
            winnerModal.classList.add('hidden');
            resetForm();
            renderScoreboard();
            saveGame();
          }

          function resetForm() {
            scoreInput.value = '';
            isFinishingDoubleCheckbox.checked = false;
            errorMessageDiv.classList.add('hidden');
            updateTurnInfo();
          }

          function updateTurnInfo() {
            turnInfoDiv.textContent = \`\${players[currentPlayerIndex].name}'s Turn - Remaining: \${players[currentPlayerIndex].remaining}\`;
          }

          function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.classList.remove('hidden');
          }

          submitScoreButton.addEventListener('click', () => {
            const score = parseInt(scoreInput.value, 10);
            if (isNaN(score) || score < 0) {
              showError('Please enter a valid score (0 or higher)');
              return;
            }

            const player = players[currentPlayerIndex];
            const newScore = player.remaining - score;

            // Bust check
            if (newScore < 0) {
              player.busted = true;
              showError(\`BUST! \${player.name} overshot by \${Math.abs(newScore)} points. Score remains \${player.remaining}. Next turn!\`);
              setTimeout(() => {
                nextTurn();
              }, 2000);
              return;
            }

            // Exactly 0 - check finish rule
            if (newScore === 0) {
              if (!isFinishingDoubleCheckbox.checked) {
                showError('To win, your final dart must be a DOUBLE. Mark the checkbox if this round includes a finishing double.');
                return;
              }
              // Winner!
              player.remaining = 0;
              player.history.push(score);
              renderScoreboard();
              saveGame();
              declareWinner(player.name);
              return;
            }

            // Valid turn
            player.remaining = newScore;
            player.busted = false;
            player.history.push(score);
            renderScoreboard();
            saveGame();
            resetForm();
            nextTurn();
          });

          function nextTurn() {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            resetForm();
          }

          function declareWinner(playerName) {
            gameWon = true;
            gameDiv.style.display = 'none';
            winnerModal.classList.remove('hidden');
            winnerNameSpan.textContent = playerName;
          }

          newGameButton.addEventListener('click', () => {
            localStorage.removeItem('darts501Game');
            location.reload();
          });

          function renderScoreboard() {
            scoreboardDiv.innerHTML = '';
            players.forEach((player, index) => {
              const playerScore = document.createElement('div');
              playerScore.classList.add('player-score');

              let remainingClass = 'player-remaining';
              if (index === currentPlayerIndex && !gameWon) {
                remainingClass += ' active';
              }
              if (player.busted) {
                remainingClass += ' bust';
              }
              if (player.remaining === 0) {
                remainingClass += ' winner';
              }

              playerScore.innerHTML = \`
                <span class="player-name">\${player.name}\${player.busted ? ' (BUST)' : ''}</span>
                <span class="\${remainingClass}">\${player.remaining}</span>
              \`;
              scoreboardDiv.appendChild(playerScore);
            });
          }

          function saveGame() {
            localStorage.setItem('darts501Game', JSON.stringify({
              players,
              currentPlayerIndex,
              gameWon
            }));
          }

          function loadGame() {
            const savedGame = localStorage.getItem('darts501Game');
            if (savedGame) {
              try {
                const data = JSON.parse(savedGame);
                players = data.players;
                currentPlayerIndex = data.currentPlayerIndex;
                gameWon = data.gameWon;
                if (players.length > 0) {
                  setupDiv.classList.add('hidden');
                  gameDiv.classList.remove('hidden');
                  if (gameWon) {
                    winnerModal.classList.remove('hidden');
                    gameDiv.style.display = 'none';
                    const winner = players.find(p => p.remaining === 0);
                    winnerNameSpan.textContent = winner ? winner.name : 'Unknown';
                  } else {
                    resetForm();
                    renderScoreboard();
                  }
                }
              } catch (e) {
                console.error('Failed to load game:', e);
              }
            }
          }
        });
      `}</script>
    </>
  );
}
