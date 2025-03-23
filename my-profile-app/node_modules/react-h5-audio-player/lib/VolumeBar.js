"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _utils = require("./utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class VolumeControls extends _react.Component {
  hasAddedAudioEventListener = false;
  volumeBar = (() => (0, _react.createRef)())();
  volumeAnimationTimer = 0;
  lastVolume = this.props.volume;
  state = (() => ({
    currentVolumePos: `${(this.lastVolume / 1 * 100 || 0).toFixed(2)}%`,
    hasVolumeAnimation: false,
    isDraggingVolume: false
  }))();
  getCurrentVolume = event => {
    const {
      audio
    } = this.props;
    if (!this.volumeBar.current) {
      return {
        currentVolume: audio.volume,
        currentVolumePos: this.state.currentVolumePos
      };
    }
    const volumeBarRect = this.volumeBar.current.getBoundingClientRect();
    const maxRelativePos = volumeBarRect.width;
    const relativePos = (0, _utils.getPosX)(event) - volumeBarRect.left;
    let currentVolume;
    let currentVolumePos;
    if (relativePos < 0) {
      currentVolume = 0;
      currentVolumePos = '0%';
    } else if (relativePos > volumeBarRect.width) {
      currentVolume = 1;
      currentVolumePos = '100%';
    } else {
      currentVolume = relativePos / maxRelativePos;
      currentVolumePos = `${relativePos / maxRelativePos * 100}%`;
    }
    return {
      currentVolume,
      currentVolumePos
    };
  };
  handleContextMenu = event => {
    event.preventDefault();
  };
  handleClickVolumeButton = () => {
    const {
      audio
    } = this.props;
    if (audio.volume > 0) {
      this.lastVolume = audio.volume;
      audio.volume = 0;
    } else {
      audio.volume = this.lastVolume;
    }
  };
  handleVolumnControlMouseOrTouchDown = event => {
    event.stopPropagation();
    const {
      audio
    } = this.props;
    const {
      currentVolume,
      currentVolumePos
    } = this.getCurrentVolume(event.nativeEvent);
    audio.volume = currentVolume;
    this.setState({
      isDraggingVolume: true,
      currentVolumePos
    });
    if (event.nativeEvent instanceof MouseEvent) {
      window.addEventListener('mousemove', this.handleWindowMouseOrTouchMove);
      window.addEventListener('mouseup', this.handleWindowMouseOrTouchUp);
    } else {
      window.addEventListener('touchmove', this.handleWindowMouseOrTouchMove);
      window.addEventListener('touchend', this.handleWindowMouseOrTouchUp);
    }
  };
  handleWindowMouseOrTouchMove = event => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
    event.stopPropagation();
    const {
      audio
    } = this.props;
    const windowSelection = window.getSelection();
    if (windowSelection && windowSelection.type === 'Range') {
      windowSelection.empty();
    }
    const {
      isDraggingVolume
    } = this.state;
    if (isDraggingVolume) {
      const {
        currentVolume,
        currentVolumePos
      } = this.getCurrentVolume(event);
      audio.volume = currentVolume;
      this.setState({
        currentVolumePos
      });
    }
  };
  handleWindowMouseOrTouchUp = event => {
    event.stopPropagation();
    this.setState({
      isDraggingVolume: false
    });
    if (event instanceof MouseEvent) {
      window.removeEventListener('mousemove', this.handleWindowMouseOrTouchMove);
      window.removeEventListener('mouseup', this.handleWindowMouseOrTouchUp);
    } else {
      window.removeEventListener('touchmove', this.handleWindowMouseOrTouchMove);
      window.removeEventListener('touchend', this.handleWindowMouseOrTouchUp);
    }
  };
  handleAudioVolumeChange = e => {
    const {
      isDraggingVolume
    } = this.state;
    const {
      volume
    } = e.target;
    if (this.lastVolume > 0 && volume === 0 || this.lastVolume === 0 && volume > 0) {
      this.props.onMuteChange();
    }
    this.lastVolume = volume;
    if (isDraggingVolume) return;
    this.setState({
      hasVolumeAnimation: true,
      currentVolumePos: `${(volume / 1 * 100 || 0).toFixed(2)}%`
    });
    clearTimeout(this.volumeAnimationTimer);
    this.volumeAnimationTimer = setTimeout(() => {
      this.setState({
        hasVolumeAnimation: false
      });
    }, 100);
  };
  componentDidUpdate() {
    const {
      audio
    } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('volumechange', this.handleAudioVolumeChange);
    }
  }
  componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('volumechange', this.handleAudioVolumeChange);
    }
    clearTimeout(this.volumeAnimationTimer);
  }
  render() {
    const {
      audio,
      showFilledVolume,
      i18nVolumeControl
    } = this.props;
    const {
      currentVolumePos,
      hasVolumeAnimation
    } = this.state;
    const {
      volume
    } = audio || {};
    return _react.default.createElement("div", {
      ref: this.volumeBar,
      onMouseDown: this.handleVolumnControlMouseOrTouchDown,
      onTouchStart: this.handleVolumnControlMouseOrTouchDown,
      onContextMenu: this.handleContextMenu,
      role: "progressbar",
      "aria-label": i18nVolumeControl,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Number((volume * 100).toFixed(0)),
      tabIndex: 0,
      className: "rhap_volume-bar-area"
    }, _react.default.createElement("div", {
      className: "rhap_volume-bar"
    }, _react.default.createElement("div", {
      className: "rhap_volume-indicator",
      style: {
        left: currentVolumePos,
        transitionDuration: hasVolumeAnimation ? '.1s' : '0s'
      }
    }), showFilledVolume && _react.default.createElement("div", {
      className: "rhap_volume-filled",
      style: {
        width: currentVolumePos
      }
    })));
  }
}
var _default = exports.default = VolumeControls;