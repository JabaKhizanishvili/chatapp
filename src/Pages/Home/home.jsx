import home from './home.css'
import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BiSmile } from 'react-icons/bi';
import {TiDelete} from 'react-icons/ti'


const Home = ()=>{
  const [img,setImg] = useState('');
  const [clipimg,setClipimg] = useState([]);
  const insertElement = (element) => {
    setClipimg((prevArray) => [...prevArray, element]);
  };


const removeItem = (index) => {
  const newArray = [...clipimg];
  newArray.splice(index, 1);
  setClipimg(newArray);
};

   const handlePaste = (event) => {
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.kind === 'file') {
        const file = item.getAsFile();
        insertElement(item);

        // Handle the file as needed
        // console.log('Pasted file:', file);
        // Perform any additional logic with the file here

        // Clear the input value (optional)
        // event.target.value += file;

        // var blob = item.getAsFile();
        // var reader = new FileReader();
        // reader.onload = function(event) {
            // document.getElementById("img").src = event.target.result;
            // document.querySelector('.files').innerHTML +=  '<li> <img class="w-25" src="'+ event.target.result +'" /> </li>';
        // };
 
        // reader.readAsDataURL(blob);

        // console.log(file);
      }
    }
  };


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


  var divElement = document.querySelector('.modal-body');

  const SubmitMsg = (e)=>{
    e.preventDefault();
    if(e.target[0].value == ''){
      return false;
    }
    sendMessage(e.target[0].value);
    e.target[0].value = '';    
    let msgbody = document.querySelector('.msg-body');
    if(msgbody != null){
      setTimeout(function() {
        msgbody.scrollTo({
          top: document.querySelector('.msg-body ul').scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
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

    let emoji = String.fromCodePoint(...CodeArr);
      inputField.value = inputField.value.substring(0, startPos) + emoji + inputField.value.substring(endPos, inputField.value.length);
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];



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



  // const massages = [
  //   {
  //     type : 'sender',
  //     msg : 'hello world',
  //     time : '10:16 am'
  //   },
  //   {
  //     type : 'repaly',
  //     msg : 'hi',
  //     time : '10:16 am'
  //   },
  //   {
  //     type : 'sender',
  //     msg : 'hello world',
  //     time : '10:16 am'
  //   },
  //   {
  //     type : 'sender',
  //     msg : 'hello world',
  //     time : '10:16 am'
  //   }
  // ];


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

                {/* <div className="modal-body"> */}
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
                {/* </div> */}

                <div className="send-box">
                  {/* <form action="" onSubmit={(e)=>{
                    e.preventDefault();
                    console.log( e.target[0].value );
                    e.target[0].value = '';
                    
                    }}> */}


                  <form action="" encType="multipart/form-data"  onSubmit={SubmitMsg}>
                  {/* <p contentEditable="true"  id="msg" className="form-control" onPaste={handlePaste}></p> */}
                    <input type="text" id="msg" className="form-control" aria-label="message…" placeholder="Write message…" onPaste={handlePaste} />
                    <button type="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
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
                  <div className="container w-100 files">
                    <ul>
                    {
                      clipimg.map((item,i)=>{
                        var src;
                        var file;
                        var reader = new FileReader();
                        if (item.kind === 'file') {
                          file = item.getAsFile();
                          // Set the onload event handler
                          var result;
                        reader.onload = function(event) {
                          // The result of readAsDataURL will be available here
                          result = event.target.result;
                          setImg(result)
                        };
                        reader.readAsDataURL(file);
                        return (
                                  <li key={i} className='mt-2'>
                                      <img src={img} style={{width:'60px'}} alt='err' />
                                      <TiDelete style={{cursor:'pointer'}} onClick={()=>{removeItem(i)}} />
                                  </li>
                               )     
                         }
                         }
                        )
                    }
                  </ul>

</div>
<img id='img' />
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