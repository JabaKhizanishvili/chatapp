import { useState, useEffect } from 'react';
import Modal from './Modal.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import axios from 'axios';
import { useFetcher } from 'react-router-dom';

const animatedComponents = makeAnimated();
const CreateConversation = ({ sendDataToParent })=>{

    const handleFormSubmit = (event) => {
        event.preventDefault();

        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
for (const i in values) {
  urlencoded.append(i,values[i]);
}

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://jd.self.ge/api/Chat/CreateConversation", requestOptions)
  .then(response => response.text())
  .then(result =>  {
    console.log(result);
    sendDataToParent(false)
  })
  .catch(error => console.log('error', error));


      };


      const [values, setValues] = useState({
        TEXT: "",
        PERSON_ID: "",
      })

      function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
      }


      const [choise,setUserChoice] = useState([]);


      const [options, setOptions] = useState([]);

      const insertElement = (element) => {
        // setUserChoice((prevArray) => [...prevArray, element]);
        setUserChoice(element)

      };

      useEffect(() => {
        setOptions([]);
        const fetchData = async () => {
          try {
            const response = await axios.get('https://jd.self.ge/api/Chat/getPersons');
            JSON.parse(response.data).forEach(e => {
              let person = { value: e.ID, label: e.FIRSTNAME + ' ' + e.LASTNAME}
              setOptions((prevArray) => [...prevArray, person]);
            });
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
    
      }, []);


        const sendData = (data) => {
          sendDataToParent(data);
        };


    return(
        <>
        <div className="modalconv modal-overlay">
        <div className="modal-content">
        <div className="container flex justify-content-between align-items-end">
        <h2 className='w-50' style={{float:'left'}} >Create Conversation</h2>
        <AiOutlineCloseCircle onClick={()=>{sendData(false)}} className='text-danger w-25' style={{float:'right',cursor:'pointer'}} />
        </div>
        
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={values.TEXT} onChange={handleChange} />
          <br />
          <br />
          <label htmlFor="Contact">Contact:</label>
          <Select className='mb-4'
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={false}
    //   isMulti
    placeholder='შეიყვანეთ თანამშრომელი'
      onInputChange={(e)=>{
        // if(e.length > 3){
        //   setTimeout(() => {
        //     console.log(e);
            
        //   }, 700);
        // }
      }}
      options={options}
      onChange={(choice) => {
        insertElement(choice)
        setValues(values => ({
          ...values,
          ['TEXT']: choice.label,
          ['PERSON_ID']: choice.value,
      }))
      }}
    />
          <button type="submit">create</button>
        </form>
      </div>
    </div>
        </>
    )
}

export default CreateConversation;