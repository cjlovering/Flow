
var AppDispatcher = require('./../dispatcher/AppDispatcher');
var PlayConstants = require('./../constants/PlayConstants');

var PlayActions = {
  /**
   * @param  {number} index
   */
  focusDisplayIndex: function(index) {
    AppDispatcher.dispatch({
      actionType: PlayConstants.PLAY_FOCUS_INDEX,
      id: index
    });
  },
  /**
   * @param  {number} index
   */
  goFullViewMode: function(index) {
    AppDispatcher.dispatch({
      actionType: PlayConstants.PLAY_FULL_SCREEN,
      id: index
    });
  },
  /**
   * @param  {number} index
   */
  goSplitViewMode: function(index) {
    AppDispatcher.dispatch({
      actionType: PlayConstants.PLAY_SPLIT_SCREEN,
      id: index
    });
  },
  /**
   * do it!
   */
   goCalcuateSizes: function() {
     AppDispatcher.dispatch({
      actionType: PlayConstants.PLAY_CALCULATE_SIZE
    });
   }
};

module.exports = PlayActions;
