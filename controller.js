'use strict';

/* global Model, View */

const model = new Model();
const view = new View();


function ca_usernameChangeHandler() {
  view.checkmark("hide");
  model.usernameLookup(view.ca_getUsername());
}

function ca_usernameLookupResponseHandler(response) {
  if(model.loggedInId !== -1) {
    return;
  }

  model.usernameLookupInProgress -= 1;

  if(model.usernameLookupInProgress === 0) {
    if(response !== "") {
      model.freeUsername = response;
      view.checkmark("show");
    }

    if(model.impatient) {
      view.autoSubmitCreate();
      model.impatient = false;
    }
  }

}

function ca_formSubmission(evt) {
  evt.preventDefault();

  let data = view.ca_getData();

  if(ca_validation(data)) {
    if(model.freeUsername === "") {
      if (model.usernameLookupInProgress === 0) {
        view.showOutput("ca_","Username taken.");
        return;
      } else {
        view.showOutput("ca_","Please wait...");
        model.impatient = true;
        return;
      }
    }

    view.showOutput("ca_","Creating account...");

    view.ca_disabled(true);

    model.createAccountFormSubmission(data);
  }
}

function ca_showResult(response) {
  if(model.loggedInId !== -1) {
    return;
  }

  if(response === "1") {
    view.showOutput("ca_","Success!");
    model.freeUsername = "";
    setTimeout(function() {view.switchVisible("ca_content", "li_content"); view.ca_disabled(false);  view.clearForm("ca_");}, 1000);
    //setTimeout(function() {window.location.href = "login.html"}, 1000);
  } else {
    view.showOutput("ca_","Failed.");
    view.ca_disabled(false);
  }


}

function li_formSubmission(evt) {
  evt.preventDefault();

  let data = view.li_getData();

  if(li_validation(data)) {
    view.showOutput("li_","Logging in...");

    view.li_disabled("true");

    model.loginFormSubmission(data);
  }
}

function li_showResult(text) {
  if(model.loggedInId !== -1) {
    return;
  }

  if(text !== "0") {
    view.showOutput("li_","Success!")
    model.login(text)

    if(model.rememberMe) {
      localStorage.setItem("logged_in_id",text);
    }


    setTimeout(function() {view.switchVisible("login_container", "browse_container"); view.li_disabled(false); view.fullReset(); model.getPosts();}, 1000);
    //setTimeout(function() {window.location.href = "main.html"}, 1000);
  } else {
    view.showOutput("li_","Failed.");
    view.li_disabled(false);
  }
}

function mp_formSubmission(evt) {
  evt.preventDefault();

  let data = view.mp_getData();

  if(mp_validation(data)) {
    view.showOutput("mp_","Posting...");

    view.mp_disabled(true);


    model.makePostFormSubmission(data);
  }
}

function mp_showResult(text) {
  if(model.loggedInId === -1) {
    return;
  }

  if(text !== "0") {
    view.showOutput("mp_","Success!");

    view.clearPostDisplay();
    model.getRequestedPost(text);

    setTimeout(function() {view.switchVisible("makepost_container", "browse_container"); view.switchVisible("bp_content", "pd_content"); view.mp_disabled(false); view.clearForm("mp_");}, 1000);
  } else {
    view.showOutput("mp_","Failed.");
    view.mp_disabled(false);
  }

}

function ca_validation(data) {
  let username = data.username;
  let password = data.password;
  let cpassword = data.confirm_password;

  let errBefore = "<span style='color:red;'>";
  let errAfter = "</span><br/>"

  let errorMessage = "";

  if(username === "") {
    errorMessage += errBefore + "Please enter a username" + errAfter;
  } else if(username.length > 255) {
    errorMessage += errBefore + "Username too long" + errAfter;
  }

  if(password === "") {
    errorMessage += errBefore + "Please enter a password" + errAfter;
  } else if(password.length > 255) {
    errorMessage += errBefore + "Password too long" + errAfter;
  } else if(password !== cpassword) {
    errorMessage += errBefore + "Passwords do not match" + errAfter;
  }

  if(errorMessage !== "") {
    errorMessage = errorMessage.substring(0,errorMessage.length-5);
    errorMessage = "<div id='ca_error'>" + errorMessage + "</div>";
  }

  view.showOutput("ca_", errorMessage);

  return errorMessage === "";
}

function li_validation(data) {
  let username = data.username;
  let password = data.password;

  let errBefore = "<span style='color:red;'>";
  let errAfter = "</span><br/>"

  let errorMessage = "";

  if(username === "") {
    errorMessage += errBefore + "Please enter a username" + errAfter;
  } else if(username.length > 255) {
    errorMessage += errBefore + "Username too long" + errAfter;
  }

  if(password === "") {
    errorMessage += errBefore + "Please enter a password" + errAfter;
  } else if(password.length > 255) {
    errorMessage += errBefore + "Password too long" + errAfter;
  }

  if(errorMessage !== "") {
    errorMessage = errorMessage.substring(0,errorMessage.length-5);
    errorMessage = "<div id='li_error'>" + errorMessage + "</div>";
  }

  view.showOutput("li_", errorMessage);

  return errorMessage === "";
}

