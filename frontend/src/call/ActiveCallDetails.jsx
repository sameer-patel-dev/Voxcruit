import AssistantSpeechIndicator from "./AssistantSpeechIndicator";
import VolumeLevel from "./VolumeLevel";

const ActiveCallDetails = ({
  assistantIsSpeaking,
  volumeLevel,
  endCallCallback,
}) => {
  return (
    <div className="active-call-detail">
      <img src="/employnxt_logo.jpg" alt="Description of image" />
      <br />
      <br />
      <div className="call-info">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
      </div>
      <div className="end-call-button">
        <button onClick={endCallCallback}>End Call</button>
      </div>
    </div>
  );
};

export default ActiveCallDetails