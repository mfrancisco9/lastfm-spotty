import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import "./custom.scss"

// pages
import Home from './components/pages/Home';
import Lastfm from './components/pages/Lastfm';


function App() {
  return (
    <Router>
  <Route exact path = '/' component = {Home} />
  <Route exact path = '/Lastfm' component = {Lastfm} />
  </Router>
  );
}

export default App;
