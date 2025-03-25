import { PureComponent } from 'react';
import { getDisplayTimeBySeconds } from './utils';
class Duration extends PureComponent {
  hasAddedAudioEventListener = false;
  constructor(props) {
    super(props);
    const {
      audio,
      timeFormat,
      defaultDuration
    } = props;
    this.state = {
      duration: audio ? getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat) : defaultDuration
    };
  }
  state = (() => ({
    duration: this.props.audio ? getDisplayTimeBySeconds(this.props.audio.duration, this.props.audio.duration, this.props.timeFormat) : this.props.defaultDuration
  }))();
  handleAudioDurationChange = e => {
    const audio = e.target;
    const {
      timeFormat,
      defaultDuration
    } = this.props;
    this.setState({
      duration: getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat) || defaultDuration
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
export default Duration;