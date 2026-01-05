'use client';

import { useState, useEffect } from 'react';

interface Player {
  name: string;
  remaining: number;
  history: number[];
  busted: boolean;
}

export default function DartmathsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [showNameInputs, setShowNameInputs] = useState(false);
  const [scoreInput, setScoreInput] = useState('');
  const [isFinishingDouble, setIsFinishingDouble] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const STARTING_SCORE = 501;

  // Load game from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('darts501Game');
    if (savedGame) {
      try {
        const data = JSON.parse(savedGame);
        setPlayers(data.players);
        setCurrentPlayerIndex(data.currentPlayerIndex);
        setGameStarted(true);
        if (data.gameWon) {
          setGameWon(true);
          const winner = data.players.find((p: Player) => p.remaining === 0);
          setWinnerName(winner?.name || 'Unknown');
        }
      } catch (e) {
        console.error('Failed to load game:', e);
      }
    }
  }, []);

  const handleStartGame = () => {
    if (numPlayers > 0 && numPlayers <= 10) {
      setPlayerNames(Array(numPlayers).fill(''));
      setShowNameInputs(true);
    } else {
      alert('Please enter a number of players between 1 and 10.');
    }
  };

  const handleConfirmPlayers = () => {
    const newPlayers: Player[] = playerNames.map((name, i) => ({
      name: name || `Player ${i + 1}`,
      remaining: STARTING_SCORE,
      history: [],
      busted: false,
    }));
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setGameStarted(true);
    setShowNameInputs(false);
    setGameWon(false);
    saveGame(newPlayers, 0, false);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const handleSubmitScore = () => {
    const score = parseInt(scoreInput, 10);
    if (isNaN(score) || score < 0) {
      setErrorMessage('Please enter a valid score (0 or higher)');
      return;
    }

    const updatedPlayers = [...players];
    const player = updatedPlayers[currentPlayerIndex];
    const newScore = player.remaining - score;

    // Bust check
    if (newScore < 0) {
      player.busted = true;
      setErrorMessage(
        `BUST! ${player.name} overshot by ${Math.abs(newScore)} points. Score remains ${player.remaining}. Next turn!`
      );
      setPlayers(updatedPlayers);
      setTimeout(() => {
        handleNextTurn(updatedPlayers);
      }, 2000);
      return;
    }

    // Exactly 0 - check finish rule
    if (newScore === 0) {
      if (!isFinishingDouble) {
        setErrorMessage(
          'To win, your final dart must be a DOUBLE. Mark the checkbox if this round includes a finishing double.'
        );
        return;
      }
      // Winner!
      player.remaining = 0;
      player.history.push(score);
      setPlayers(updatedPlayers);
      setGameWon(true);
      setWinnerName(player.name);
      saveGame(updatedPlayers, currentPlayerIndex, true);
      return;
    }

    // Valid turn
    player.remaining = newScore;
    player.busted = false;
    player.history.push(score);
    setPlayers(updatedPlayers);
    saveGame(updatedPlayers, currentPlayerIndex, false);
    resetForm();
    handleNextTurn(updatedPlayers);
  };

  const handleNextTurn = (updatedPlayers: Player[]) => {
    const nextIndex = (currentPlayerIndex + 1) % updatedPlayers.length;
    setCurrentPlayerIndex(nextIndex);
    resetForm();
  };

  const resetForm = () => {
    setScoreInput('');
    setIsFinishingDouble(false);
    setErrorMessage('');
  };

  const saveGame = (playersToSave: Player[], playerIndex: number, won: boolean) => {
    localStorage.setItem(
      'darts501Game',
      JSON.stringify({
        players: playersToSave,
        currentPlayerIndex: playerIndex,
        gameWon: won,
      })
    );
  };

  const handleNewGame = () => {
    localStorage.removeItem('darts501Game');
    setPlayers([]);
    setGameStarted(false);
    setGameWon(false);
    setShowNameInputs(false);
    setNumPlayers(2);
    setPlayerNames([]);
    setScoreInput('');
    setIsFinishingDouble(false);
    setErrorMessage('');
  };

  if (gameWon) {
    return (
      <div style={styles.container}>
        <style>{cssStyles}</style>
        <div id="app" style={styles.app}>
          <div style={styles.winnerModal}>
            <h2>🎉 {winnerName} Wins!</h2>
            <button onClick={handleNewGame} style={styles.button}>
              Start New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div style={styles.container}>
        <style>{cssStyles}</style>
        <div id="app" style={styles.app}>
          <h1>501 Darts</h1>
          <div style={styles.setup}>
            <h2>Setup Game</h2>
            <div>
              <label htmlFor="num-players">Number of Players:</label>
              <input
                type="number"
                id="num-players"
                min="1"
                max="10"
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value, 10))}
                style={styles.input}
              />
            </div>
            <button onClick={handleStartGame} style={styles.button}>
              Start Game
            </button>

            {showNameInputs && (
              <>
                <div style={styles.playerNames}>
                  {playerNames.map((name, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Player ${i + 1} Name`}
                      value={name}
                      onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                      style={styles.input}
                    />
                  ))}
                </div>
                <button onClick={handleConfirmPlayers} style={styles.button}>
                  Confirm Players
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{cssStyles}</style>
      <div id="app" style={styles.app}>
        <h1>501 Darts</h1>
        <div style={styles.turnInfo}>
          {players[currentPlayerIndex]?.name}'s Turn - Remaining:{' '}
          {players[currentPlayerIndex]?.remaining}
        </div>

        <h2>Scoreboard</h2>
        <div style={styles.scoreboard}>
          {players.map((player, index) => (
            <div key={index} style={styles.playerScore}>
              <span style={styles.playerName}>
                {player.name}
                {player.busted ? ' (BUST)' : ''}
              </span>
              <span
                style={{
                  ...styles.playerRemaining,
                  ...(index === currentPlayerIndex ? styles.playerRemaining.active : {}),
                  ...(player.busted ? styles.playerRemaining.bust : {}),
                  ...(player.remaining === 0 ? styles.playerRemaining.winner : {}),
                }}
              >
                {player.remaining}
              </span>
            </div>
          ))}
        </div>

        <div style={styles.dartEntry}>
          <label htmlFor="score-input">Enter your score for this round:</label>
          <input
            type="number"
            id="score-input"
            min="0"
            placeholder="Score"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            style={styles.input}
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isFinishingDouble}
              onChange={(e) => setIsFinishingDouble(e.target.checked)}
            />
            This is a finishing double
          </label>

          <button onClick={handleSubmitScore} style={styles.button}>
            Submit Score
          </button>

          {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

const cssStyles = `
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

  h1, h2 {
    text-align: center;
    color: #1c1e21;
  }

  h1 {
    margin-top: 0;
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
`;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  app: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  setup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  playerNames: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  turnInfo: {
    backgroundColor: '#e7f3ff',
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center' as const,
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  scoreboard: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
  },
  playerScore: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    fontSize: '16px',
  },
  playerName: {
    fontWeight: 'bold',
    flex: 1,
  },
  playerRemaining: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#007bff',
    minWidth: '80px',
    textAlign: 'right' as const,
    active: {
      backgroundColor: '#e7f3ff',
      padding: '5px 10px',
      borderRadius: '4px',
    },
    bust: {
      color: '#dc3545',
    },
    winner: {
      color: '#28a745',
      fontSize: '24px',
    },
  } as any,
  dartEntry: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'normal' as const,
    cursor: 'pointer',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '10px',
    textAlign: 'center' as const,
  },
  winnerModal: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
};
