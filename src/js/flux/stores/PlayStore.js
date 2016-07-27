/*
 * PlayStore
 */

var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PlayConstants = require('./../constants/PlayConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/*
 *  data
 */
 var d = [
     {
         "id": 0,
         "name": "stars",
         "canvasId": "starZone",
         "text": "Smooth interactive system of stars."
     },
     {
         "id": 1,
         "name": "hubs",
         "canvasId": "hubWay",
         "text": "Set of hubs interconnected and moving."
     },
     {
         "id": 2,
         "name": "hexlife",
         "canvasId": "hexMap",
         "text": "Game of life on a hexagonal grid"
     },
     {
         "id": 3,
         "name": "gradients",
         "canvasId": "pixelMap",
         "text": "A continuous stream of gradients covering a canvas between random colors."
     }
 ];

 function setSizingSplit(){
    sizing = {
      width: ((window.innerWidth * (1.00 - (0.03 + 0.03 + 0.02)- (0.02 * ( d.length - 2)) )) / d.length),
      height: (window.innerHeight * 0.81)
    }
  };

 function setSizingFull() {
    sizing = {
      height: window.innerHeight,
      width: window.innerWidth
    }
  };

 var sizing = {
     width: ((window.innerWidth * (1.00 - (0.03 + 0.03 + 0.02)- (0.02 * ( d.length - 2)) )) / d.length),
     height: (window.innerHeight * 0.81)
 };

/**
 * index of focus
 * -1   -> no focus
 * else -> focused on index
 */
 var displayIndex = -1;

 /**
  * index of view
  * (I am using PlayConstants for multiple things, but i think the meaning is
  * is consistent and clear.)
  */
 var viewMode = PlayConstants.PLAY_SPLIT_SCREEN;


function setDisplayIndex(index) {
  displayIndex = index;
}

/**
 * TODO: double check this
 * Update a TODO item.
 * @param  {string} id
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  d[id] = assign({}, d[id], updates);
}

var PlayStore = assign({}, EventEmitter.prototype, {

  /**
   * get the correct display module
   * @return {object} the display module requested
   */


  /**
   *  gets the style name of the playView
   *  @return {string}
   */
  getPlayViewStyleName: function(index){

    return viewMode == PlayConstants.PLAY_SPLIT_SCREEN ? (index == 0 ? "playViewLeftEdge" :
                                                              index == 3 ? "playViewRightEdge" :
                                                                    "playView") : "playView";
  },

  /**
   * Get the details on the displays
   * @return {object}
   */
  getScriptInfo: function() {
    return d;
  },

  /**
   * Get the sizing info
   * @return {object}
   */
  getSizingInfo: function() {
    setSizingFull(); //please note that this is a hack to just get this experiment to work nicely!
    return sizing;
  },

  /**
   * Get the index of the script being focused on
   * @return {number}
   */
  getDisplayIndex: function() {
    return displayIndex;
  },

  /**
   * Get the view mode
   * @return {number}
   */
  getViewMode: function() {
    return viewMode;
  },

  setViewMode: function(m) {
    viewMode = m;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case PlayConstants.PLAY_FOCUS_INDEX:
      let id = action.id;
      if (id !== displayIndex){
        setDisplayIndex(id);
        PlayStore.emitChange();
      }
      break;
    case PlayConstants.PLAY_FULL_SCREEN:
      if (action.actionType !== viewMode){
        setDisplayIndex(action.id);
        setSizingFull();
        PlayStore.setViewMode(action.actionType);
        PlayStore.emitChange();
      }
      break;
    case PlayConstants.PLAY_SPLIT_SCREEN:
      if (action.actionType !== viewMode){
        setDisplayIndex(action.id);
        setSizingSplit();
        PlayStore.setViewMode(action.actionType);
        PlayStore.emitChange();
      }
      break;
    case PlayConstants.PLAY_CALCULATE_SIZE:
      if (viewMode !== PlayConstants.PLAY_FULL_SCREEN)
        setSizingSplit();
      else
        setSizingFull();
      PlayStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = PlayStore;
