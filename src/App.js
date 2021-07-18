import { BrowserRouter as Router, Route } from 'react-router-dom'
import TextToSpeech from "./pages/TextToSpeech"
import './styles/styles.css';

function App() {
  return (
    <Router>
      <Route exact path="/" component={TextToSpeech} />
    </Router>
  );
}

export default App;
