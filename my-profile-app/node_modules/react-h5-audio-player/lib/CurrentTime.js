"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _utils = require("./utils");
class CurrentTime extends _react.PureComponent {
  hasAddedAudioEventListener = false;
  constructor(props) {
    super(props);
    const {
      audio,
      defaultCurrentTime,
      isLeftTime,
      timeFormat
    } = props;
    let currentTime = defaultCurrentTime;
    if (audio) {
      currentTime = (0, _utils.getDisplayTimeBySeconds)(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat);
    }
    this.state = {
      currentTime
    };
  }
  state = {
    currentTime: this.props.defaultCurrentTime
  };
  handleAudioCurrentTimeChange = e => {
    const audio = e.target;
    const {
      isLeftTime,
      timeFormat,
      defaultCurrentTime
    } = this.props;
    this.setState({
      currentTime: (0, _utils.getDisplayTimeBySeconds)(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat) || defaultCurrentTime
    });
  };
  addAudioEventListeners = () => {
    const {
      audio
    } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('timeupdate', this.handleAudioCurrentTimeChange);
      audio.addEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
    }
  };
  componentDidMount() {
    this.addAudioEventListeners();
  }
  componentDidUpdate() {
    this.addAudioEventListeners();
  }
  componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('timeupdate', this.handleAudioCurrentTimeChange);
      this.audio.removeEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
    }
  }
  render() {
    return this.state.currentTime;
  }
}
var _default = exports.default = CurrentTime;