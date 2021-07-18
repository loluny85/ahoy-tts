import { useState } from "react"
import axios from "axios"

const useFetch = ({ method, url, headers, data, options }) => {
  const [response, setResponse] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const execute = () => {
    setPending(true)
    axios({
      method,
      url,
      headers,
      data,
      ...options,
    })
      .then((response) => {
        setPending(false)
        setResponse(response)
      })
      .catch((err) => {
        setPending(false)
        setError(err)
      });
  }
  return { execute, response, pending, error }
}

export default useFetch