// Replace this with an empty list eventually
let savedTab = 'google.com';

chrome.runtime.onInstalled.addListener(() => {
  // Save a defaultList
  chrome.storage.sync.set({ defaultList: [] });
  console.log(`Default list to empty`);
});
