import { PureComponent } from 'react';
import { getDisplayTimeBySeconds } from './utils';
class CurrentTime extends PureComponent {
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
      currentTime = getDisplayTimeBySeconds(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat);
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
      currentTime: getDisplayTimeBySeconds(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat) || defaultCurrentTime
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
export default CurrentTime;