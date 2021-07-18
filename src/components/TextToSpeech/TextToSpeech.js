import { useState, useEffect, useRef } from 'react'
import useFetch from "../../hooks/useFetch"
import { SYNTHESIZE_URL } from "../../config/config"
import { hashText } from "../../util/hash"
import { Input, InputHint, Speak, ErrorMsg, Loader } from "./styles.js"
import speakIcon from "../../images/speak.png"
import cancelIcon from "../../images/cancel.png"
import loaderIcon from "../../images/loader.gif"
import PreviousRecordings from "./PreviousRecordings";

const TextToSpeech = () => {
  const [audioSrc, setAudioSrc] = useState(null)
  const [text, setText] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [historyAudioUrlKeys, setHistoryAudioUrlKeys] = useState([])
  const audioRef = useRef()

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
    if (!text.trim().length || errorMsg) {
      return
    }
    const isAudioUrlPresent = sessionStorage.getItem(hashText(text))
    if (isAudioUrlPresent) {
      setAudioSrc(JSON.parse(sessionStorage.getItem(hashText(text))).url)
      audioRef.current.play()
    }
    else {
      execute()
    }
  }

  const ConvertTextToSpeechInputSection = () => (
    <>
      <div className="justify-center">
        <div className="half-width">
          <Input type="text" placeholder="Type something..." maxLength={MAX_INPUT_LENGTH} value={text} onChange={e => setText(e.target.value.toLowerCase())} onFocus={e => e.target.select()} />
          <div className="justify-space-between">
            <ErrorMsg>{errorMsg}</ErrorMsg>
            <InputHint >{`${MAX_INPUT_LENGTH - text.length}/${MAX_INPUT_LENGTH}`}</InputHint>
          </div>
        </div>
        <img className={`icon pointer mt-20 ${text.trim().length > 0 ? "" : "hideVisibility"}`} src={cancelIcon} alt="reset input" onClick={() => setText("")} />
        <Speak className={!text.trim().length || errorMsg ? "disableIcon pointer" : "pointer"} src={speakIcon} alt="speak" onClick={getTextToSpeech} />
      </div>
      <div className="justify-center mt-24">
        {text && pending ? <Loader src={loaderIcon} alt="loading icon" /> : <audio controls autoPlay src={audioSrc} ref={audioRef} />}
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