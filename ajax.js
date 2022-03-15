function doAJAXPOST(url, formData, handler){
  // Initialize the HTTP request.
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) { // 4 means the request is finished, 200 means the request was successful
      //execute the given function once the response is received
      handler(xhr.responseText);
    }
  }

  // Send the request

  xhr.send(formData);
}


function doAJAXGET(url, params, handler) {
  // Initialize the HTTP request.
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url+params);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) { // 4 means the request is finished, 200 means the request was successful
      //execute the given function once the response is received
      handler(xhr.responseText);
    }
  }

  // Send the request

  xhr.send();
}