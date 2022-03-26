'use strict';

class View {
  constructor() {
    this.checkmarkElement = document.getElementById("username_free_checkmark");
  }

  checkmark(action) {
    if(action === "hide") {
      this.checkmarkElement.style.visibility = "hidden";
    } else if(action === "show") {
      this.checkmarkElement.style.visibility = "visible";
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

  append_post(id, content) {
    document.getElementById("scrollingElement").innerHTML += "<div class='displayed_post' id='" + id + "'>" + content + "</div>";
  }
}