import { useState, useEffect } from 'react'
import useFetch from "../../hooks/useFetch"
import { SYNTHESIZE_URL } from "../../config/config"
import { hashText } from "../../util/hash"
import { Input, InputHint, Speak } from "./TextToSpeechStyles.js"
import speakIcon from "../../images/speak.png"
import cancelIcon from "../../images/cancel.png"
import PreviousRecordings from "./PreviousRecordings";

const TextToSpeech = () => {
  const [audioSrc, setAudioSrc] = useState(null)
  const [text, setText] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [historyAudioUrlKeys, setHistoryAudioUrlKeys] = useState([])

  const API_KEY = process.env.REACT_APP_API_KEY
  const URL = SYNTHESIZE_URL
  const MAX_INPUT_LENGTH = 50

  const { execute, response, pending, error } = useFetch({
    method: "POST",
    url: URL,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Basic ${btoa(`apikey:${API_KEY}`)}`,
      'Accept': 'audio/ogg'
    },
    data: JSON.stringify({ text }),
    options: {
      responseType: 'blob'
    },
  })

  useEffect(() => {
    getHistoryRecordings()
  }, [])

  useEffect(() => {
    try {
      btoa(text)
      setErrorMsg("")
    }
    catch (err) {
      setErrorMsg("The text contains unrecognized characters")
    }
    if (text.length === MAX_INPUT_LENGTH) {
      setErrorMsg("Max character limit reached")
    }
  }, [text])

  useEffect(() => {
    if (response ?.status === 200) {
      const blob = new Blob([response.data], { type: "audio/ogg" });
      const url = window.URL.createObjectURL(blob);
      setAudioSrc(url)
      const sessionStorageKey = hashText(text)
      sessionStorage.setItem(sessionStorageKey, JSON.stringify({
        url,
        text
      }))
      setTimeout(() => {
        getHistoryRecordings()
      }, 2000)
    }
    if (pending) {
      // Show a loader
    }
    if (error) {
      setErrorMsg(error)
    }
  }, [response, pending, error])

  const getHistoryRecordings = () => {
    const history_audioUrl_keys = Object.keys(sessionStorage).filter((key) => key.startsWith("ahoy_tts_"))
    setHistoryAudioUrlKeys(history_audioUrl_keys)
  }

  const getTextToSpeech = (e) => {
    e.preventDefault();
    if (!text.trim().length) {
      return
    }
    const isAudioUrlPresent = sessionStorage.getItem(hashText(text))
    if (isAudioUrlPresent) {
      setAudioSrc(JSON.parse(sessionStorage.getItem(hashText(text)).url))
    }
    else {
      execute()
    }
  }

  const ConvertTextToSpeechInputSection = () => (
    <>
      <div className="justify-center">
        <div style={{ width: '50%' }}>
          <Input type="text" placeholder="Type something..." maxLength={MAX_INPUT_LENGTH} value={text} onChange={e => setText(e.target.value.toLowerCase())} onFocus={e => e.target.select()} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginTop: '8px', color: '#D8000C', fontSize: '14px' }}>{errorMsg}</div>
            <InputHint >{`${MAX_INPUT_LENGTH - text.length}/${MAX_INPUT_LENGTH}`}</InputHint>
          </div>
        </div>
        <img style={{ marginTop: '21px' }} className={`icon pointer ${text.trim().length > 0 ? "" : "hideVisibility"}`} src={cancelIcon} alt="reset input" onClick={() => setText("")} />
        <Speak className={!text.trim().length ? "disableIcon pointer" : "pointer"} src={speakIcon} alt="speak" onClick={getTextToSpeech} />
      </div>
      <div style={{ marginTop: '24px' }} className="justify-center">
        <audio controls autoPlay src={audioSrc} />
      </div>
    </>
  )

  return (
    // TODO - Deploy to netlify
    <div className="justify-center">
      <form className="fullWidth" onSubmit={getTextToSpeech}>
        {ConvertTextToSpeechInputSection()}
        <PreviousRecordings historyAudioUrlKeys={historyAudioUrlKeys} />
      </form>
    </div>
  );
};

export default TextToSpeech;