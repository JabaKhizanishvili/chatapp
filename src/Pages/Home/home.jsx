import home from './home.css'
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
// import Picker from 'emoji-picker-react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BiSmile } from 'react-icons/bi';


const Home = ()=>{

  const [socketUrl, setSocketUrl] = useState('wss://jd.self.ge:8080/chat');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [ showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://jd.self.ge:8080/chat'),
    []
  );

  // const handleClickSendMessage = useCallback(() => sendMessage('jaba'), []);


  const SubmitMsg = (e)=>{
    e.preventDefault();
    sendMessage(e.target[0].value);
    e.target[0].value = '';
  }


  const SelectEmoji = (e)=>{
   
    const inputField = document.getElementById('msg');
      const startPos = inputField.selectionStart;
      const endPos = inputField.selectionEnd;

      const sym = e.unified.split('_');
      const CodeArr = [];
    sym.forEach((e,i) => {
      if(e != ''){
        CodeArr[i] = '0x' + e;
      }
    });

    console.log(CodeArr);
    // let emoji = String.fromCodePoint(...CodeArr);

      // inputField.value = inputField.value.substring(0, startPos) + emoji + inputField.value.substring(endPos, inputField.value.length);

      // Move the cursor after the inserted emoji
      // const newPos = startPos + emoji.length;
      // inputField.setSelectionRange(newPos, newPos);
      // inputField.focus();



    // const sym = e.unified.split('_');
    // const CodeArr = [];
    // sym.forEach((e,i) => {
    //   CodeArr[i] = '0x' + e;
    // });
    // let emoji = String.fromCodePoint(...CodeArr);
    // let msg = document.getElementById('msg');
    // msg.value += emoji;
    // console.log(emoji);
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];



  // messageHistory.map((e)=>{
  //   // let msg = (JSON.parse(e.data));
  //   let data = e.data;
  //   const jsonObject = JSON.parse(data);
  //   console.log(jsonObject['message']);
  // })


  // return(
  //   <div>
  //     <button onClick={handleClickChangeSocketUrl}>
  //       Click Me to change Socket Url
  //     </button>
  //     <button
  //       onClick={handleClickSendMessage}
  //       disabled={readyState !== ReadyState.OPEN}
  //     >
  //       Click Me to send 'Hello'
  //     </button>
  //     <span>The WebSocket is currently {connectionStatus}</span>
  //     {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
  //     <ul>
  //       {messageHistory.map((message, idx) => (
  //         <span key={idx}>{message ? message.data : null}</span>
  //       ))}
  //     </ul>
  //   </div>
  // )


  const Users = [
    {
      fullName : 'Jaba Khizanishvili',
      position : 'Developer',
      photo : 'https://mehedihtml.com/chatbox/assets/img/user.png',
    },
    {
      fullName : 'Zura Khizanishvili',
      position : 'Ragaca',
      photo : 'https://mehedihtml.com/chatbox/assets/img/user.png',
    },
    {
      fullName : 'Mari Khizanishvili',
      position : 'Test',
      photo : 'https://mehedihtml.com/chatbox/assets/img/user.png',
    },
    {
      fullName : 'Jaba Khizanishvili',
      position : 'Developer',
      photo : 'https://mehedihtml.com/chatbox/assets/img/user.png',
    },
    {
      fullName : 'Jaba Khizanishvili',
      position : 'Developer',
      photo : 'https://mehedihtml.com/chatbox/assets/img/user.png',
    }
  ];



  const massages = [
    {
      type : 'sender',
      msg : 'hello world',
      time : '10:16 am'
    },
    {
      type : 'repaly',
      msg : 'hi',
      time : '10:16 am'
    },
    {
      type : 'sender',
      msg : 'hello world',
      time : '10:16 am'
    },
    {
      type : 'sender',
      msg : 'hello world',
      time : '10:16 am'
    }
  ];


    return(
        <>
          {/* <h2>Home</h2> */}
          <div className='container'>
          <section className="message-area">
  <div className="">
    <div className="row">
      <div className="col-12">
        <div className="chat-area">
          <div className="chatlist">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="chat-header">
                  <div className="msg-search">
                    <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search"/>
                    <a className="add" href="#">
                      <img className="img-fluid" src={'https://mehedihtml.com/chatbox/assets/img/add.svg'} alt="add" />
                    </a>
                  </div>

                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {/* <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open" type="button" role="tab" aria-controls="Open" aria-selected="true">Open</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed" aria-selected="false">Closed</button>
                    </li> */}
                  </ul>
                </div>

                <div className="modal-body">
                  <div className="chat-lists">
                    <div className="tab-content" id="myTabContent">
                      <div className="tab-pane fade show active mt-4" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                      {
                          Users.map((e,i)=>{
                            return(
                              <a key={i} href="#" className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                <img className="img-fluid" src={e.photo} alt="user img"/>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6>{e.fullName}</h6>
                                <p>{e.position}</p>
                              </div>
                            </a>
                            )
                          })

                        }                  
                      </div>
                      <div className="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                        <div className="chat-list">     
                        {
                          Users.map((e,i)=>{
                            return(
                              <a key={i} href="#" className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                <img className="img-fluid" src={e.photo} alt="user img"/>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h3>{e.fullName}</h3>
                                <p>{e.position}</p>
                              </div>
                            </a>
                            )
                          })
                        }                  
                         
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chatbox">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="msg-head">
                  <div className="row">
                    <div className="col-8">
                      <div className="d-flex align-items-center">
                        {/* <span className="chat-icon"><img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg" alt="image title"></span> */}
                        <div className="flex-shrink-0">
                          {/* <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/user.png" alt="user img"> */}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3>Mehedi Hasan</h3>
                          <p>front end developer</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                    </div>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="msg-body">
                    <ul>
                     
                      {/* {
                        massages.map((e,i)=>{
                          return(
                            <li key={i} className={e.type}>
                        <p> {e.msg} </p>
                        <span className="time">{e.time}</span>
                      </li>
                          )
                        })
                      } */}

                      {
                         messageHistory.map((e,i)=>{
                          // let msg = (JSON.parse(e.data));
                          let data = e.data;
                          const jsonObject = JSON.parse(data);
                          // console.log(jsonObject['message']);
                          console.log(e, 'esaa');

                          return(
                            <>
                            <li key={i} className={'sender'}>
                        <p> {jsonObject['message']} </p>
                        <span className="time">{'11:00'}</span>
                      </li>
                            </>
                          )
                        })
                      }


                      {/* <li>
                        <div className="divider">
                          <h6>Today</h6>
                        </div>
                      </li> */}

                    </ul>
                  </div>
                </div>

                <div className="send-box">
                  {/* <form action="" onSubmit={(e)=>{
                    e.preventDefault();
                    console.log( e.target[0].value );
                    e.target[0].value = '';
                    
                    }}> */}


                  <form action="" onSubmit={SubmitMsg}>
                    <input type="text" id="msg" className="form-control" aria-label="message…" placeholder="Write message…" />
                    <button type="button"><i className="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
                  </form>

                  <div className="send-btns">
                    <div className="attach">
                      <div className="button-wrapper">
                        <span className="label">
                          <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/upload.svg" alt="image title" /> attached file
                        </span>
                        <input type="file" name="upload" id="upload" className="upload-box" placeholder="Upload File" aria-label="Upload File" />
                      </div>


                      {/* <div>
      {chosenEmoji ? (
        <span>You chose: {chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )}
      <Picker onEmojiClick={onEmojiClick} />
    </div> */}
            <BiSmile onClick={ ()=>{setShowEmoji(!showEmoji)} }/>
            {
              showEmoji ?
              <Picker data={data} onEmojiSelect={
                // console.log
                SelectEmoji
              } />
              : ''
            }

                      {/* <select className="form-control" id="exampleFormControlSelect1">
                        <option>Select template</option>
                        <option>Template 1</option>
                        <option>Template 2</option>
                      </select> */}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* </div> */}
</section>
</div>
        </>
    )
}


export default Home;