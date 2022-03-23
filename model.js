'use strict';

class Model {
  constructor(){
    this.usernameLookupInProgress = 0;
    this.freeUsername = "";
    this.impatient = false;
    this.loggedInId = -1;
  }

  doAJAXPOST(url, formData, handler){
    // Initialize the HTTP request.
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) { // 4 means the request is finished, 200 means the request was successful
        //execute the given function once the response is received
        handler(xhr.responseText);
      }
    }

    // Send the request

    xhr.send(formData);
  }


  doAJAXGET(url, params, handler) {
    // Initialize the HTTP request.
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url+params);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) { // 4 means the request is finished, 200 means the request was successful
        //execute the given function once the response is received
        handler(xhr.responseText);
      }
    }

    // Send the request

    xhr.send();
  }

  usernameLookup(username) {
    this.freeUsername = "";
    this.usernameLookupInProgress += 1;
    this.doAJAXGET("username_lookup.php", "?username="+username, this.usernameLookupAJAXHandler);
  }

  setUsernameLookupAJAXHandler(handler) {
    this.usernameLookupAJAXHandler = handler;
  }

  createAccountFormSubmission(data) {
    let formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    this.doAJAXPOST('create_account.php', formData, this.createAccountAJAXHandler);
  }

  setCreateAccountAJAXHandler(handler) {
    this.createAccountAJAXHandler = handler;
  }

  loginFormSubmission(data) {
    let formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    this.doAJAXPOST("login.php", formData, this.loginAJAXHandler);
  }

  setLoginAJAXHandler(handler) {
    this.loginAJAXHandler = handler;
  }

  setLoggedInId(id) {
    this.loggedInId = id;
    localStorage.setItem("logged_in_id",id);
  }

  makePostFormSubmission(data) {

    let formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("anon", data.anon);

    if(data.img) {
      formData.append("img", data.img, data.img.name);
    }


    this.doAJAXPOST("make_post.php", formData, this.makePostAJAXHandler);
  }

  setMakePostAJAXHandler(handler) {
    this.makePostAJAXHandler = handler;
  }
}
