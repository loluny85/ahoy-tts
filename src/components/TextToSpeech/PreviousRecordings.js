import React from 'react';
import { Underline, AudioText } from "./styles.js"

const PreviousRecordings = ({ historyAudioUrlKeys }) => (
  <div className="mt-64">
    <h3>Previous Recordings</h3>
    <Underline />
    {historyAudioUrlKeys.length ? <div className="flex-wrap">
      {historyAudioUrlKeys.map((key) =>
        <div key={key} className="flex-direction-column mt-32 mr-64">
          <audio controls src={JSON.parse(sessionStorage.getItem(key)) ?.url} />
          <AudioText className="ellipses">{JSON.parse(sessionStorage.getItem(key)).text}</AudioText>
        </div>
      )}
    </div> : <div className="mt-32 italic">No recordings available!</div>}
  </div>
)
export default PreviousRecordings;