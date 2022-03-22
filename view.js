'use strict';

class View {
  constructor() {
    this.checkmarkElement = document.getElementById("username_free_checkmark");
    this.ca_outputElement = document.getElementById("ca_output");
    this.li_outputElement = document.getElementById("li_output");
    this.shown = document.getElementById("blue_content");
  }

  checkmark(action) {
    if(action === "hide") {
      this.checkmarkElement.style.visibility = "hidden";
    } else if(action === "show") {
      this.checkmarkElement.style.visibility = "visible";
    }
  }

  ca_getUsername() {
    return document.getElementById("ca_username").value;
  }

  ca_getPassword() {
    return document.getElementById("ca_password").value;
  }

  setUpUsernameChangeHandler(handler) {
    document.getElementById("ca_username").addEventListener("change", handler);
  }

  ca_showOutput(text) {
    this.ca_outputElement.innerHTML = text;
  }

  li_showOutput(text) {
    this.li_outputElement.innerHTML = text;
  }

  setUpCreateFormSubmissionHandler(handler) {
    document.getElementById("createAccountForm").addEventListener("submit", handler);
  }

  li_getUsername() {
    return document.getElementById("li_username").value
  }

  li_getPassword() {
    return document.getElementById("li_password").value
  }

  setUpLoginFormSubmissionHandler(handler) {
    document.getElementById("loginForm").addEventListener("submit", handler);
  }

  switchWindow(div_id) {
    this.shown.style.display = "none";
    this.shown = document.getElementById(div_id);
    this.shown.style.display = "block";
  }

  autoSubmitCreate() {
    document.getElementById("createAccountForm").dispatchEvent(new Event("submit"));
  }

  ca_disabled(bool) {
    document.getElementById("ca_username").disabled = bool;
    document.getElementById("ca_password").disabled = bool;
    document.getElementById("ca_confirm_password").disabled = bool;
  }

  li_disabled(bool) {
    document.getElementById("li_username").disabled = bool;
    document.getElementById("li_password").disabled = bool;
  }



}