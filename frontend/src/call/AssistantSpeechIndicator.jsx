const AssistantSpeechIndicator = ({ isSpeaking }) => {
    return (
      <div className="assistant-speech-editor">
        <div
          className={`speech-indicator ${
            isSpeaking ? "speaking" : "not-speaking"
          }`}
        ></div>
        <img src="/interview.png" alt="Description of image" />
        <p className="speech-status">
          {isSpeaking ? "Interviewer Speaking" : "Candidate Speaking"}
        </p>
      </div>
    );
  };
  
  export default AssistantSpeechIndicator