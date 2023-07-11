import './App.css';
import { useState, useEffect } from 'react';
import Home from './Pages/Home/home';
import About from './Pages/About/about';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { ProtectedPage } from './Pages/ProtectedPage/index';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('https://jd.self.ge/api/Chat/IsLogged')
      .then((response) => {
        setResponse(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  if (error) {
    return (
      <div>
        {/* <ProtectedPage /> */}
        Something bad happened: {error.message}
        <button onClick={() => fetchData({ reload: true })}>Retry</button>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="w-100 text-center align-middle" style={{ top: '50%', position: 'absolute' }}>
        Loading...
      </div>
    );
  } else if (response.userid !== null) {
    return (
      <Routes>
        <Route path="/" element={<Home userid={response} />} />
        <Route path="/:id" element={<Home />} />
      </Routes>
    );
  } else if( response.userid == null) {
    return <ProtectedPage />
  }

  return null;
}

export default App;
