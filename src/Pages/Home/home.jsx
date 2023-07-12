import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { BiSmile } from 'react-icons/bi';
import { TiDelete } from 'react-icons/ti';
import Chatlist from '../../Components/chatusers/ChatUsers';
import './home.css';

const Home = ({ userid }) => {
  const [img, setImg] = useState('');
  const [clipimg, setClipimg] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

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
      }
    }
  };

  const [socketUrl, setSocketUrl] = useState('wss://jd.self.ge:8080/chat');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [showEmoji, setShowEmoji] = useState(false);

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
    setSocketUrl('wss://jd.self.ge:8080/chat');
  }, []);

  const SubmitMsg = (e) => {
    e.preventDefault();
    if (e.target[0].value === '') {
      return false;
    }
    sendMessage(e.target[0].value);
    e.target[0].value = '';
    let msgbody = document.querySelector('.msg-body');
    if (msgbody != null) {
      setTimeout(function () {
        msgbody.scrollTo({
          top: document.querySelector('.msg-body ul').scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  const SelectEmoji = (e) => {
    const inputField = document.getElementById('msg');
    const startPos = inputField.selectionStart;
    const endPos = inputField.selectionEnd;

    let emoji = e.native;
    inputField.value =
      inputField.value.substring(0, startPos) +
      emoji +
      inputField.value.substring(endPos, inputField.value.length);
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

                        <div className="send-box">
                          <form
                            action=""
                            encType="multipart/form-data"
                            onSubmit={SubmitMsg}
                          >
                            <input
                              type="text"
                              id="msg"
                              className="form-control"
                              aria-label="message…"
                              placeholder="Write message…"
                              onPaste={handlePaste}
                            />
                            <button type="submit">
                              <i className="fa fa-paper-plane" aria-hidden="true"></i>{' '}
                              Send
                            </button>
                          </form>

                          <div className="send-btns">
                            <div className="attach">
                              <div className="button-wrapper">
                                <span className="label">
                                  <img
                                    className="img-fluid"
                                    src="https://mehedihtml.com/chatbox/assets/img/upload.svg"
                                    alt="image title"
                                  />{' '}
                                  attached file
                                </span>
                                <input
                                  type="file"
                                  name="upload"
                                  id="upload"
                                  className="upload-box"
                                  placeholder="Upload File"
                                  aria-label="Upload File"
                                />
                              </div>

                              <BiSmile
                                onClick={() => {
                                  setShowEmoji(!showEmoji);
                                }}
                              />
                              {showEmoji ? (
                                <Picker
                                  data={data}
                                  onEmojiSelect={SelectEmoji}
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="container w-100 files">
                          <ul>
                            {clipimg.map((item, i) => {
                              var file;
                              var reader = new FileReader();
                              if (item.kind === 'file') {
                                file = item.getAsFile();
                                var result;
                                reader.onload = function (event) {
                                  result = event.target.result;
                                  setImg(result);
                                };
                                reader.readAsDataURL(file);
                                return (
                                  <li key={i} className="mt-2">
                                    <img
                                      src={img}
                                      style={{ width: '60px' }}
                                      alt="err"
                                    />
                                    <TiDelete
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        removeItem(i);
                                      }}
                                    />
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </div>
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
