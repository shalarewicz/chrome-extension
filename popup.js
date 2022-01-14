/**
 * Gets data about thecurrent tab
 * @returns Promise
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * Gets all open tabs from chrome
 * 
 * @returns Promise
 */
async function getAllTabs() {
  // get all tabs by passing in no query params
  return await chrome.tabs.query({});
}

function showAllTabs() {
  // Display the current tabs in our all tabs list
  getAllTabs().then((result) => {
    // result is an array of 'tab' objects
    const tabList = new TabList(result, 'All');

    // render the tablist
    document.querySelector('body').prepend(tabList.getNode());

  });
}


/**
 * Saves the current tab to the provided list in storage
 * @param {????} tab 
 * @param {String} listName 
 */
function saveTabToStorage(listName = 'hoard') {
  // The body of this function will be executed as a content script inside the
  // current page

  // Get data about the current tab
  getCurrentTab().then(tab => {
    // get the specified list from storage
    chrome.storage.sync.get([listName], function (result) {
      // console.log(`saving ${tab.url} to ${listName}`)
      const newList = result[listName];

      tabToSave = {
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        id: newList.length,
      }
      newList.push(tabToSave);

      const newObj = {};
      newObj[listName] = newList

      chrome.storage.sync.set(newObj);
    });

  })
}


function showHoard() {
  // get the hoard list from storage
  chrome.storage.sync.get('hoard', (result) => {

    // Create a new tab list
    const hoardList = new TabList(result['hoard'], 'Hoard');
    hoardList.getNode().className = 'hoard';

    // Remove the cuurentlist from the DOM
    document.querySelector('#current-list').remove();

    // render the hoard list
    document.querySelector('body').prepend(hoardList.getNode());
  });
}


// Populate the popup with all tabs
showAllTabs();


// add an event listener to the 'hoard' buttons
const hoardButton = document.querySelector("#hoard");


// Add an event listener to save 'youtube.com' to storage
hoardButton.addEventListener('click', (event) => {
  saveTabToStorage('hoard');

  // If we're currently viewing the hoard list. Re-render the hoard list
  if (document.querySelector('.hoard')) {
    console.log('re-render hoard');
    showHoard();
  }
});


const showHoardButton = document.querySelector('#getHoard');

showHoardButton.addEventListener('click', (event) => {
  showHoard();
});
