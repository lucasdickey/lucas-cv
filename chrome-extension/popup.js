document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reading-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();
    const q3 = document.getElementById('q3').value.trim();
    const q4 = document.getElementById('q4').value.trim();

    const answers = [q1, q2, q3, q4];

    // Validate that each answer contains at least one period, indicating a full sentence.
    const allValid = answers.every(answer => answer.includes('.'));

    if (!allValid) {
      errorMessage.textContent = 'Please answer each question with at least one full sentence.';
      return;
    }

    // Save the answers and timestamp to local storage.
    const newEntry = {
      timestamp: new Date().toISOString(),
      answers: {
        q1: q1,
        q2: q2,
        q3: q3,
        q4: q4
      }
    };

    chrome.storage.local.get({ entries: [] }, (result) => {
      const entries = result.entries;
      entries.push(newEntry);
      chrome.storage.local.set({ entries: entries }, () => {
        console.log('Answers saved successfully.');
      });
    });

    // Create a 30-minute alarm and set the timer active flag.
    chrome.alarms.create('youtubeTimer', { delayInMinutes: 30 });
    chrome.storage.local.set({ timerActive: true, timerSetAt: Date.now() }, () => {
        chrome.runtime.sendMessage({ action: "closePopupAndRedirect" }, (response) => {
            if (chrome.runtime.lastError) {
                // Handle potential errors (e.g., if the background script is not ready)
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log('Response from background:', response);
                window.close();
            }
        });
    });
  });
});
