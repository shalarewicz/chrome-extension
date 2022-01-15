class TabList {
  /**
   * 
   * @param {String} name unique name for the tab list
   * @param { Array<chrome.tab.Tab> } tabs tabs to be added to the list
   */
  constructor(tabs, name = 'hoard') {
    this.name = name;

    this.tabList = tabs.map((tab) => {
      // create a new Tab from the provided tab info
      return new Tab(tab);
    })

    this.sortByAlphabetical();
    this.sortByAudible();

    this.node = this._render();

    this.tabList.forEach(tab => {
      this.listContainer.appendChild(tab.getNode());
    })
  }

  _render() {
    const parent = document.createElement('div');
    parent.id = 'current-list';

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

  /**
   * stable sort for audible tabs followed by muted followed by inaudible
   */
  sortByAudible() {
    const audible = [];
    const muted = [];
    const rest = [];

    this.tabList.forEach(tab => {
      if (tab.audible) {
        if (tab.muted) {
          muted.push(tab);
        } else {
          audible.push(tab);
        }
      } else {
        rest.push(tab);
      }
    });

    this.tabList = [...audible, ...muted, ...rest];
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