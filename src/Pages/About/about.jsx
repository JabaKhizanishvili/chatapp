import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios library for API requests
import InfiniteScroll from 'react-infinite-scroll-component';

const About = () => {
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [messageHistory, setMessageHistory] = useState([]);
   const [maxPage, setMaxPage] = useState(0);
  // Your API endpoint
  const apiEndpoint = `https://jd.self.ge/api/Chat/getMsg?group_id=80835&page=${currentPage}`;

  // Function to fetch messages from the API
// const fetchMessages = async (currentUser = 212) => {
//   try {
//     const response = await axios.get(apiEndpoint);

//      const result = await response;
//         const newMessages = result.data.map(element => ({ data: JSON.stringify(element) })).reverse();
//     // const newMessages = await response.data.map(element => ({ data: JSON.stringify(element) })).reverse();
//     newMessages.map((e, i) => {
//       console.log(newMessages);
//     })

//     // setMessages(prevMessages => [...newMessages, ...prevMessages]); 
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//   }
// };

  const fetchMessages = async () => {
      try {
        const response = await fetch(`https://jd.self.ge/api/Chat/getMsg?group_id=80835&page=${currentPage}`);
        const result = await response.json();
        const newMessages = result.data.map(element => ({ data: JSON.stringify(element) })).reverse();
        setMaxPage(result.pages)
        setMessageHistory(prev => currentPage === 1 ? newMessages : [...newMessages, ...prev]);
      } catch (error) {
        console.log('error', error);
      } finally {
      }
  };
  


  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  return (
    <div>
     <div
        id="scrollableDiv"
        className='bg-danger'
  style={{
    height: 300,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
  }}
      >
  <InfiniteScroll
    dataLength={  messageHistory.length}
          next={() => {
            console.log('asd');
            setCurrentPage(prev => prev + 1)
            console.log(currentPage);
          }}
    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
    inverse={true} //
    hasMore={currentPage < maxPage}
    loader={<h4>Loading...</h4>}
    scrollableTarget="scrollableDiv"
  >
    {messageHistory.map((_, index) => (
      <div key={index} className='mt-2 mb-2'>
        div - #{_.MASSAGE}
      </div>
    ))}
  </InfiniteScroll>
</div>
    </div>
  );
};

export default About;
