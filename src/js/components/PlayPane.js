var React = require('react');

var PlayActions = require('./../flux/actions/PlayActions');
var PlayStore = require('./../flux/stores/PlayStore');
var PlayConstants = require('./../flux/constants/PlayConstants');
var Flow = require('./../displays/Flow');

var PlayPane = React.createClass({

  render: function() {
    var styleName = PlayStore.getPlayViewStyleName(2);//hack

    /**
     *  passing correct styleName to children, and
     *  classnames to to containing div.
     */
    var focus = this.props.focus ? " focused" : " unfocused";
    var playMode = this.props.focus ? PlayConstants.PLAY_PLAY_FAST : PlayConstants.PLAY_PLAY_SLOW;

    return (
      <div className={styleName}
           onMouseEnter={this._onMouseEnter}
           onMouseLeave={this._onMouseLeave}
           onDoubleClick={this._onDoubleClick}>
        <Flow    onScriptHover={this.props.onScriptHover}
                 id={this.props.id}
                 focus={focus}
                 height={this.props.sizing.height}
                 width={this.props.sizing.width}
                 playMode={playMode}
                 viewMode={this.props.viewMode}
                 play="true"/>
      </div>
    );
  },

  /**
   * call action to focus on this particular pane.
   */
  _onMouseEnter: function(){
    PlayActions.focusDisplayIndex(this.props.id);
  },
  /**
   * remove focus on leave for responsive feel
   */
  _onMouseLeave: function(){
    PlayActions.focusDisplayIndex(-1);
  },
  /**
   * go full view mode on this index. really the index
   * isn't needed, but whatever for now.
   */
  _onDoubleClick: function(){
    PlayActions.goFullViewMode(this.props.id);
  }
});

module.exports = PlayPane;
