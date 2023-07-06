import './App.css';
import { useState , useEffect } from "react";
import Home from './Pages/Home/home';
import About from './Pages/About/about';
import {Route, Routes} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { ProtectedPage } from './Pages/ProtectedPage/index';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios'

function App() {
  return(
  <>
  {/* <Routes>
    {
      !Auth ? 
<Route path='/' element={<ProtectedPage/>}/> 
:
<Route path='/' element={<Home/>}></Route>
    }    
  </Routes> */}


  <Get url="https://jd.self.ge/api/Chat/IsLogged" params={{}}>
        {(error, response, isLoading, makeRequest, axios) => {
          if(error) {
            return <ProtectedPage/>;
            return (<div>Something bad happened: {error.message} <button onClick={() => makeRequest({ params: { reload: true } })}>Retry</button></div>)
          }
          else if(isLoading) {
            return (<div className='w-100 text-center align-middle' style={{top:'50%', position:'absolute'}}> Loading...</div>)
          }
          else if(response !== null) {
            // return (<div>{response.data.message} <button onClick={() => makeRequest({ params: { refresh: true } })}>Refresh</button></div>)
            return <Home userid={response} />
          }
          // return (<div>Default message before request is made.</div>)
        }}
      </Get>
  </>
  );
}

export default App;
