import './App.css';
import Home from './Pages/Home/home';
import About from './Pages/About/about';
import {Route, Routes} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';

function App() {
  return(
  <>
  
  <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/about' element={<About/>}></Route>
  </Routes>
  </>
  );
}

export default App;
