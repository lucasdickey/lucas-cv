document.addEventListener('DOMContentLoaded', () => {
  const entriesContainer = document.getElementById('entries-container');
  const timeSpentContainer = document.getElementById('time-spent-container');

  // Fetch and display the total time spent on YouTube
  chrome.storage.local.get({ youtubeTimeSpent: 0 }, (data) => {
    const timeSpent = data.youtubeTimeSpent;
    const hours = Math.floor(timeSpent / 60);
    const minutes = timeSpent % 60;
    timeSpentContainer.innerHTML = `<h2>Total YouTube Time: ${hours}h ${minutes}m</h2>`;
  });

  chrome.storage.local.get({ entries: [] }, (result) => {
    const entries = result.entries;

    if (entries.length === 0) {
      entriesContainer.innerHTML = '<p>No reading history found.</p>';
      return;
    }

    // Display entries in reverse chronological order (most recent first)
    entries.reverse().forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'entry';

      const timestamp = new Date(entry.timestamp);
      const formattedDate = timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const q1 = entry.answers.q1.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const q2 = entry.answers.q2.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const q3 = entry.answers.q3.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const q4 = entry.answers.q4.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      entryDiv.innerHTML = `
        <h2>${formattedDate} at ${formattedTime}</h2>
        <p><strong>How long did you read?</strong><br>${q1}</p>
        <p><strong>What did you read?</strong><br>${q2}</p>
        <p><strong>Was there any key detail you think was important to the storyline?</strong><br>${q3}</p>
        <p><strong>Name one character and tell me one detail about them.</strong><br>${q4}</p>
      `;

      entriesContainer.appendChild(entryDiv);
    });
  });
});
