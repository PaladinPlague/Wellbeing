'use strict';

class View {
  constructor() {

  }

  checkmark(action) {
    let checkmarkElement = document.getElementById("username_free_checkmark");

    if(action === "hide") {
      checkmarkElement.style.visibility = "hidden";
    } else if(action === "show") {
      checkmarkElement.style.visibility = "visible";
    }
  }

  ca_getData() {
    let data = {};
    data["username"] = document.getElementById("ca_username").value;
    data["password"] = document.getElementById("ca_password").value;
    data["confirm_password"] = document.getElementById("ca_confirm_password").value;

    return data;
  }

  ca_getUsername() {
    return document.getElementById("ca_username").value;
  }


  showOutput(prefix,text) {
    document.getElementById(prefix+"output").innerHTML = text;
  }


  li_getData() {
    let data = {};
    data["username"] = document.getElementById("li_username").value;
    data["password"] = document.getElementById("li_password").value;
    data["remember_me"] = document.getElementById("li_remember_me").checked;

    return data;
  }

  switchVisible(hideIt, showIt) {
    document.getElementById(hideIt).style.display = "none";
    document.getElementById(showIt).style.display = "block";
  }

  autoSubmitCreate() {
    document.getElementById("ca_form").dispatchEvent(new Event("submit"));
  }

  ca_disabled(bool) {
    document.getElementById("ca_username").disabled = bool;
    document.getElementById("ca_password").disabled = bool;
    document.getElementById("ca_confirm_password").disabled = bool;
    document.getElementById("ca_submit").disabled = bool;
  }

  li_disabled(bool) {
    document.getElementById("li_username").disabled = bool;
    document.getElementById("li_password").disabled = bool;
    document.getElementById("li_submit").disabled = bool;
  }

  mp_getData() {
    let data = {};
    data["title"] = document.getElementById("mp_title").value;
    data["body"] = document.getElementById("mp_body").value;
    data["anon"] = document.getElementById("mp_anon").checked ? "1" : "0";
    data["img"] = document.getElementById("mp_img").files[0];

    return data;
  }

  mp_disabled(bool) {
    document.getElementById("mp_title").disabled = bool;
    document.getElementById("mp_body").disabled = bool;
    document.getElementById("mp_img").disabled = bool;
    document.getElementById("mp_anon").disabled = bool;
    document.getElementById("mp_submit").disabled = bool;
  }

  clearError(prefix) {
    let errorElement = document.getElementById(prefix+"error");
    if(errorElement) {
      errorElement.remove();
    }

  }

  setUpHandler(elementName, event, handler) {
    document.getElementById(elementName).addEventListener(event, handler);
  }

  ca_showPasswordToggle() {
    let passwordElement = document.getElementById("ca_password");
    let confirmPasswordElement = document.getElementById("ca_confirm_password");
    if(passwordElement.type==="password") {
      passwordElement.type = "text";
      confirmPasswordElement.type = "text";
    } else {
      passwordElement.type = "password";
      confirmPasswordElement.type = "password";
    }
  }

  li_showPasswordToggle() {
    let passwordElement = document.getElementById("li_password");
    if(passwordElement.type==="password") {
      passwordElement.type = "text";
    } else {
      passwordElement.type = "password";
    }
  }

  clearForm(prefix) {
    document.getElementById(prefix+"form").reset();
    this.showOutput(prefix, "");
  }

  logout_showBrowse() {
    document.getElementById("pd_content").style.display = "none";
    document.getElementById("bp_content").style.display = "block";
  }

  appendPost(id, content, onclick) {
    document.getElementById("scrollingElement").innerHTML += "<div class='displayed_post' id='bp_" + id + "' " + onclick + ">" + content + "</div>";
  }

  isNotScroll() {
    let se = document.getElementById("scrollingElement");
    return se.clientHeight >= se.scrollHeight;
  }

  hitBottom() {
    let element = document.getElementById("scrollingElement");
    return element.scrollHeight -(element.scrollTop + element.clientHeight) <= 1;
  }

  scrollTop() {
    document.getElementById("scrollingElement").scrollTop = 0;
  }

  displayNewPostMessage(displayIt) {
    let newPostMessageElement = document.getElementById("newPopup");

    if(displayIt) {
      this.newPostMessageDisplayed = true;
      newPostMessageElement.style.display = "block";
    } else {
      this.newPostMessageDisplayed = false;
      newPostMessageElement.style.display = "none";
    }
  }

  prependPost(id, content, onclick) {
    let se = document.getElementById("scrollingElement");
    se.innerHTML = "<div class='displayed_post' id='bp_" + id + "' " + onclick + ">" + content + "</div>" + se.innerHTML;
  }

  distanceFromBottom() {
    let se = document.getElementById("scrollingElement");
    return se.scrollHeight-se.scrollTop;
  }

  scrollFromBottom(distance) {
    let se = document.getElementById("scrollingElement");
    se.scrollTo(0, se.scrollHeight - distance);
  }

  nearTop() {
    return document.getElementById("scrollingElement").scrollTop <= 5;
  }

  clearBrowseContent() {
    document.getElementById("scrollingElement").innerHTML = "<div id=\"status_message\">Loading...</div>";
    document.getElementById("post_details_display").innerHTML = "";
  }

  fullReset() {
    this.clearForm("ca_");
    this.clearForm("li_");
    this.checkmark("hide");
    this.clearForm("mp_");
    this.clearBrowseContent();
  }

  showLoadingMessage(show) {
    if(show) {
      document.getElementById("scrollingElement").innerHTML += "<div id=\"status_message\">Loading...</div>";
    } else {
      document.getElementById("status_message").remove();
    }
  }

  showNoMorePosts() {
    document.getElementById("status_message").innerHTML = "No more posts!";
  }

  clearPostDisplay() {
    document.getElementById("post_details_display").innerHTML = "";
  }

  showPostDetails(id, content) {
    document.getElementById("post_details_display").innerHTML = "<div class='displayed_post_details' id='pd_" + id + "'>" + content + "</div>";
  }

  prependComment(content) {
    let cc = document.getElementById("comments_container");

    cc.innerHTML = content + cc.innerHTML;
  }
}