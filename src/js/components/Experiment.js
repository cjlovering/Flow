var React = require('react');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayPane = require('./PlayPane');
var PlayConstants = require('./../flux/constants/PlayConstants');
var PlayActions = require('./../flux/actions/PlayActions');
var $ = require('jQuery');

//resize id kept track of
var resizeId;

/**
 * Retrieve the current data from the store
 * @return {object}
 */
function getPlayState() {
  return {
    scriptData: PlayStore.getScriptInfo(),
    sizing: PlayStore.getSizingInfo(),
    viewMode: PlayStore.getViewMode(),
    displayIndex: PlayStore.getDisplayIndex()
  };
}

/**
 * The PlayGround is the view-controller of the site, all changes in state
 * will propopgate from it, down.
 * TODO: worry about how transitions will look/work
 */
var Experiment = React.createClass({
  getInitialState: function() {
    return getPlayState();
  },
  /**
   * Event handler for 'change' events coming from the PlayStore
   */
   _onChange: function() {
     this.setState(getPlayState());
   },
   componentDidMount: function() {
     window.addEventListener('resize', this._eventListenerResize);
     PlayStore.addChangeListener(this._onChange);
   },
   componentWillUnmount: function() {
     PlayStore.removeChangeListener(this._onChange);
   },
   render: function() {
     console.log(this.state.sizing);
	    return ( <PlayPane
                focus={true}
                sizing={this.state.sizing}
                viewMode={this.state.viewMode}/> );
  },
  _eventListenerResize: function(){
    console.log("timeout");
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeAction, 250);
  },

  /**
   * go full view mode on this index. really the index
   * isn't needed, but whatever for now.
   */
  _onResizeAction: function(){
    console.log("resize action");
    PlayActions.goCalcuateSizes();
  }
});

module.exports = Experiment;