function mp_validation(data) {
  let title = data.title;
  let body = data.body;
  let img = data.img;

  let errBefore = "<span style='color:red;'>";
  let errAfter = "</span><br/>"

  let errorMessage = "";

  if(title === "") {
    errorMessage += errBefore + "Please enter a title" + errAfter;
  } else if(title.length > 255) {
    errorMessage += errBefore + "Title is too long" + errAfter;
  }

  if(body.length > 4000) {
    errorMessage += errBefore + "Body is too long" + errAfter;
  }

  if(img) {
    if(img.size > 1024*1024*1024) { // 1GB max - arbitrary number, really
      errorMessage += errBefore + "Image is too large" + errAfter;
    }

    if(!(img.type === "image/png" || img.type === "image/jpeg")) {
      errorMessage += errBefore + "Please upload an image file, accepted types are: png, jpeg" + errAfter;
    }
  }

  if(errorMessage !== "") {
    errorMessage = errorMessage.substring(0,errorMessage.length-5);
    errorMessage = "<div id='mp_error'>" + errorMessage + "</div>";
  }

  view.showOutput("mp_", errorMessage);

  return errorMessage === "";
}

function bp_showResult(json_response) {
  if(model.loggedInId === -1) {
    return;
  }

  if(!json_response) {
    model.getPosts();
    return;
  }

  view.showLoadingMessage(false);
  model.getPostInProgress = false;
  let allPosts = JSON.parse(json_response);

  for(let i=0; i<allPosts.length; i++) {
    let currentPostObj = {post_id:undefined, title:undefined, timestamp:undefined, username:undefined, hasImg:undefined};
    currentPostObj = allPosts[i];

    if(model.mostRecentTimestamp === "") {
      model.mostRecentTimestamp = currentPostObj.timestamp;
    }

    let onclick = "onclick=\"pd_browseLookup(" + currentPostObj.post_id + ");\"";
    view.appendPost(currentPostObj.post_id, model.constructBrowsePostContent(currentPostObj), onclick);
  }

  view.showLoadingMessage(true);

  if(model.isInitiallyFilling()) {
    if(view.isNotScroll()) {
      model.getPosts();
    } else {
      model.initialFillDone();
      model.newestPostsInterval = setInterval(()=>{model.getNewestPosts()}, 10000); //check for new posts every 10 secs
    }
  }
}

function bp_showNewest(json_response) {
  if(model.loggedInId === -1) {
    return;
  }

  if(!json_response) {
    return;
  }

  let scrollPosition = view.distanceFromBottom();

  let allPosts = JSON.parse(json_response);

  let currentPostObj = {post_id:undefined, title:undefined, timestamp:undefined, username:undefined, hasImg:undefined};

  for(let i=0; i<allPosts.length; i++) {
    currentPostObj = allPosts[i];

    let onclick = "onclick=\"pd_browseLookup(" + currentPostObj.post_id + ");\"";
    view.prependPost(currentPostObj.post_id, model.constructBrowsePostContent(currentPostObj), onclick);
  }

  model.mostRecentTimestamp = currentPostObj.timestamp; //the last post fetched
  view.scrollFromBottom(scrollPosition);

  view.displayNewPostMessage(true);
  setTimeout(()=>{view.displayNewPostMessage(false)}, 3000);
}

function infiniteScrollLookup() {
  if(view.hitBottom()) {
    if(model.getPostInProgress === false) {
      model.getPostInProgress = true;
      model.getPosts();

      if(model.gotAllPosts) {
        view.showNoMorePosts();
      }
    }
  }
}

function getLastPostDateAJAXHandler(text) {
  model.lastPostDate = new Date(text);
}

function clearNewPostMessage() {
  if(view.nearTop()) {
    view.displayNewPostMessage(false);
  }
}

function tryAutomaticLogin() {
  if(localStorage.getItem("logged_in_id")) {
    let id = localStorage.getItem("logged_in_id");
    model.login(id);
    view.switchVisible("login_container", "browse_container");
    model.getPosts();
  }
}

function pd_browseLookup(id) {
  view.clearPostDisplay();
  view.switchVisible("bp_content", "pd_content");
  model.getRequestedPost(id);
}

function pd_showResult(json_response) {
  if(model.loggedInId === -1) {
    return;
  }

  let currentPostObj = {post_id:undefined, text:undefined, title:undefined, timestamp:undefined, username:undefined, hasImg:undefined, comments:undefined};

  currentPostObj = JSON.parse(json_response);



  model.currentPostDetailsId = currentPostObj.post_id;
  clearInterval(model.newestCommentsInterval);
  model.newestCommentsInterval = setInterval(()=>{model.updateComments(currentPostObj.post_id)}, 10000);

  view.showPostDetails(currentPostObj.post_id, model.constructPostDetailsContent(currentPostObj));
  view.setUpHandler("pd_text", "input", ()=>{view.checkEnableCommentPostButton()});
  view.setUpHandler("pd_comment_form", "submit", pd_commentFormSubmission);

  if(currentPostObj.comments.length) {
    model.newestCommentTimestamp = currentPostObj.comments[0].timestamp;
  } else {
    model.newestCommentTimestamp = currentPostObj.timestamp; //if there are no comments just use the post timestamp to check for new comments
    view.showNoCommentsMessage(true);
  }


}

