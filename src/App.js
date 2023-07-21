import { useState,createContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Home from './Pages/Home/home';
import About from './Pages/About/about';
import useWebSocket from 'react-use-websocket';
import { ProtectedPage } from './Pages/ProtectedPage/index';

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
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="w-100 text-center align-middle" style={{ top: '50%', position: 'absolute' }}>
        Loading...
      </div>
    );
  } else if (response && response.userid) {
    return <Home userid={response} />;
    return (
        <Routes>
          <Route path="" element={<Home userid={response} />} />
          {/* <Route path="/chat/:id" element={<Home userid={response} />} /> */}
        </Routes>
    );
  } else {
    // return <ProtectedPage />;
    // return <About/> 
    return (
      <>
          <Home userid={response} />
        // <Routes>
          {/* <Route path="" element={<Home userid={response} />} /> */}
          {/* <Route path="/chat/:id" element={<Home userid={response} />} /> */}
        // </Routes>
      </>
    );
  }
}

export default App;
