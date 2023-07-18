import React, { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import  Picker  from "@emoji-mart/react";
import { BiSmile } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import XApiClient from '../../ApiClient';
import { C } from '../../helper';

const MessageInput = ({ currentUser, sendMessage, userid }) => {
  const SendMsgApi = new XApiClient('https://jd.self.ge');

  const [img, setImg] = useState("");
  const [clipimg, setClipimg] = useState([]);
  const [values, setValues] = useState({
    MASSAGE: "",
    SENDER_PERSON: "",
    CHAT_GROUP_ID: "",
    REPLY_ID: "",
    START_DATE: '',
  });
  const [showEmoji, setShowEmoji] = useState(false);

  const handlePaste = (event) => {
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const file = item.getAsFile();
        insertElement(item);
        // Handle the file as needed
        // console.log('Pasted file:', file);
      }
    }
  };

  const insertElement = (element) => {
    setClipimg((prevArray) => [...prevArray, element]);
  };

  const selectEmoji = (e) => {
    const inputField = document.getElementById("msg");
    const startPos = inputField.selectionStart;
    const endPos = inputField.selectionEnd;

    let emoji = e.native;
    inputField.value =
      inputField.value.substring(0, startPos) +
      emoji +
      inputField.value.substring(endPos, inputField.value.length);
  };

  const submitMsg = (e) => {
    e.preventDefault();
    if (e.target[0].value === "") {
      return false;
    }
    values.CHAT_GROUP_ID = currentUser[0].GROUP_ID;
    values.SENDER_PERSON = typeof (C._('userid', userid).ID) == 'undefined' ? 80353 : C._('userid', userid).ID;
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    values.START_DATE = formattedDate;
    SendMsgApi.handleFormSubmit(e,values);

    const message = { msg: e.target[0].value, person: currentUser[0].PERSON_ID, START_DATE: values.START_DATE };
    sendMessage(JSON.stringify(message));
    // sendMessage(JSON.stringify(
    //   {
    //     msg: e.target[0].value,
    //     person: currentUser.ID
    //   }));
    
    let msgbody = document.querySelector(".msg-body");
    if (msgbody != null) {
      setTimeout(function () {
        msgbody.scrollTo({
          top: document.querySelector(".msg-body ul").scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
    values.MASSAGE = '';
  };

   useEffect(() => {
    document.getElementById('msg').addEventListener('input', (e) => {
      var convertedText = e.target.value
        .replace(/<3/g, '❤️')
        .replace(/:D/g, '😀')
        .replace(/3:\)/g, '😈');

      e.target.value = convertedText;
    });

  }, []);

  function handleChange(e) {
    let key = e.target.className;
    switch (key) {
      case 'MASSAGE form-control':
        key = 'MASSAGE';
        break;
    }
    const value = e.target.value
    setValues(values => ({
        ...values,
        [key]: value,
    }))
  }

  const removeItem = (index) => {
    const newArray = [...clipimg];
    newArray.splice(index, 1);
    setClipimg(newArray);
  };

  return (
    <>
      <div className="send-box">
        <form action="" encType="multipart/form-data" onSubmit={submitMsg}>
          <input
            type="text"
            id="msg"
            value={values.MASSAGE}
            className="MASSAGE form-control"
            aria-label="message…"
            placeholder="Write message…"
            onPaste={handlePaste}
            onInput={handleChange}
          />
          <button type="submit">
            <i className="fa fa-paper-plane" aria-hidden="true"></i> Send
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
                />{" "}
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
            {showEmoji && (
              <Picker data={data} onEmojiSelect={selectEmoji} />
            )}
          </div>
        </div>
      </div>

      <div className="container w-100 files">
        <ul>
          {clipimg.map((item, i) => {
            let file;
            let reader = new FileReader();
            if (item.kind === "file") {
              file = item.getAsFile();
              let result;
              reader.onload = function (event) {
                result = event.target.result;
                setImg(result);
              };
              reader.readAsDataURL(file);
              return (
                <li key={i} className="mt-2">
                  <img src={img} style={{ width: "60px" }} alt="err" />
                  <TiDelete
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      removeItem(i);
                    }}
                  />
                </li>
              );
            } else {
              return null;
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default MessageInput
