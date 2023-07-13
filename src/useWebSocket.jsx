import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Helper } from './helper';


const WebSocketConnection = ({ response }) => { 

  const [socketUrl, setSocketUrl] = useState('wss://jd.self.ge:8080/chat?id=123');
 
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
 
  // console.log(socketUrl);
  useEffect(() => {
     if (!Helper.isEmpty(response)) {
       setSocketUrl('wss://jd.self.ge:8080/chat?id=' + response.userid.ID)
     }
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, socketUrl]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  
  // const changeSocketUrl = () => {
  //   setSocketUrl('wss://jd.self.ge:8080/chat');
  // };

  return {
    sendMessage,
    readyState,
    messageHistory,
    lastMessage,
    connectionStatus,
  };
};

export default WebSocketConnection;
