import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

// pages
import Home from './components/pages/Home';


function App() {
  return (
    <Router>
  <Route exact path = '/' component = {Home} />
  </Router>
  );
}

export default App;
