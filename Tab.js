class Tab {
  /**
   * 
   * @param {chrome.tabs.Tab} tab 
   */
  constructor(tab) {
    // Get Ids
    this.id = tab.id;
    this.windowId = tab.windowId || -1;

    // Get tab metadata
    this.title = tab.title;
    this.icon = tab.favIconUrl;
    this.active = tab.active || false;
    this.chromeGroup = tab.groupId || -1;
    this.url = tab.url;

    // Get audio data
    this.audible = tab.audible || false
    this.muted = tab.mutedInfo ? tab.mutedInfo.muted : false

    // track custom groups
    this.customGroups = tab.customGroups || [];

    this.node = this._render();
  }

  _render() {
    // renders the tab as a list item
    const parent = document.createElement('div');
    parent.classList.add('tab');
    parent.id = `tab-${this.id}`;



    // add favicon
    const favicon = document.createElement('img');
    favicon.classList.add('favicon');
    favicon.src = this.icon || './images/acorn_silver.png';

    parent.appendChild(favicon);

    // add text container
    const text = document.createElement('div');
    text.classList.add('tab-title')
    text.innerText = this.title;

    // Add event listener to open the selected tab if clicked
    text.addEventListener('click', (event) => {

      // Try to updat the active window to the provided tab id. 
      chrome.tabs.update(this.id, { active: true }).then(result => {
        // update the focussed winow
        chrome.windows.update(this.windowId, { focused: true });
      }).catch((error) => {
        // Tab wasn't found open in a new tab.
        chrome.tabs.create({ url: this.url });
      });

    })


    parent.appendChild(text)

    // Add volume image container
    const image = document.createElement('div');
    image.classList.add('icon');
    // Give image a unique id 'sound-icon-123'
    image.id = `sound-icon-${this.id}`

    // Add event listener to sound-icon container
    image.addEventListener('click', (event) => {
      this.toggleAudio();

    })

    // Add the appropriate audible class
    if (this.audible) {
      if (this.muted) {
        // set class to muted
        image.classList.add('muted');
      } else {
        // set class to audible
        image.classList.add('audible');
      }
    }

    parent.appendChild(image);
    // add close tab icon

    const closeTab = document.createElement('svg');
    closeTab.classList.add('icon', 'close');
    // closeTab.src = './images/x-circle.svg';

    closeTab.addEventListener('click', (event) => {
      this.close();

      // prevent any other click events from ocurring 
      // stops tab from opening also
      event.stopPropagation();
    });

    parent.appendChild(closeTab);


    // Add event listener to spearker to mute/unmute

    // Add favicon on left hand side

    return parent;
  }

  getNode() {
    return this.node;
  }


  toggleAudio() {
    // if tab isn't making sound return early
    if (!this.audible) {
      return;
    }
    // toggle mute
    this.muted = !this.muted;

    // Get image element by it's id from the DOM

    const image = document.querySelector(`#sound-icon-${this.id}`)


    // update class name on sound icon
    if (this.muted) {
      // set class to muted
      image.classList.add('muted');
      image.classList.remove('audible')
    } else {
      // set class to audible
      image.classList.add('audible');
      image.classList.remove('muted')
    }

    // call tabs api to mute the tab
    chrome.tabs.update(this.id, { "muted": this.muted });
  }

  /**
   * Set this tab as the active tab in the browser
   */
  setActive() {
    // Call chrome.tabs api
  }

  /**
   * Adds tab to the specified group
   * 
   * @param {Number} groupId 
   */
  addToGroup(groupId) {
    this.customGroups.push(groupId);
  }

  /**
   * 
   * @param {*} goupId 
   */
  removeFromGroup(goupId) {

  }

  /**
   * Adds current tab info to storage for later reference
   */
  addToHoard() {

  }

  /**
   * Closes this tab in thebrowser. 
   */
  close() {
    // Remmove from the DOM if it exists 
    document.querySelector(`#tab-${this.id}`).remove();

    // get the current list name
    let currentList = document.querySelector('#list-selector').innerText.toLowerCase();


    if (currentList === 'all') {
      // Close the tab in the browser
      chrome.tabs.remove(this.id).then(
        console.log('Closed tab!')
      ).catch(
        console.log('Tab no longer open')
      );
    } else {
      // Otherwise Remove the tab from storage
      chrome.storage.sync.get(currentList, (result) => {
        const cur = result[currentList];

        // iterate through the list to find the index of the object to be removed
        let i = 0;
        while (i < cur.length && cur[i].title !== this.title) {
          i++;
        }

        cur.splice(i, 1);
        // update storage with the new list

        const newObj = {};
        newObj[currentList] = cur;

        chrome.storage.sync.set(newObj);
      })
    }
  }
}
