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

  model.createAccountFormSubmission(view.ca_getData());
}

function ca_showResult(response) {
  if(response === "1") {
    view.showOutput("ca_","Success!");
    model.freeUsername = "";
    setTimeout(function() {console.log("login.html"); view.ca_disabled(false);}, 1000);
    //setTimeout(function() {window.location.href = "login.html"}, 1000);
  } else {
    view.showOutput("ca_","Failed.");
    view.ca_disabled(false);
  }

}

function li_formSubmission(evt) {
  evt.preventDefault();
  view.showOutput("li_","Logging in...");


  view.li_disabled("true");

  model.loginFormSubmission(view.li_getData());

}

function li_showResult(text) {
  if(text !== "0") {
    view.showOutput("li_","Success!")
    model.setLoggedInId(text)
    setTimeout(function() {console.log("main.html"); view.li_disabled(false);}, 1000);
    //setTimeout(function() {window.location.href = "main.html"}, 1000);
  } else {
    view.showOutput("li_","Failed.");
    view.li_disabled(false);
  }
}

function mp_formSubmission(evt) {
  evt.preventDefault();
  view.showOutput("mp_","Posting...");

  view.mp_disabled(true);

  model.makePostFormSubmission(view.mp_getData());
}

function mp_showResult(text) {
  if(text === "1") {
    view.showOutput("mp_","Success!");
    setTimeout(function() {console.log("post_details.html"); view.mp_disabled(false);}, 1000);
  } else {
    view.showOutput("mp_","Failed.");
    view.mp_disabled(false);
    console.log(text);
  }

}

model.setUsernameLookupAJAXHandler(ca_usernameLookupResponseHandler);
model.setCreateAccountAJAXHandler(ca_showResult)
model.setLoginAJAXHandler(li_showResult);
model.setMakePostAJAXHandler(mp_showResult);

view.setUpUsernameChangeHandler(ca_usernameChangeHandler);
view.setUpCreateFormSubmissionHandler(ca_formSubmission);
view.setUpLoginFormSubmissionHandler(li_formSubmission);
view.setUpMakePostFormSubmissionHandler(mp_formSubmission);


document.getElementById("mp_link").addEventListener("click", () => {view.switchWindow("mp_content");});
document.getElementById("li_link").addEventListener("click", () => {view.switchWindow("li_content");});
document.getElementById("ca_link").addEventListener("click", () => {view.switchWindow("ca_content");});

// view.setUpCalculatorButtonsClickHandlers(calculatorButtonPressed);
// view.setUpGroupSizeButtonsClickHandlers(groupSizeButtonPressed);
// view.setUpTipButtonsClickHandlers(tipButtonPressed);
// view.setUpRoundButtonsClickHandlers(roundButtonPressed);
// view.setUpDropDownChangeHandlers(currencyDropDownSelected);
//
// view.setUpClickHandlerGeneric("settingsButton", () => {view.togglePopup();});
// view.setUpClickHandlerGeneric("xButton", () => {view.togglePopup();});
// view.setUpClickHandlerGeneric("popUpDarkenedBackground", () => {view.togglePopup();});
//
// view.populateRadioButtons("tip"+model.getTip(), "round"+model.getRound());
// view.populateCurrencyDropDowns(supportedCurrencies, model.getVisitingCurrency(), model.getHomeCurrency());

