document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-questions');
  const reviewButton = document.getElementById('review-history');

  startButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
    window.close();
  });

  reviewButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('review.html') });
    window.close();
  });
});
