'use strict';

/* global Model, View */

const model = new Model();
const view = new View();


function ca_usernameChangeHandler() {
  view.checkmark("hide");
  model.usernameLookup(view.ca_getUsername());
}

function ca_usernameLookupResponseHandler(response) {
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
  if(text !== "0") {
    view.showOutput("li_","Success!")
    model.login(text)
    setTimeout(function() {view.switchVisible("login_container", "browse_container"); view.li_disabled(false); view.clearForm("li_"); model.getPosts();}, 1000);
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

function allHandlers() {
  model.setUsernameLookupAJAXHandler(ca_usernameLookupResponseHandler);
  model.setCreateAccountAJAXHandler(ca_showResult)
  model.setLoginAJAXHandler(li_showResult);
  model.setMakePostAJAXHandler(mp_showResult);

  view.setUpHandler("ca_username", "change", ca_usernameChangeHandler);
  view.setUpHandler("ca_form", "submit", ca_formSubmission);
  view.setUpHandler("li_form", "submit", li_formSubmission);
  view.setUpHandler("mp_form", "submit", mp_formSubmission);

  view.setUpHandler("ca_form", "change", () => {view.clearError("ca_")});
  view.setUpHandler("li_form", "change", () => {view.clearError("li_")});
  view.setUpHandler("mp_form", "change", () => {view.clearError("mp_")});

  view.setUpHandler("ca_show_password", "click", () => {view.ca_showPasswordToggle()});
  view.setUpHandler("li_show_password", "click", () => {view.li_showPasswordToggle()});

  // view.setUpHandler("temp_login", "click", () => {view.switchVisible("login_container", "browse_container")});
  view.setUpHandler("temp_acc", "click", () => {view.switchVisible("li_content", "ca_content")});
  view.setUpHandler("temp_golog", "click", () => {view.switchVisible("ca_content", "li_content")});
  view.setUpHandler("temp_logout1", "click", () => {model.logout(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post1", "click", () => {view.switchVisible("browse_container", "makepost_container")});
  view.setUpHandler("temp_details", "click", () => {view.switchVisible("bp_content", "pd_content")});
  view.setUpHandler("temp_logout2", "click", () => {model.logout(); view.logout_showBrowse(); view.switchVisible("browse_container", "login_container")});
  view.setUpHandler("temp_post2", "click", () => {view.switchVisible("browse_container", "makepost_container")});
  view.setUpHandler("temp_browse", "click", () => {view.switchVisible("pd_content", "bp_content")});
  view.setUpHandler("temp_logout3", "click", () => {model.logout(); view.logout_showBrowse(); view.switchVisible("makepost_container", "login_container")});
  view.setUpHandler("temp_main", "click", () => {view.switchVisible("makepost_container", "browse_container")});
}

allHandlers();


function bp_showResult(json_response) {
  model.getPostInProgress = false;

  if(!json_response) {
    model.getPostInProgress = true;
    model.getPosts();
    return;
  }


  let allPosts = JSON.parse(json_response);

  for(let i=0; i<allPosts.length; i++) {
    let currentPostObj = {post_id:undefined, title:undefined, timestamp:undefined, username:undefined, hasImg:undefined};
    currentPostObj = allPosts[i];
    let currentPostContent = "<p>";

    currentPostContent += currentPostObj.title + "<br/>";
    currentPostContent += "By: " + currentPostObj.username + "<br/>";
    if(currentPostObj.hasImg) {
      currentPostContent += "<img alt='" + currentPostObj.title + "'  src='fetch_img.php?id=" + currentPostObj.post_id + "' >";
    }
    currentPostContent += "Posted: " + currentPostObj.timestamp +"</p>";


    view.append_post(currentPostObj.post_id, currentPostContent);
  }


  if(model.isInitiallyFilling()) {
    let se = document.getElementById("scrollingElement");
    let more = (se.clientHeight === se.scrollHeight);

    if(more) {
      model.getPosts();
    } else {
      model.initialFillDone();
      document.getElementById("scrollingElement").addEventListener("scroll", () =>{
        let element = document.getElementById("scrollingElement");
        if(element.scrollHeight -(element.scrollTop + element.clientHeight) <= 1 ) {
          infiniteScrollLookup();
        }
      })
    }
  }




}

model.setGetPostsAJAXHandler(bp_showResult);

function infiniteScrollLookup() {
  if(model.getPostInProgress === false) {
    model.getPostInProgress = true;
    model.getPosts();
  }
}

function getLastPostDateAJAXHandler(text) {
  model.lastPostDate = new Date(text);
}
model.setGetLastPostDateAJAXHandler(getLastPostDateAJAXHandler);

model.getLastPostDate();