function pd_showNewComments(json_response) {
  model.commentSubmitUpdateInProgress -= 1;
  if(model.loggedInId === -1) {
    return;
  }

  if(!json_response) {
    return;
  }

  if(model.commentSubmitUpdateInProgress === 0) {
    view.showNoCommentsMessage(false);

    let allComments = JSON.parse(json_response);

    if(allComments[0].post_id !== model.currentPostDetailsId) {
      return;
    }

    let currentPostObj = {text:undefined, timestamp:undefined, username:undefined};
    for(let i=0; i<allComments.length; i++) {
      currentPostObj = allComments[i];

      view.prependComment(model.constructCommentContent(currentPostObj));
    }

    model.newestCommentTimestamp = currentPostObj.timestamp; //the last comment fetched
  }
}

function pd_commentFormSubmission(evt) {
  evt.preventDefault();

  let data = view.pd_getCommentData();

  model.makeCommentFormSubmission(data);
  view.pd_disabled(true);
}

function pd_commentShowResult(text) {
  view.pd_disabled(false);

  if(text === "1") {
    view.clearCommentForm();
    view.checkEnableCommentPostButton();
    model.updateComments(model.currentPostDetailsId);
  }
}

function getFirstPostDateAJAXHandler(text) {
  model.firstPostDate = new Date(text);
}

function allHandlers() {
  model.setUsernameLookupAJAXHandler(ca_usernameLookupResponseHandler);
  model.setCreateAccountAJAXHandler(ca_showResult)
  model.setLoginAJAXHandler(li_showResult);
  model.setMakePostAJAXHandler(mp_showResult);
  model.setGetPostsAJAXHandler(bp_showResult);
  model.setGetLastPostDateAJAXHandler(getLastPostDateAJAXHandler);
  model.setGetNewestPostsAJAXHandler(bp_showNewest);
  model.setGetRequestedPostAJAXHandler(pd_showResult);
  model.setUpdateCommentsAJAXHandler(pd_showNewComments);
  model.setMakeCommentAJAXHandler(pd_commentShowResult);
  model.setGetFirstPostDateAJAXHandler(getFirstPostDateAJAXHandler);

  view.setUpHandler("ca_username", "change", ca_usernameChangeHandler);
  view.setUpHandler("ca_form", "submit", ca_formSubmission);
  view.setUpHandler("li_form", "submit", li_formSubmission);
  view.setUpHandler("mp_form", "submit", mp_formSubmission);

  view.setUpHandler("ca_form", "change", () => {view.clearError("ca_")});
  view.setUpHandler("li_form", "change", () => {view.clearError("li_")});
  view.setUpHandler("mp_form", "change", () => {view.clearError("mp_")});

  view.setUpHandler("ca_show_password", "click", () => {view.ca_showPasswordToggle()});
  view.setUpHandler("li_show_password", "click", () => {view.li_showPasswordToggle()});

  view.setUpHandler("scrollingElement", "scroll", () =>{clearNewPostMessage(); infiniteScrollLookup();});

  view.setUpHandler("newPopup", "click", ()=>{view.scrollTop()});

  // view.setUpHandler("temp_login", "click", () => {view.switchVisible("login_container", "browse_container")});
  view.setUpHandler("temp_acc", "click", (ev) => {ev.preventDefault(); view.switchVisible("li_content", "ca_content")});
  view.setUpHandler("temp_golog", "click", (ev) => {ev.preventDefault(); view.switchVisible("ca_content", "li_content")});
  view.setUpHandler("temp_logout1", "click", (ev) => {ev.preventDefault(); model.logout(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post1", "click", (ev) => {ev.preventDefault(); view.switchVisible("browse_container", "makepost_container")});
  // view.setUpHandler("temp_details", "click", (ev) => {ev.preventDefault(); view.switchVisible("bp_content", "pd_content")});
  view.setUpHandler("temp_totop", "click", (ev) => {ev.preventDefault(); view.scrollTop();});
  view.setUpHandler("temp_logout2", "click", (ev) => {ev.preventDefault(); model.logout(); view.logout_showBrowse(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post2", "click", (ev) => {ev.preventDefault(); view.switchVisible("browse_container", "makepost_container")});
  view.setUpHandler("temp_browse", "click", (ev) => {ev.preventDefault(); view.switchVisible("pd_content", "bp_content")});
  view.setUpHandler("temp_logout3", "click", (ev) => {ev.preventDefault(); model.logout(); view.logout_showBrowse(); view.switchVisible("makepost_container", "login_container")});
  view.setUpHandler("temp_main", "click", (ev) => {ev.preventDefault(); view.switchVisible("makepost_container", "browse_container")});
}

allHandlers();
model.getLastPostDate();
model.getFirstPostDate();
tryAutomaticLogin();

