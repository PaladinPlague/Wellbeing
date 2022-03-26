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

  if(text === "1") {
    view.showOutput("mp_","Success!");
    //TODO lookup details for the post that was just posted
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

    view.appendPost(currentPostObj.post_id, model.constructBrowsePostContent(currentPostObj));
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
    console.log(model.mostRecentTimestamp);
    return;
  }

  let scrollPosition = view.distanceFromBottom();

  let allPosts = JSON.parse(json_response);

  let currentPostObj = {post_id:undefined, title:undefined, timestamp:undefined, username:undefined, hasImg:undefined};

  for(let i=0; i<allPosts.length; i++) {
    currentPostObj = allPosts[i];
    view.prependPost(currentPostObj.post_id, model.constructBrowsePostContent(currentPostObj));
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

function allHandlers() {
  model.setUsernameLookupAJAXHandler(ca_usernameLookupResponseHandler);
  model.setCreateAccountAJAXHandler(ca_showResult)
  model.setLoginAJAXHandler(li_showResult);
  model.setMakePostAJAXHandler(mp_showResult);
  model.setGetPostsAJAXHandler(bp_showResult);
  model.setGetLastPostDateAJAXHandler(getLastPostDateAJAXHandler);
  model.setGetNewestPostsAJAXHandler(bp_showNewest);

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

  // view.setUpHandler("temp_login", "click", () => {view.switchVisible("login_container", "browse_container")});
  view.setUpHandler("temp_acc", "click", (ev) => {ev.preventDefault(); view.switchVisible("li_content", "ca_content")});
  view.setUpHandler("temp_golog", "click", (ev) => {ev.preventDefault(); view.switchVisible("ca_content", "li_content")});
  view.setUpHandler("temp_logout1", "click", (ev) => {ev.preventDefault(); model.logout(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post1", "click", (ev) => {ev.preventDefault(); view.switchVisible("browse_container", "makepost_container")});
  view.setUpHandler("temp_details", "click", (ev) => {ev.preventDefault(); view.switchVisible("bp_content", "pd_content")});
  view.setUpHandler("temp_totop", "click", (ev) => {ev.preventDefault(); view.scrollTop();});
  view.setUpHandler("temp_logout2", "click", (ev) => {ev.preventDefault(); model.logout(); view.logout_showBrowse(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post2", "click", (ev) => {ev.preventDefault(); view.switchVisible("browse_container", "makepost_container")});
  view.setUpHandler("temp_browse", "click", (ev) => {ev.preventDefault(); view.switchVisible("pd_content", "bp_content")});
  view.setUpHandler("temp_logout3", "click", (ev) => {ev.preventDefault(); model.logout(); view.logout_showBrowse(); view.switchVisible("makepost_container", "login_container")});
  view.setUpHandler("temp_main", "click", (ev) => {ev.preventDefault(); view.switchVisible("makepost_container", "browse_container")});
}

allHandlers();
model.getLastPostDate();