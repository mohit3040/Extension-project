let currentTabId = null;
let currentDomain = null;
let startTime = null;

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

function saveTime(domain, timeSpent) {
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
  const key = `${domain}_${today}`;

  chrome.storage.local.get([key], (result) => {
    const previousTime = result[key] || 0;
    chrome.storage.local.set({ [key]: previousTime + timeSpent });
  });
}

function handleTabChange(tabId, url) {
  const domain = getDomain(url);
  const now = Date.now();

  if (currentDomain && startTime) {
    const timeSpent = now - startTime;
    saveTime(currentDomain, timeSpent);
  }

  currentTabId = tabId;
  currentDomain = domain;
  startTime = now;
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) {
      handleTabChange(tabId, tab.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete' && tab.url) {
    handleTabChange(tabId, tab.url);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  const now = Date.now();
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (currentDomain && startTime) {
      const timeSpent = now - startTime;
      saveTime(currentDomain, timeSpent);
    }
    currentTabId = null;
    currentDomain = null;
    startTime = null;
  } else {
    chrome.windows.get(windowId, { populate: true }, (window) => {
      const activeTab = window.tabs?.find(tab => tab.active);
      if (activeTab?.url) {
        handleTabChange(activeTab.id, activeTab.url);
      }
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  currentTabId = null;
  currentDomain = null;
  startTime = null;
});

chrome.runtime.onSuspend.addListener(() => {
  if (currentDomain && startTime) {
    const timeSpent = Date.now() - startTime;
    saveTime(currentDomain, timeSpent);
  }
});
