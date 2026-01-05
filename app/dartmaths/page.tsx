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

        .dart-counter {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .dart-multiplier-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dart-multiplier-buttons button {
          padding: 8px 10px;
          font-size: 14px;
          background-color: #6c757d;
        }

        .dart-multiplier-buttons button:hover {
          background-color: #5a6268;
        }

        .dart-value-display {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          margin-top: 10px;
          font-size: 16px;
          font-weight: bold;
        }

        .dart-value-display.preview {
          background-color: #fff3cd;
          color: #856404;
        }

        .turn-summary {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
          font-size: 14px;
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
            <input type="number" id="num-players" min="1" max="10" defaultValue="2" />
          </div>
          <button id="start-game">Start Game</button>
          <div id="player-names"></div>
        </div>

        <div id="game" className="hidden">
          <div id="turn-info" className="turn-info"></div>
          <h2>Scoreboard</h2>
          <div id="scoreboard"></div>

          <div id="dart-entry">
            <div className="dart-counter"><span id="dart-count">Dart 1</span> of 3</div>

            <label htmlFor="dart-segment">Dart Segment (1-20):</label>
            <input type="number" id="dart-segment" min="1" max="20" placeholder="Segment number" />

            <label>Multiplier:</label>
            <div className="dart-multiplier-buttons">
              <button id="btn-single" data-multiplier="1">Single (1x)</button>
              <button id="btn-double" data-multiplier="2">Double (2x)</button>
              <button id="btn-treble" data-multiplier="3">Treble (3x)</button>
            </div>

            <div>
              <label htmlFor="special-score">Special Scores:</label>
              <select id="special-score">
                <option value="">-- Select --</option>
                <option value="25">Bullseye (25)</option>
                <option value="50">Double Bullseye (50)</option>
              </select>
            </div>

            <div id="dart-value-display" className="dart-value-display hidden">Dart Value: <span id="dart-value-text">0</span></div>

            <button id="confirm-dart">Confirm Dart</button>

            <div id="turn-summary" className="turn-summary hidden">
              <strong>This Turn So Far:</strong>
              <div id="turn-darts-list"></div>
              <div id="turn-total">Total: 0 points</div>
            </div>

            <button id="finish-turn">Finish Turn</button>
            <button id="undo-dart">Undo Last Dart</button>
            <div id="error-message" className="error-message hidden"></div>
          </div>

          <div id="winner-modal" className="hidden" style={{marginTop: "20px", padding: "20px", backgroundColor: "#d4edda", borderRadius: "8px", textAlign: "center"}}>
            <h2 style={{color: "#155724", marginTop: 0}}>🎉 <span id="winner-name"></span> Wins!</h2>
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
          const dartSegmentInput = document.getElementById('dart-segment');
          const specialScoreSelect = document.getElementById('special-score');
          const confirmDartButton = document.getElementById('confirm-dart');
          const finishTurnButton = document.getElementById('finish-turn');
          const undoDartButton = document.getElementById('undo-dart');
          const dartCountDisplay = document.getElementById('dart-count');
          const dartValueDisplay = document.getElementById('dart-value-display');
          const dartValueText = document.getElementById('dart-value-text');
          const turnSummaryDiv = document.getElementById('turn-summary');
          const turnDartsList = document.getElementById('turn-darts-list');
          const turnTotalDiv = document.getElementById('turn-total');
          const errorMessageDiv = document.getElementById('error-message');
          const winnerModal = document.getElementById('winner-modal');
          const winnerNameSpan = document.getElementById('winner-name');
          const newGameButton = document.getElementById('new-game');

          let players = [];
          let currentPlayerIndex = 0;
          let currentTurnDarts = [];
          let selectedMultiplier = 1;
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
            resetTurn();
            renderScoreboard();
            saveGame();
          }

          function resetTurn() {
            currentTurnDarts = [];
            selectedMultiplier = 1;
            dartSegmentInput.value = '';
            specialScoreSelect.value = '';
            errorMessageDiv.classList.add('hidden');
            dartValueDisplay.classList.add('hidden');
            turnSummaryDiv.classList.add('hidden');
            updateDartCount();
            updateTurnInfo();
          }

          function updateDartCount() {
            dartCountDisplay.textContent = \`Dart \${currentTurnDarts.length + 1}\`;
          }

          function updateTurnInfo() {
            turnInfoDiv.textContent = \`\${players[currentPlayerIndex].name}'s Turn\`;
          }

          function calculateDartValue() {
            const specialScore = specialScoreSelect.value;
            if (specialScore) {
              return parseInt(specialScore);
            }
            const segment = parseInt(dartSegmentInput.value, 10);
            if (isNaN(segment) || segment < 1 || segment > 20) {
              return null;
            }
            return segment * selectedMultiplier;
          }

          // Multiplier button listeners
          document.getElementById('btn-single').addEventListener('click', function() {
            selectedMultiplier = 1;
            updateDartPreview();
          });
          document.getElementById('btn-double').addEventListener('click', function() {
            selectedMultiplier = 2;
            updateDartPreview();
          });
          document.getElementById('btn-treble').addEventListener('click', function() {
            selectedMultiplier = 3;
            updateDartPreview();
          });

          function updateDartPreview() {
            const value = calculateDartValue();
            if (value !== null) {
              dartValueText.textContent = value;
              dartValueDisplay.classList.remove('hidden');
            } else {
              dartValueDisplay.classList.add('hidden');
            }
          }

          dartSegmentInput.addEventListener('input', updateDartPreview);
          specialScoreSelect.addEventListener('change', updateDartPreview);

          confirmDartButton.addEventListener('click', () => {
            const value = calculateDartValue();
            if (value === null) {
              showError('Please enter a valid dart (segment 1-20 or special score)');
              return;
            }

            currentTurnDarts.push(value);
            errorMessageDiv.classList.add('hidden');

            if (currentTurnDarts.length < 3) {
              // More darts in this turn
              dartSegmentInput.value = '';
              specialScoreSelect.value = '';
              selectedMultiplier = 1;
              dartValueDisplay.classList.add('hidden');
              updateDartCount();
              updateTurnSummary();
            } else {
              // Turn is complete (3 darts thrown)
              finishTurnButton.click();
            }
          });

          function updateTurnSummary() {
            if (currentTurnDarts.length > 0) {
              turnSummaryDiv.classList.remove('hidden');
              turnDartsList.innerHTML = currentTurnDarts.map((dart, idx) => {
                return \`<div>Dart \${idx + 1}: \${dart} points</div>\`;
              }).join('');
              const turnTotal = currentTurnDarts.reduce((a, b) => a + b, 0);
              turnTotalDiv.textContent = \`Total: \${turnTotal} points\`;
            }
          }

          function showError(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.classList.remove('hidden');
          }

          finishTurnButton.addEventListener('click', () => {
            if (currentTurnDarts.length === 0) {
              showError('Throw at least one dart');
              return;
            }

            const turnTotal = currentTurnDarts.reduce((a, b) => a + b, 0);
            const player = players[currentPlayerIndex];
            const newScore = player.remaining - turnTotal;

            if (newScore < 0) {
              // Bust!
              player.busted = true;
              showError(\`BUST! \${player.name} overshot. Score remains \${player.remaining}.\`);
              turnSummaryDiv.classList.add('hidden');
            } else if (newScore === 0) {
              // Must check if last dart is a double (finish rule)
              const lastDart = currentTurnDarts[currentTurnDarts.length - 1];
              const isLastDartDouble = isFinishingDouble(lastDart);

              if (!isLastDartDouble) {
                showError('Must finish with a DOUBLE! Try again next turn.');
                resetTurn();
                nextTurn();
              } else {
                // Winner!
                player.remaining = 0;
                player.history.push(...currentTurnDarts);
                renderScoreboard();
                saveGame();
                declareWinner(player.name);
              }
            } else {
              // Valid turn, deduct points
              player.remaining = newScore;
              player.busted = false;
              player.history.push(...currentTurnDarts);
              renderScoreboard();
              saveGame();
              resetTurn();
              nextTurn();
            }
          });

          function isFinishingDouble(dartValue) {
            // A finishing double must be:
            // 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 (segment doubles: 1-20 × 2)
            // or 50 (double bullseye)
            const validDoubles = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 50];
            return validDoubles.includes(dartValue);
          }

          undoDartButton.addEventListener('click', () => {
            if (currentTurnDarts.length > 0) {
              currentTurnDarts.pop();
              dartSegmentInput.value = '';
              specialScoreSelect.value = '';
              selectedMultiplier = 1;
              dartValueDisplay.classList.add('hidden');
              errorMessageDiv.classList.add('hidden');
              updateDartCount();
              if (currentTurnDarts.length > 0) {
                updateTurnSummary();
              } else {
                turnSummaryDiv.classList.add('hidden');
              }
            }
          });

          function nextTurn() {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            resetTurn();
          }

          function declareWinner(playerName) {
            gameWon = true;
            gameDiv.style.display = 'none';
            winnerModal.classList.remove('hidden');
            winnerNameSpan.textContent = playerName;
          }

          newGameButton.addEventListener('click', () => {
            localStorage.removeItem('dartsGame');
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
                    resetTurn();
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
