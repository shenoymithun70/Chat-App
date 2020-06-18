// const message = require("../../server/utils/message");

// const moment = require("./libs/moment");

let socket = io();

function scrollToBottom() {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView();
}
socket.on("connect", function () {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse(
    '{"' +
      decodeURI(searchQuery)
        .replace(/&/g, '","')
        .replace(/\+/g, " ")
        .replace(/=/g, '":"') +
      '"}'
  );
  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
  // console.log("Connected to server");
});
socket.on("disconnect", function () {
  console.log("Disconnected from server");
});

socket.on("updateUsersList", function (users) {
  let ol = document.createElement("ol");
  users.forEach(function (user) {
    let li = document.createElement("li");
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector("#users");
  usersList.innerHTML = "";
  usersList.appendChild(ol);
});

socket.on("newMessage", function (message) {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
  // const formattedTime = moment(message.createdAt).format("LT");
  // console.log("newMessage", message);
  // let li = document.createElement("li");
  // li.innerText = `${message.from}  ${formattedTime} : ${message.text}`;
  // document.querySelector("#messages").appendChild(li);
});

socket.on("newBuzzMessage", function (message) {
  const formattedTime = moment(message.createdAt).format("LTS");
  const template = document.querySelector("#buzz-message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });
  document.getElementById("buzz").disabled = true;
  setTimeout(() => {
    document.getElementById("buzz").disabled = false;
  }, 5000);
  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
});

socket.on("newLocationMessage", function (message) {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector("#location-message-template")
    .innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });

  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
  // console.log("newLocationMessage", message);
  // let li = document.createElement("li");
  // let a = document.createElement("a");
  // li.innerText = `${message.from}  ${formattedTime} `;
  // a.setAttribute("target", "_blank");
  // a.setAttribute("href", message.url);
  // a.innerText = "My current location";
  // li.appendChild(a);
  // document.querySelector("#messages").appendChild(li);
});

// socket.emit(
//   "createMessage",
//   {
//     from: "John",
//     text: "Hey",
//   },
//   function (message) {
//     console.log("Got it: ", message);
//   }
// );

document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      text: document.querySelector("input[name='message']").value,
    },
    function () {}
  );
  document.getElementById("message-form").reset();
});

// document
//   .querySelector("#send-location")
//   .addEventListener("click", function (e) {
//     if (!navigator.geolocation) {
//       return alert("Geo locaation is not supported by your browser.");
//     }
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         socket.emit("createLocationMessage", {
//           lat: position.coords.latitude,
//           lon: position.coords.longitude,
//         });
//       },
//       function () {
//         alert("unable to fetch location.");
//       }
//     );
//   });

document.querySelector("#buzz").addEventListener("click", function (e) {
  socket.emit(
    "createBuzzMessage",
    {
      text: "Has pressed the buzzer",
    },
    function () {}
  );

  // document.getElementById("unbuzz").disabled = false;
  // document.getElementById("buzz").disabled = true;
});
