class Tab {
  /**
   * 
   * @param {chrome.tabs.Tab} tab 
   */
  constructor(tab) {
    // Get Ids
    this.id = tab.id;
    this.windowId = tab.windowId;

    // Get tab metadata
    this.title = tab.title;
    this.icon = tab.favIconUrl;
    this.active = tab.active;
    this.chromeGroup = tab.groupId;

    // Get audio data
    this.audible = tab.audible;
    this.muted = tab.mutedInfo.muted;

    // track custom groups
    this.customGroups = [];

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
    favicon.src = this.icon;

    parent.appendChild(favicon);

    // add text container
    const text = document.createElement('div');
    text.classList.add('tab-title')
    text.innerText = this.title;
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

    closeTab.addEventListener('click', (event) => {
      this.close();
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


    // Close the tab in the browser
    chrome.tabs.remove(this.id);
  }
}