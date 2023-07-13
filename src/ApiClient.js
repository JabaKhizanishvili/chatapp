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

    fetch(`${this.apiUrl}/api/Chat/CreateConversation`, requestOptions)
      .then(response => response.text())
      .then(result => {
          return result;
      })
      .catch(error => error.message);
  };




}
