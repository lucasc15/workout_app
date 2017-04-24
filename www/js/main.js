 
var initialize = function() {
  oStatus = document.getElementById("test");
  oStatus.innerHTML = "Connected!";
  oStatus.style.color = "green";
  console.log("Got here!");
}

document.addEventListener("deviceready", initialize, false);