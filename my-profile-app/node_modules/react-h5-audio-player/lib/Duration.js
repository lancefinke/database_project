"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _utils = require("./utils");
class Duration extends _react.PureComponent {
  hasAddedAudioEventListener = false;
  constructor(props) {
    super(props);
    const {
      audio,
      timeFormat,
      defaultDuration
    } = props;
    this.state = {
      duration: audio ? (0, _utils.getDisplayTimeBySeconds)(audio.duration, audio.duration, timeFormat) : defaultDuration
    };
  }
  state = (() => ({
    duration: this.props.audio ? (0, _utils.getDisplayTimeBySeconds)(this.props.audio.duration, this.props.audio.duration, this.props.timeFormat) : this.props.defaultDuration
  }))();
  handleAudioDurationChange = e => {
    const audio = e.target;
    const {
      timeFormat,
      defaultDuration
    } = this.props;
    this.setState({
      duration: (0, _utils.getDisplayTimeBySeconds)(audio.duration, audio.duration, timeFormat) || defaultDuration
    });
  };
  addAudioEventListeners = () => {
    const {
      audio
    } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('durationchange', this.handleAudioDurationChange);
      audio.addEventListener('abort', this.handleAudioDurationChange);
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
      this.audio.removeEventListener('durationchange', this.handleAudioDurationChange);
      this.audio.removeEventListener('abort', this.handleAudioDurationChange);
    }
  }
  render() {
    return this.state.duration;
  }
}
var _default = exports.default = Duration;