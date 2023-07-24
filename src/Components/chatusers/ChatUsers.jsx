import React, { useEffect, useState } from "react";
import { BsPersonCircle } from 'react-icons/bs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import CreateConversation from '../createConversation/createConvesation';
import { Helper, C } from '../../helper';

const Chatlist = ({ activeUser, userid, onlineusers }) => {
  const location = useLocation();
  let onlineUsers = Object.values(onlineusers);
  const [modal, setModal] = useState(false);
  const [pagination, setPagination] = useState({
    start: 0,
    limit: 12,
    count: false,
    pages: false,
    userData: []
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [dataFromChild, setDataFromChild] = useState('');
  const [users, setUsers] = useState([]);
  const user_id = C._('userid', userid)?.ID || 212;
  // let user_id = 4774;

const fetchUsers = async () => {
  try {
    const response = await fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${pagination.start}&limit=${pagination.limit}&person_id=${user_id}&creator_id=${user_id}`);
    //  const response = await fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${pagination.start}&limit=${pagination.limit}&creator_id=${user_id}`);
    if (response.ok) {
      const data = await response.json();
      const res = data;
      setUsers(prevUsers => {
        if (prevUsers.length > 0) {
          return res.data;
        } else {
          return [...prevUsers, ...res.data];
        }
      });
      const countdata = Number(res.count[0]['COUNT(*)']);
      const pages = Math.ceil(countdata / pagination.limit);
      setPagination(values => ({
        ...values,
        count: countdata,
        pages: pages
      }));
    } else {
      throw new Error('Error: ' + response.status);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};


  const handleDataFromChild = (data) => {
    setDataFromChild(data);
    setModal(data);
  };

  const ConvAdd = () => {
    fetchUsers();
  };

  const searchConversations = (e, group_id = '') => {
    if (group_id !== '') {
      const url = `https://jd.self.ge/api/Chat/searchConversation?text=&group_id=${group_id}&start=0&limit=${1}`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          const res = result;
          setPagination(values => ({
            ...values,
            userData: res.data,
          }));
          activeUser(res.data);
        })
        .catch(error => console.log('error', error));
      return false;
    }

    clearTimeout(searchConversations.timer);

    searchConversations.timer = setTimeout(() => {
      const text = e.target.value;
      let url = `https://jd.self.ge/api/Chat/searchConversation?text=&start=0&limit=${pagination.limit}&person_id=${user_id}`;
      if (text.length >= 3) {
        url = `https://jd.self.ge/api/Chat/searchConversation?text=${text}&person_id=${user_id}&start=0&limit=${pagination.limit}`;
      }

      fetch(url)
        .then(response => response.json())
        .then(result => {
          const res = result;
          setUsers(res.data);
        })
        .catch(error => console.log('error', error));
    }, e.target.value.length >= 3 ? 600 : 200);
  };

  const fetchData = async (start, limit) => {
    try {
      const response = await fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${start}&limit=${limit}&creator_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };

  const fetchMoreData = async () => {
    const startIndex = pagination.limit * currentPage;
    const endIndex = startIndex + pagination.limit;
    try {
      const data = await fetchData(startIndex, endIndex);
      const newArray = data.data.map(el => el);
      setUsers(prevUsers => [...prevUsers, ...newArray]);
    } catch (error) {
      console.error('Request failed:', error);
    }

    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    setCurrentPage(0);
    setPagination(values => ({
      ...values,
      start: 0,
      limit: 12
    }));
    fetchMoreData();
    fetchUsers();
    const group_id = localStorage.getItem('jd.self.ge-activeUserId');
    if (!Helper.isEmpty(group_id)) {
      searchConversations('', group_id);
    }

  }, []);

  const handleUserClick = (userId) => {
    localStorage.setItem('jd.self.ge-activeUserId', userId);
    searchConversations('', localStorage.getItem('jd.self.ge-activeUserId'));
  };

  return (
    <>
      <div className="chatlist">
        <div className="modal-dialog-scrollable">
          <div className="modal-content">
            <div className="chat-header">
              <div className="msg-search">
                <input onInput={searchConversations} type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search" />
                <a className="add" href="#" onClick={() => { setModal(!modal) }}>
                  <img className="img-fluid" src={'https://mehedihtml.com/chatbox/assets/img/add.svg'} alt="add" />
                </a>
                {modal && <CreateConversation sendDataToParent={handleDataFromChild} Group={ConvAdd} userid={userid} />}
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
                      dataLength={users.length}
                      next={fetchMoreData}
                      hasMore={users.length < pagination.count}
                      loader={<h4>Loading...</h4>}
                      scrollableTarget="scrollableDiv"
                    >

                      {
                        users.map((user, index) => {
                          return (
                              <div
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUserClick(user.CONVERSATION_ID)}
                          className="d-flex align-items-center mt-4 pb-2 mb-12 cursor-auto"
                        >
                              <div className="flex-shrink-0">
                                {
                                  onlineUsers.includes(user.PERSON_ID.toString()) ? 
                                    <BsPersonCircle style={{backgroundColor: 'green', borderRadius: '50%'}} />
                                    : 
                                    <BsPersonCircle />
                                }
                            {/* <img className="img-fluid" src={user.photo} alt="user img" /> */}
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6>{ user.PERSON_ID == user_id && user_id != user.CREATOR_ID ? user.CREATORNAME : user.TEXT}</h6>
                          </div>
                        </div>
                          )
                        })
                       }
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatlist;
