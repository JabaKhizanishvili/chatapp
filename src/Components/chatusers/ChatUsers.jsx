import React, { useState, useEffect } from "react";
import CreateConversation from '../createConversation/createConvesation';
import { BsPersonCircle } from 'react-icons/bs';
import InfiniteScroll from 'react-infinite-scroll-component';

const Chatlist = () => {
  const [modal, setModal] = useState(false);
  const [pagination, setPagination] = useState({ start: 0, limit: 12, count: false, pages: false });
  const [currentPage, setCurrentPage] = useState(0);
  const [dataFromChild, setDataFromChild] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    console.log(pagination);
    try {
      const response = await fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${pagination.start}&limit=${pagination.limit}`);
      if (response.ok) {
        const data = await response.json();
        let res = data;
        setUsers(res.data);
        let countdata = res.count[0]['COUNT(*)'] * 1;
        let pages = Math.ceil(countdata / pagination.limit);
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

  const searchConversations = (e) => {
    clearTimeout(searchConversations.timer);

    searchConversations.timer = setTimeout(() => {
      const text = e.target.value;
      let url = `https://jd.self.ge/api/Chat/searchConversation?text=&start=0&limit=${pagination.limit}`;
      if (text.length >= 3) {
        url = `https://jd.self.ge/api/Chat/searchConversation?text=${e.target.value}&start=0&limit=${pagination.limit}`;
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
      const response = await fetch(`https://jd.self.ge/api/Chat/searchConversation?text=&start=${start}&limit=${limit}`);
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
    const data = await fetchData(startIndex, endIndex);
    const newArray = data.data.map(el => el);
    setUsers(prevUsers => [...prevUsers, ...newArray]);


    // for (let index = startIndex; index < endIndex; index++) {
    //   try {
    //     const data = await fetchData(index, pagination.limit);
    //     const newArray = data.data.map(el => el);
    //     setUsers(prevUsers => [...prevUsers, ...newArray]);
    //   } catch (error) {
    //     console.error('Request failed:', error);
    //   }
    // }

    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    fetchMoreData();
    fetchUsers();
  }, []);

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
                {modal && <CreateConversation sendDataToParent={handleDataFromChild} Group={ConvAdd} />}
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
                      {users.map((user, index) => (
                        <a key={index} href="#" className="d-flex align-items-center mt-4 pb-2 mb-12">
                          <div className="flex-shrink-0">
                            <BsPersonCircle />
                            {/* <img className="img-fluid" src={user.photo} alt="user img" /> */}
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6>{user.TEXT}</h6>
                            {/* <p>{user.position}</p> */}
                          </div>
                        </a>
                      ))}
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
