import { useState, useEffect } from "react";
import CreateConversation from '../createConversation/createConvesation'
import { Modal } from "bootstrap";
import { Get } from 'react-axios';
import axios from 'axios';
import { BsPersonCircle } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component';



const Chatlist = ()=>{
    const [modal,setModal] = useState(false);
    const [pagination, setPagination ] = useState({start: 0, limit: 12, count:false, pages: false});

    const [dataFromChild, setDataFromChild] = useState('');
    const handleDataFromChild = (data) => {
      setDataFromChild(data);
        setModal(data);
    };

    const [Users, setUsers] = useState([]);

    useEffect(() => {
     
      fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${pagination.start}&limit=${pagination.limit}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(data => {
        // Handle the response data
        let res = data;
        setUsers(res.data);
        let countdata = res.count[0]['COUNT(*)'] * 1;
        let pages = Math.ceil(countdata / pagination.limit);
        setPagination(values => ({
          ...values,
          // calculate pages
          ['count']: countdata,
          ['pages']: pages
      }))
      })
      .catch(error => {
        // Handle any errors
        console.error('Request failed:', error);
      });
  
    }, []);

    const ConvAdd = (data)=>{

      fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${pagination.start}&limit=${pagination.limit}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(data => {
        
        // Handle the response data
        // setUsers(JSON.parse(data));
        let res = data;
        setUsers(res.data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Request failed:', error);
      });

    }

    const searchConversations = (e)=>{
      var timer;
      clearTimeout(timer);
      if(e.target.value.length >= 3){
        const timer = setTimeout(() => {          
          var requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };
          
          fetch(`https://jd.self.ge/api/Chat/searchConversation?text=${e.target.value}&start=0&limit=${pagination.limit}`, requestOptions)
            .then(response => response.text())
            .then(result =>{
              let res = JSON.parse(result);
        setUsers(res.data);
            } )
            .catch(error => console.log('error', error));
              }, 600);
             
      }else if (e.target.value.length == 0) {
        const timer = setTimeout(() => {          
          var requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };
          
          fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=0&limit=${pagination.limit}`, requestOptions)
            .then(response => response.text())
            .then(result =>{
              let res = JSON.parse(result);
              setUsers(res.data);
              
            } )
            .catch(error => console.log('error', error));
              }, 200);
      }


    }

    return(
        <>
          <div className="chatlist">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="chat-header">
                  <div className="msg-search">
                    <input onInput={searchConversations} type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search"/>
                    <a className="add" href="#" onClick={()=>{setModal(!modal)}}>
                      <img className="img-fluid" src={'https://mehedihtml.com/chatbox/assets/img/add.svg'} alt="add" />
                    </a>
                    {
                      modal && <CreateConversation sendDataToParent={handleDataFromChild} Group={ConvAdd}/>
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
                      {/* <div className="usersscroll tab-pane fade show active mt-4" style={{minHeight:'1500px'}} id="Open" role="tabpanel" aria-labelledby="Open-tab"> */}
                      
                      
                      <div
                      className="usersscroll tab-pane fade show active mt-4" 
  id="scrollableDiv"
  style={{
    height: '70vh',
    overflow: 'auto',
  }}
>
                      <InfiniteScroll
    dataLength={Users.length}
    next={()=>{
      if(Users.length == pagination.count) return false;
      for (let index = 0; index < pagination.pages ; index++) {
        // const element = array[index];
        if(index == 0){
          continue;
        }
        let start = pagination.limit * index;
        
        fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${start}&limit=${start + pagination.limit}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(data => {
        // Handle the response data
        let res = data;
        let newArray = [];
        res.data.forEach((el,i) => {
          newArray[i] = el;
          // setUsers([...Users, el])
        });
        const children = Users.concat(newArray);
        setUsers(children);
      })
      .catch(error => {
        // Handle any errors
        console.error('Request failed:', error);
      });
        
      }
    }}
    hasMore={ Users.length == pagination.count ? false : true }
    loader={<h4>Loading...</h4>}
    scrollableTarget="scrollableDiv"
  >
    {Users.map((e,i) => (
      <a key={i} href="#" className="d-flex align-items-center mt-4 pb-2 mb-12">
                              <div className="flex-shrink-0">
                              <BsPersonCircle/>
                                {/* <img className="img-fluid" src={e.photo} alt="user img"/> */}
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6>{e.TEXT}</h6>
                                {/* <p>{e.position}</p> */}
                              </div>
                            </a>
      
    ))}
  </InfiniteScroll>
  </div>
                      
                      
                      {
                         [].map((e,i)=>{
                            return(
                              <a key={i} href="#" className="d-flex align-items-center mb-4">
                              <div className="flex-shrink-0">
                              <BsPersonCircle/>
                                {/* <img className="img-fluid" src={e.photo} alt="user img"/> */}
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6>{e.TEXT}</h6>
                                {/* <p>{e.position}</p> */}
                              </div>
                            </a>
                            )
                          })

                        }  
                                      
                      </div>
                      <div className="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                        <div className="chat-list">     
                        {
                          [].map((e,i)=>{
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
          {/* </div> */}

        </>
    )
}

export default Chatlist;