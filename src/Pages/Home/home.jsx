import React, { useState, useCallback, useEffect, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MessageInput from '../../Components/messageInput/MessageInput';
import Chatlist from '../../Components/chatusers/ChatUsers';
import './home.css';
import { C } from '../../helper';
import XApiClient from '../../ApiClient';
import { Helper } from '../../helper';
import Moment from 'react-moment';
import { json } from 'react-router-dom';

 const scrollBottom = () => {
    let msgbody = document.querySelector(".msg-body");
    if (msgbody != null) {
      setTimeout(function () {
        msgbody.scrollTo({
          top: document.querySelector(".msg-body ul").scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }

const Home = ({ userid }) => {
  const getMsg = new XApiClient('https://jd.self.ge');
  const [currentUser, setCurrentUser] = useState([]);
  let user_id = typeof (C._('userid', userid).ID) == 'undefined' ? 212 : C._('userid', userid).ID;
  const url = 'wss://jd.self.ge:8080/chat?id=' + user_id;
  const [socketUrl, setSocketUrl] = useState(url);
  const [messageHistory, setMessageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading status

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const activeUser = useCallback((data) => {
    setCurrentUser(data);
    setIsLoading(true); // Set loading status to true when user changes
  }, []);

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        setIsLoading(true); // Set loading status to true before API call
        const response = await fetch(`https://jd.self.ge/api/Chat/getMsg?group_id=${currentUser[0].CONVERSATION_ID}`);
        const result = await response.json();
        setMessageHistory(result.data.map(element => ({
          data: JSON.stringify(element)
        })));
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false); // Set loading status to false when API call completes
      }
    };

    if (currentUser.length > 0) {
      fetchMessageHistory();
    }

    return () => {
      // Cleanup code here
    };
  }, [currentUser]);

  useEffect(() => {
    if (lastMessage !== null) {
      // if (currentUser[0].PERSON_ID == JSON.parse(lastMessage.data).person) {      
        if (currentUser[0].CONVERSATION_ID == JSON.parse(lastMessage.data).CHAT_GROUP_ID) {
          setMessageHistory(prev => [...prev, { data: lastMessage.data }]);
          scrollBottom();
        }
      // }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
    <div className="container">
      <section className="message-area">
        <div className="">
          <div className="row">
            <div className="col-12">
              <div className="chat-area">
                <Chatlist activeUser={activeUser} userid={userid} />

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
                                    {currentUser[0]?.TEXT || ''}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-4"></div>
                        </div>
                      </div>

                      <div className="msg-body">
                        {isLoading ? ( // Display preloader while loading
                          <div>Loading...</div>
                        ) : (
                          <ul>
                            {messageHistory.map((message, index) => {
                              const jsonObject = JSON.parse(message.data);
                              let chatType;

                              if (jsonObject.SENDER_PERSON == user_id) {
                                chatType = 'sender'
                              } else {
                                chatType = 'repaly'
                              }
                              return (
                                <li key={index} className={chatType}>
                                  <p>{Helper.isEmpty(jsonObject.message) ? jsonObject.MASSAGE : jsonObject.message}</p>
                                  <Moment format="hh:mm:ss" className='time' withTitle>
                                    { jsonObject.START_DATE }
                                  </Moment>
                                </li>
                              );
                            })}
                          </ul>
                        )}
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
  );
};

export default Home;
