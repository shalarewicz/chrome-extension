chrome.runtime.onInstalled.addListener(() => {
  // Initialize the hoard in storage to an empty list
  chrome.storage.sync.set({
    lists: {
      hoard: [],
    }
  });
});
