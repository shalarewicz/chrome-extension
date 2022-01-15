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

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function showAllTabs() {
  // Display the current tabs in our all tabs list
  getAllTabs().then((result) => {
    // result is an array of 'tab' objects
    const tabList = new TabList(result, 'All');

    // render the tablist
    insertAfter(tabList.getNode(), document.querySelector('#list-options'));

  });
}


/**
 * Saves the current tab to the provided list in storage
 * @param {????} tab 
 * @param {String} listName 
 */
function saveTabToStorage(listName = 'hoard', show = false) {
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

      // show the hoard
      if (show && document.querySelector('#list-selector')) {
        showList('hoard');
      }
    });

  })
}


function showList(listName) {
  // get the hoard list from storage
  chrome.storage.sync.get(listName, (result) => {

    // Create a new tab list
    const curList = new TabList(result[listName], listName);
    // hoardList.getNode().className = 'hoard';

    // Remove the cuurentlist from the DOM
    document.querySelector('#current-list').remove();

    // render the hoard list
    insertAfter(curList.getNode(), document.querySelector('#list-options'));
  });
}

function showListNames() {
  // get all list names from storage and group names for all active tabs
  chrome.storage.sync.get().then(result => {
    // iterate through each list in storage
    console.log(result);
    const parent = document.querySelector('#list-options');

    for (const lst in result) {
      const title = document.createElement('div');
      title.classList.add('list-option', 'selection');
      title.innerText = lst;
      title.id = lst;

      // add event listener to each list option to change the current list
      title.addEventListener('click', (e) => {
        // id is the name of the lst in storage
        showList(lst);

        // hide the selection menu
        parent.style.display = 'none';

        // update the name of the list in the UI
        document.querySelector('#list-selector').innerText = lst;
      })

      parent.appendChild(title);
    }
  })
}

showListNames();

// add event listener for 'All Tabs' option
document.querySelector('#all').addEventListener('click', (e) => {
  // remove the current list
  document.querySelector('#current-list').remove();

  // id is the name of the lst in storage
  showAllTabs();

  // hide the selection menu
  document.querySelector('#list-options').style.display = 'none';

  // update the name of the list in the UI
  document.querySelector('#list-selector').innerText = 'All Tabs';
})

// Populate the popup with all tabs
showAllTabs();

// Add event listener to open and collapse list selecor
document.querySelector('#list-selector').addEventListener('click', (e) => {
  // get content div
  const content = document.querySelector('#list-options');

  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }

})

// add an event listener to the 'hoard' buttons
const hoardButton = document.querySelector("#hoardBtn");


// Add an event listener to save 'youtube.com' to storage
hoardButton.addEventListener('click', (event) => {
  saveTabToStorage('hoard', true);
});


const showHoardButton = document.querySelector('#hoardBtn');

showHoardButton.addEventListener('click', (event) => {
  showList('hoard');
});
