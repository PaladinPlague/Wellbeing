'use strict';

class Model {
  constructor(){
    this.usernameLookupInProgress = 0;
    this.freeUsername = "";
    this.impatient = false;
    this.loggedInId = -1;
    this.mostRecentTimestamp = "";
    this.lastUpdateDate = null;
    this.getPostInProgress = false;
    this.lastPostDate = null;
    this.initialFill = true;
    this.gotAllPosts = false;
    this.rememberMe = false;
    this.newestPostsInterval = null;
    this.currentPostDetailsId = 0;
    this.newestCommentTimestamp =  "";
    this.newestCommentsInterval = null
    this.commentSubmitUpdateInProgress = 0;
    this.firstPostDate = null;
    this.skipped = false;
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

    this.rememberMe = data.remember_me;

    this.doAJAXPOST("login.php", formData, this.loginAJAXHandler);
  }

  setLoginAJAXHandler(handler) {
    this.loginAJAXHandler = handler;
  }

  makePostFormSubmission(data) {
    let formData = new FormData();
    formData.append("user_id", this.loggedInId);
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

  getPosts() {
    if(!this.skipped && this.firstPostDate && this.firstPostDate < this.lastUpdateDate) {
      this.skipped = true
      let sameDate = (this.getLookupDateString(this.firstPostDate) === this.getLookupDateString(this.lastUpdateDate));
      if(!sameDate) {
        this.lastUpdateDate = this.firstPostDate;
      } else {
        this.lastUpdateDate.setDate(this.lastUpdateDate.getDate() - 1);
      }


    } else {
      if(this.lastUpdateDate === null) {
        this.lastUpdateDate = new Date();
      } else {
        this.lastUpdateDate.setDate(this.lastUpdateDate.getDate() - 1);
      }
    }

    if(!this.isPastLastPost(this.getLookupDateString(this.lastUpdateDate))) {
      this.doAJAXGET("get_post.php", "?date="+this.getLookupDateString(this.lastUpdateDate), this.getPostsAJAXHAndler);
    } else {
      this.getPostInProgress = false;
      this.gotAllPosts = true;
    }

  }

  setGetPostsAJAXHandler(handler) {
    this.getPostsAJAXHAndler = handler;
  }

  getLookupDateString(date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    let yyyy = date.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }

  getLastPostDate() {
    this.doAJAXGET("get_post.php", "?last=true", this.getLastPostDateAJAXHandler);
  }

  isPastLastPost(currentDateString) {
    let currentDate = new Date(currentDateString);
    return this.lastPostDate > currentDate;
  }

  setGetLastPostDateAJAXHandler(handler) {
    this.getLastPostDateAJAXHandler = handler;
  }

  initialFillDone() {
    this.initialFill = false;
  }

  isInitiallyFilling() {
    return this.initialFill;
  }

  login(id) {
    this.loggedInId = id;
  }

  logout() {
    this.loggedInId = -1;
    localStorage.removeItem("logged_in_id");
    this.freeUsername = "";
    this.usernameLookupInProgress = 0;
    this.impatient = false;
    this.mostRecentTimestamp = "";
    this.lastUpdateDate = null;
    this.getPostInProgress = false;
    this.initialFill = true;
    this.gotAllPosts = false;
    this.rememberMe = false;
    this.currentPostDetailsId = 0;
    this.newestCommentTimestamp =  "";
    this.commentSubmitUpdateInProgress = 0;
    this.skipped = false;
    clearInterval(this.newestPostsInterval);
    clearInterval(this.newestCommentsInterval);
  }

  constructBrowsePostContent(currentPostObj) {
    let currentPostContent = "<p>";

    currentPostContent += currentPostObj.title + "<br/>";
    currentPostContent += "By: " + currentPostObj.username + "<br/>";
    if(currentPostObj.hasImg) {
      currentPostContent += "<img alt='" + currentPostObj.title + "'  src='fetch_img.php?id=" + currentPostObj.post_id + "'>";
    }
    currentPostContent += "Posted: " + currentPostObj.timestamp +"</p>";

    return currentPostContent;
  }

  setGetNewestPostsAJAXHandler(handler) {
    this.getNewestPostsAJAXHandler = handler;
  }

  getNewestPosts() {
    this.doAJAXGET("get_post.php", "?newest=" + encodeURIComponent(this.mostRecentTimestamp), this.getNewestPostsAJAXHandler);
  }

  getRequestedPost(id) {
    this.doAJAXGET("get_post.php", "?id="+id, this.getRequestedPostAJAXHandler);
  }

  setGetRequestedPostAJAXHandler(handler) {
    this.getRequestedPostAJAXHandler = handler;
  }

  updateComments(id) {
    model.commentSubmitUpdateInProgress += 1;
    this.doAJAXGET("update_comments.php", "?id="+id +"&latest="+encodeURIComponent(this.newestCommentTimestamp), this.updateCommentsAJAXHandler);
  }

  setUpdateCommentsAJAXHandler(handler) {
    this.updateCommentsAJAXHandler = handler;
  }

  constructPostDetailsContent(currentPostObj) {
    let currentPostContent = "<p>";

    currentPostContent += currentPostObj.title + "<br/>";
    currentPostContent += "By: " + currentPostObj.username + "<br/>";
    currentPostContent += "Posted: " + currentPostObj.timestamp +"<br/>";

    if(currentPostObj.hasImg) {
      currentPostContent += "<img alt='" + currentPostObj.title + "'  src='fetch_img.php?id=" + currentPostObj.post_id + "'>";
    }

    currentPostContent += currentPostObj.body +"</p>";

    currentPostContent += "<div id='pd_comments_section'>Comments:"

    let commentForm = "<form id='pd_comment_form'>";
    commentForm += "<textarea id='pd_text' name='pd_text'></textarea>";
    commentForm += "<input type='checkbox' id='pd_anon' name='pd_anon'>"
    commentForm += "<label for='pd_anon'>Anonymous?</label><br/>";
    commentForm += "<input type='submit' id='pd_submit' value='Comment' class = 'submit_button' disabled>";
    commentForm += "</form>";

    currentPostContent += commentForm;

    currentPostContent += "<div id='comments_container'>";


    for(let i=0; i < currentPostObj.comments.length; i++) {
      currentPostContent += this.constructCommentContent(currentPostObj.comments[i]);
    }

    currentPostContent += "</div></div>";


    return currentPostContent;
  }

  constructCommentContent(currentCommentObj) {
    let currentCommentContent = "<div class='comment'>" + currentCommentObj.text;

    currentCommentContent += "<p class='comment_username'>" + currentCommentObj.username + "</p>";
    currentCommentContent += "<p class='comment_timestamp'>" + currentCommentObj.timestamp + "</p></div>";

    return currentCommentContent;
  }

  makeCommentFormSubmission(data) {
    let formData = new FormData();
    formData.append("post_id", this.currentPostDetailsId);
    formData.append("commenter_id", this.loggedInId);
    formData.append("text", data.text);
    formData.append("anon", data.anon);

    this.doAJAXPOST("make_comment.php", formData, this.makeCommentAJAXHandler);
  }

  setMakeCommentAJAXHandler(handler) {
    this.makeCommentAJAXHandler = handler;
  }

  getFirstPostDate() {
    this.doAJAXGET("get_post.php", "?first=true", this.getFirstPostDateAJAXHandler);
  }

  setGetFirstPostDateAJAXHandler(handler) {
    this.getFirstPostDateAJAXHandler = handler;
  }
}
