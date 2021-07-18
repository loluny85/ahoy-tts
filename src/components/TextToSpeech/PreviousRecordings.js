import React from 'react';

const PreviousRecordings = ({ historyAudioUrlKeys }) => (
  <div style={{ marginTop: '64px' }}>
    <h3>Previous Recordings</h3>
    <div style={{ width: '40px', height: '1px', borderTop: '4px solid #FF0102', marginTop: '-12px' }}></div>
    {historyAudioUrlKeys.length ? <div style={{ flexWrap: 'wrap' }} className="flex">
      {historyAudioUrlKeys.map((key) =>
        <div style={{ marginTop: '32px', marginRight: '64px' }} key={key} className="flex-direction-column">
          <audio controls src={JSON.parse(sessionStorage.getItem(key)).url} />
          <span style={{ width: '140px', paddingLeft: '16px', fontStyle: 'italic', fontSize: '14px' }} className="ellipses">{JSON.parse(sessionStorage.getItem(key)).text}</span>
        </div>
      )}
    </div> : <div style={{ marginTop: '32px', fontStyle: 'italic' }}>No recordings available!</div>}
  </div>
)
export default PreviousRecordings;