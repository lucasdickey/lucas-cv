chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.url.includes('khanacademy.org')) {
      return;
    }
    if (details.url.includes(chrome.runtime.getURL('popup.html'))) {
      return;
    }
    chrome.storage.local.get('timerActive', (result) => {
      if (!result.timerActive) {
        chrome.storage.local.set({ blockedUrl: details.url }, () => {
          chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL('popup.html')
          });
        });
      }
    });
  },
  {
    url: [
      { hostContains: 'youtube.com' },
      { hostContains: 'youtubekids.com' }
    ]
  }
);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'youtubeTimer') {
    chrome.storage.local.set({ timerActive: false, blockedUrl: null }, () => {
      console.log('YouTube timer has expired.');
      chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('popup.html') });
        });
      });
      chrome.tabs.query({ url: "*://*.youtubekids.com/*" }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('popup.html') });
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "closePopupAndRedirect") {
        chrome.storage.local.get('blockedUrl', (result) => {
            if (result.blockedUrl) {
                chrome.tabs.update(sender.tab.id, { url: result.blockedUrl }, () => {
                    sendResponse({ status: "redirecting" });
                });
                chrome.storage.local.remove('blockedUrl');
            } else {
                // If no URL was blocked, redirect to the YouTube homepage.
                chrome.tabs.update(sender.tab.id, { url: 'https://www.youtube.com' }, () => {
                    sendResponse({ status: "redirecting_to_home" });
                });
            }
        });
        return true;
    }
});

// --- TIME LOGGING ---

// Create an alarm that fires every minute to log time spent on YouTube.
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('timeLogger', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timeLogger') {
    // Check if the timer is currently active (i.e., the user has answered questions)
    chrome.storage.local.get(['timerActive'], (result) => {
      if (result.timerActive) {
        // Find the currently active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            const activeTab = tabs[0];
            const isYouTube = activeTab.url && (activeTab.url.includes('youtube.com') || activeTab.url.includes('youtubekids.com'));

            // If the active tab is YouTube, increment the time spent
            if (isYouTube) {
              chrome.storage.local.get({ youtubeTimeSpent: 0 }, (data) => {
                const newTime = data.youtubeTimeSpent + 1; // Add 1 minute
                chrome.storage.local.set({ youtubeTimeSpent: newTime });
              });
            }
          }
        });
      }
    });
  }
});
