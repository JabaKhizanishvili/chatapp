import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MessageInput from '../../Components/messageInput/MessageInput';
import Chatlist from '../../Components/chatusers/ChatUsers';
import './home.css';
import { C } from '../../helper';

const Home = ({ userid }) => {
  const [currentUser, setCurrentUser] = useState([]);
  let url = 'wss://jd.self.ge:8080/chat?id=' + C._('userid', userid).ID;
  const [socketUrl, setSocketUrl] = useState(url);
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const activeUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    document.getElementById('msg').addEventListener('input', (e) => {
      var convertedText = e.target.value
        .replace(/<3/g, '❤️')
        .replace(/:D/g, '😀')
        .replace(/3:\)/g, '😈');

      e.target.value = convertedText;
    });

    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(() => {
    setSocketUrl('wss://jd.self.ge:8080/createMsg');
  }, []);

     const handleFormSubmit = (event) => {
        event.preventDefault();
      };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <>
      <div className="container">
        <section className="message-area">
          <div className="">
            <div className="row">
              <div className="col-12">
                <div className="chat-area">
                  <Chatlist activeUser={activeUser} />

                  <div className="chatbox">
                    <div className="modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="msg-head">
                          <div className="row">
                            <div className="col-8">
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                  <div className="flex-grow-1 ms-3">
                                    <h3>
                                      {typeof currentUser[0] !== 'undefined'
                                        ? currentUser[0].TEXT
                                        : ''}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-4"></div>
                          </div>
                        </div>

                        <div className="msg-body">
                          <ul>
                            {messageHistory.map((e, i) => {
                              let data = e.data;
                              const jsonObject = JSON.parse(data);
                              return (
                                <li key={i} className={'sender'}>
                                  <p> {jsonObject['message']} </p>
                                  <span className="time">{'11:00'}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <MessageInput currentUser={currentUser} sendMessage={sendMessage} userid={userid} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
