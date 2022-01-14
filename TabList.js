class TabList {
  /**
   * 
   * @param {String} name unique name for the tab list
   * @param { Array<chrome.tab.Tab> } tabs tabs to be added to the list
   */
  constructor(tabs, name = 'default') {
    this.name = name;
    this.node = this._render();

    // TODO process the tabs
    this.tabList = tabs.map((tab) => {
      // create a new Tab fromthe provided tab
      return new Tab(tab);
    })

    this.sortByAlphabetical();

    this.tabList.forEach(tab => {
      this.listContainer.appendChild(tab.getNode());
    })


  }

  _render() {
    const parent = document.createElement('div');
    parent.id = this.name; // ensure id's are one word

    const title = document.createElement('div');
    title.classList.add('list-title');
    title.innerText = this.name;
    parent.appendChild(title);

    this.listContainer = document.createElement('div');
    this.listContainer.classList.add('tab-list');
    parent.appendChild(this.listContainer);

    return parent;

  }

  getNode() {
    return this.node;
  }

  /**
   * Adds the specified Tab to the list
   * @param {Tab | chrome.storage.Tab ????} tab 
   */
  addToList(tab) {

  }

  /**
   * Removes specified tab from the list
   * @param {Number} tabId 
   */
  removeFromList(tabId) {

  }

  /**
   * Sort types
   *  alphabetical
   *  audible
   *  most recen
   */
  sortByAlphabetical() {
    this.tabList.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    })
  }

  sortByAudible() {

  }

  sortByRecent() {

  }

  /**
   * Closes all tabs in this list
   */
  closeAllTabs() {

  }

  /**
   * Removes this list. Does not close tabs
   */
  removeList() {

  }


}