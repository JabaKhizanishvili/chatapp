export default class XApiClient {

  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  handleFormSubmit = (event, values) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    for (const i in values) {
      urlencoded.append(i, values[i]);
    }
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(`${this.apiUrl}/api/Chat/createMsg`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result);
          return result;
      })
      .catch(error => error.message);
  };

  getMessages = (group_id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${this.apiUrl}/api/Chat/getMsg?group_id=${group_id}`, requestOptions)
    .then(response => response.text())
      .then(result => {
        return result;
      })
    .catch(error => console.log('error', error));
    
  }

}
