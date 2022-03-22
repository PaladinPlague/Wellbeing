'use strict';

/* global Model, View */

const model = new Model();
const view = new View();


function ca_usernameChangeHandler() {
  console.log("Change");
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
    console.log(model.impatient);
    if(model.impatient) {
      view.autoSubmitCreate();
      model.impatient = false;
    }
  }

}

function ca_formSubmission(evt) {
  evt.preventDefault();
  let username = view.ca_getUsername();
  let password = view.ca_getPassword();

  if(model.freeUsername === "") {
    if (model.usernameLookupInProgress === 0) {
      view.ca_showOutput("Username taken.");
      return;
    } else {
      view.ca_showOutput("Please wait...");
      model.impatient = true;
      return;
    }
  }

  view.ca_showOutput("Creating account...");

  view.ca_disabled(true);

  model.createAccountFormSubmission(username, password);
}

function ca_showResult(response) {
  if(response === "1") {
    view.ca_showOutput("Success!")
    model.freeUsername = "";
    setTimeout(function() {console.log("login.html"); view.ca_disabled(false);}, 1000);
    //setTimeout(function() {window.location.href = "login.html"}, 1000);
  } else {
    view.ca_showOutput("Failed.");
    view.ca_disabled(false);
  }

}

function li_formSubmission(evt) {
  evt.preventDefault();
  view.li_showOutput("Logging in...");

  let username = view.li_getUsername();
  let password = view.li_getPassword();

  view.li_disabled("true");

  model.loginFormSubmission(username, password);
}

function li_showResult(text) {
  if(text !== "0") {
    view.li_showOutput("Success!")
    model.setLoggedInId(text)
    setTimeout(function() {console.log("main.html"); view.li_disabled(false);}, 1000);
    //setTimeout(function() {window.location.href = "main.html"}, 1000);
  } else {
    view.li_showOutput("Failed.");
    view.li_disabled(false);
  }

}

model.setUsernameLookupAJAXHandler(ca_usernameLookupResponseHandler);
model.setCreateAccountAJAXHandler(ca_showResult)
model.setLoginAJAXHandler(li_showResult);
view.setUpUsernameChangeHandler(ca_usernameChangeHandler);
view.setUpCreateFormSubmissionHandler(ca_formSubmission);
view.setUpLoginFormSubmissionHandler(li_formSubmission);


document.getElementById("red_link").addEventListener("click", () => {view.switchWindow("red_content");});
document.getElementById("green_link").addEventListener("click", () => {view.switchWindow("green_content");});
document.getElementById("blue_link").addEventListener("click", () => {view.switchWindow("blue_content");});

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

