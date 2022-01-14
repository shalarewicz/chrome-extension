let saveTabButton = document.querySelector("#saveTab");
showList('defaultList');


// let allTabs = await getAllTabs().then((result) => {
//   console.log(result);
//   let tabList = [];

//   // result is an array of 'tab' objects

//   // for (let prop in result) {
//   //   if (prop === "title") {
//   //     tabList.push(result[prop])
//   //   }
//   // }
//   result.forEach((tab) => {
//     // get the title and put it in our tab list
//     tabList.push(tab.title);
//   });

//   console.log(tabList);
//   allTabs = tabList;
// });

// console.log(allTabs);




// Add an event listener to save 'youtube.com' to storage
saveTabButton.addEventListener('click', async () => {
  // console.log('click');
  saveTabToStorage('google.com');

  // Add the item to the UI
  addItemToUI('defaultList', 'google.com');

});


// The body of this function will be executed as a content script inside the
// current page
function saveTabToStorage(tab) {

  chrome.storage.sync.get(['defaultList'], function (result) {
    console.log(`saving ${tab}`)
    // console.log(`Got result is ` + result.defaultList)

    defaultList = result.defaultList;
    // console.log(`before: ${defaultList}`)
    defaultList.push(tab);
    // console.log(`after: ${defaultList}`)

    chrome.storage.sync.set({ defaultList: defaultList }, function () {
      console.log(`updated list ${defaultList}`)
    });
  });



}

/**
 * Adds the provided item to the lst with the provided id. 
 * @param {String} lstId id of html list element
 * @param {String} item item we're ading
 */
function addItemToUI(lstId, item) {
  // get the specified from the DOM
  const lister = document.querySelector(`#${lstId}`);
  const newLister = document.createElement("li");
  newLister.innerText = item;

  lister.appendChild(newLister);


}

function showList(lst) {
  // Get the defaultList from storage
  chrome.storage.sync.get([lst], function (result) {
    const myList = result[lst];

    // Render the list as a <ul>
    const parent = document.createElement('ul');
    parent.id = lst;

    myList.forEach(element => {
      const listItem = document.createElement('li');
      listItem.innerText = element;
      parent.appendChild(listItem);
    });

    document.querySelector('body').prepend(parent);

  });

}


async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// console.log(getCurrentTab());

async function getAllTabs() {
  // get all tabs by passing in no query params
  return chrome.tabs.query({}, (result) => {
    let tabList = [];

    // result is an array of 'tab' objects

    result.forEach((tab) => {
      // get the title and put it in our tab list
      // TODO sort this alphabetically
      addItemToUI('defaultList', tab.title);

    });

    console.log(tabList);
    allTabs = tabList;
    return tabList;
  });
}

console.log(getAllTabs());

let allTabs = getAllTabs();
