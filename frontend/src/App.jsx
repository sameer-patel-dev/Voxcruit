import { useState, useEffect } from "react";
import { vapi, startAssistant, stopAssistant } from "./ai";
import ActiveCallDetails from "./call/ActiveCallDetails";

function App() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callId, setCallId] = useState("");
  const [callResult, setCallResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [roleApplied, setroleApplied] = useState("");

  useEffect(() => {
    vapi
      .on("call-start", () => {
        setLoading(false);
        setStarted(true);
      })
      .on("call-end", () => {
        setStarted(false);
        setLoading(false);
      })
      .on("speech-start", () => {
        setAssistantIsSpeaking(true);
      })
      .on("speech-end", () => {
        setAssistantIsSpeaking(false);
      })
      .on("volume-level", (level) => {
        setVolumeLevel(level);
      });
  }, []);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleStart = async () => {
    setLoading(true);
    const data = await startAssistant(firstName, lastName, email, phoneNumber, roleApplied);
    setCallId(data.id);
  };

  const handleStop = () => {
    stopAssistant();
    getCallDetails();
  };

  const getCallDetails = (interval = 3000) => {
    setLoadingResult(true);
    fetch("/call-details?call_id=" + callId)
      .then((response) => response.json())
      .then((data) => {
        if (data.analysis && data.summary) {
          console.log(data);
          setCallResult(data);
          setLoadingResult(false);
        } else {
          setTimeout(() => getCallDetails(interval), interval);
        }
      })
      .catch((error) => alert(error));
  };

  const showForm = !loading && !started && !loadingResult && !callResult;
  const allFieldsFilled = firstName && lastName && email && phoneNumber && roleApplied;

  return (
    <div className="app-container">
      {showForm && (
        <>
          <img src="/employnxt_logo.jpg" alt="Description of image" />
          <h1>EmployNXT AI Interviewer</h1>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            className="input-field"
            onChange={handleInputChange(setFirstName)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            className="input-field"
            onChange={handleInputChange(setLastName)}
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            className="input-field"
            onChange={handleInputChange(setEmail)}
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            className="input-field"
            onChange={handleInputChange(setPhoneNumber)}
          />
          <input
            type="text"
            placeholder="Role"
            value={roleApplied}
            className="input-field"
            onChange={handleInputChange(setroleApplied)}
          />
          {!started && (
            <button
              onClick={handleStart}
              disabled={!allFieldsFilled}
              className="button"
            >
              Start Interview
            </button>
          )}
        </>
      )}
      {loadingResult && <p>Creating your interview assesment report... please wait</p>}
      {!loadingResult && callResult && (
        <>
        <img src="/employnxt_logo.jpg" alt="Description of image" />
        <div className="call-result">
          <p>Candidate Name: {callResult.analysis.structuredData.candidateName}</p>
          <p>Role Applied For: {callResult.analysis.structuredData.roleAppliedFor}</p>
          <p>Education: {callResult.analysis.structuredData.education}</p>
          <p>Professional Experience: {callResult.analysis.structuredData.professionalExperience}</p>
          <br />
          <p>Meets Technical Criteria: {callResult.analysis.structuredData.meetsTechnicalCriteria}</p>
          <p>Meets Behavioral Criteria: {callResult.analysis.structuredData.meetsBehavioralCriteria}</p>
          <p>Final Assessment: {callResult.analysis.structuredData.finalAssessment}</p>
          <p>Comments: {callResult.analysis.structuredData.comments}</p>
        </div>
        </>
      )}
      {(loading || loadingResult) && <div className="loading"></div>}
      {started && (
        <ActiveCallDetails
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          endCallCallback={handleStop}
        />
      )}
    </div>
  );
}

export default App; 