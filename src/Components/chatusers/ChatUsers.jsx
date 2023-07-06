import { useState } from "react";
import CreateConversation from '../createConversation/createConvesation'
import { Modal } from "bootstrap";
 
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



const Chatlist = ()=>{
    const [modal,setModal] = useState(false);
    const [dataFromChild, setDataFromChild] = useState('');
    const handleDataFromChild = (data) => {
      setDataFromChild(data);
        setModal(data);
    };
    return(
        <>
          <div className="chatlist">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="chat-header">
                  <div className="msg-search">
                    <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search"/>
                    <a className="add" href="#" onClick={()=>{setModal(!modal)}}>
                      <img className="img-fluid" src={'https://mehedihtml.com/chatbox/assets/img/add.svg'} alt="add" />
                    </a>
                    {
                      modal && <CreateConversation sendDataToParent={handleDataFromChild}/>
                    }
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

        </>
    )
}

export default Chatlist;