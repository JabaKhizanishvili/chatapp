import React, { useCallback, useEffect, useState } from 'react';
import Moment from 'react-moment';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import XApiClient from '../../ApiClient';
import Chatlist from '../../Components/chatusers/ChatUsers';
import MessageInput from '../../Components/messageInput/MessageInput';
import { C, Helper } from '../../helper';
import { AiOutlineFileAdd } from "react-icons/ai";
import './home.css';


const Home = ({ userid }) => {
  const [userScrolledUp, setUserScrolledUp] = useState(0);
  const getMsg = new XApiClient('https://jd.self.ge');
  const [currentUser, setCurrentUser] = useState([]);
  let user_id = typeof (C._('userid', userid).ID) == 'undefined' ? 212 : C._('userid', userid).ID;
  // let user_id = 4774;
  const url = 'wss://jd.self.ge:8080/chat?id=' + user_id;
  const [socketUrl, setSocketUrl] = useState(url);
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [onlineusers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading status
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const activeUser = useCallback((data) => {
    setCurrentUser(data);
    setIsLoading(true); // Set loading status to true when user changes
  }, []);


    const scrollBottom = (toLocation = '') => {
  // if (toLocation != '') {
  // }
    let msgbody = document.querySelector(".msg-body");
      if (msgbody != null) {
        var ul = document.querySelector(".msg-body ul")
        if (ul == null) {
          return false;
        }
      setTimeout(function () {
        msgbody.scrollTo({
          top: document.querySelector(".msg-body ul").scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  useEffect(() => {


    const fetchMessageHistory = async () => {
      try {
        setIsLoading(true); // Set loading status to true before API call
        const response = await fetch(`https://jd.self.ge/api/Chat/getMsg?group_id=${currentUser[0].CONVERSATION_ID}&page=${currentPage}`);
        const result = await response.json();
        const newMessages = result.data.map(element => ({ data: JSON.stringify(element) })).reverse();
        setMaxPage(result.pages)
        setMessageHistory(prev => currentPage === 1 ? newMessages : [...newMessages, ...prev]);
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false); // Set loading status to false when API call completes
      }
    };

    if (currentUser.length > 0) {
        const cmd = {
         cmd: 'isonline',
        };
      sendMessage(JSON.stringify(cmd));
      fetchMessageHistory();
    }

    // ...
  }, [currentUser, currentPage]); // Include currentPage as a dependency

   const handleScroll = (e) => {
       if (currentPage >= maxPage) {
         return false;
       }
     const container = e.target;
       const isAtBottom = container.clientHeight + Math.abs(container.scrollTop) + 1 >= container.scrollHeight;
     setUserScrolledUp(container.clientHeight);
      if (isAtBottom) {
      setCurrentPage(prevPage => prevPage + 1);
    }
   };

  useEffect(() => {
    const container = document.querySelector('.msg-body');
     container.addEventListener('scroll', handleScroll);
     
     return () => {
      container.removeEventListener('scroll', handleScroll);
    };

  }, [isLoading,currentPage, maxPage]);


  useEffect(() => {    
    if (lastMessage !== null) {
      let parsedData = JSON.parse(lastMessage.data);
      if (typeof (parsedData.type) != 'undefined' && parsedData.type == 'isonline') {
        setOnlineUsers(parsedData.activeusers);        
      }

      // if (currentUser[0].PERSON_ID == JSON.parse(lastMessage.data).person) {      
        if (currentUser[0].CONVERSATION_ID == JSON.parse(lastMessage.data).CHAT_GROUP_ID) {
          setMessageHistory(prev => [...prev, { data: lastMessage.data }]);
          let msgbody = document.querySelector('.msg-body');
          const isAtBottom = msgbody.clientHeight + msgbody.scrollTop + 1 >= msgbody.scrollHeight;
           if (msgbody) {
             }
          // scrollBottom();
        }
      // }
    }
  }, [lastMessage, currentUser]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

function download(dataurl, filename) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}
  
  return (
    <div className="container">
      <section className="message-area">
        <div className="">
          <div className="row">
            <div className="col-12">
              <div className="chat-area">
                <Chatlist activeUser={activeUser} lastMessage={lastMessage} onlineusers={onlineusers} userid={user_id} />

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
                          <ul className={'msg-body-ul'}>
                              {messageHistory.map((message, index) => {
                              const jsonObject = JSON.parse(message.data);
                                let chatType;
                              if (jsonObject.SENDER_PERSON == user_id) {
                                chatType = 'sender'
                              } else {
                                chatType = 'repaly'
                              }
                                if (jsonObject.PARENT_FILE_MSG_ID == 0)
                                // if (true)
                                {
                                  // console.log(jsonObject);
                                  return (
                                  <li className={chatType} key={index}>
                                      <p style={{cursor:'pointer'}}>{Helper.isEmpty(jsonObject.message) ? jsonObject.MASSAGE : jsonObject.message}</p>
                                      {/* <AiOutlineFileAdd /> */}
                                      <div className='d-flex'>
                                        {jsonObject.MSG_TYPE == 1 &&
                                          <AiOutlineFileAdd size={40} className='mb-2' style={{ cursor: 'pointer' }} onClick={() => {
                                                    download(jsonObject.FILE_PATH, jsonObject.FILE_NAME)
                                                  }} />
                                        }
                                            {
                                        messageHistory.map((e, i) => {
                                          let innserData = JSON.parse(e.data); 
                                          if (jsonObject.PARENT_FILE_MSG_ID == 0) {
                                            if (jsonObject.ID == innserData.PARENT_FILE_MSG_ID) {
                                              // console.log(e);
                                              return (
                                                <div key={i}>
                                                  <AiOutlineFileAdd size={40} className='mb-2' style={{ cursor: 'pointer' }} onClick={() => {
                                                    download(innserData.FILE_PATH, innserData.FILE_NAME)
                                                  }} />
                                                  {/* <h2>FILE...</h2> */}
                                                </div>
                                              )
                                            }
                                          }
                                        })
                                        }
                                        </div>
                                    <Moment format="hh:mm:ss" className='time' withTitle>
                                      { jsonObject.START_DATE }
                                      </Moment>
                                  </li>
                                );
                                }
                                
                            })}
                              <div className='scrollbtm'></div>
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