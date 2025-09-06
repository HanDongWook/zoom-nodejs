const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector('form');
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const message = input.value.trim();
    socket.emit("message", input.value, roomName, () => {
        addMessage(`You: ${message}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    const nickname = input.value.trim();
    socket.emit("nickname", nickname);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);

}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    const inputRoomName = input.value.trim();
    socket.emit("enter_room", inputRoomName, showRoom);
    roomName = inputRoomName;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user}님이 방에 들어왔습니다.`);
})

socket.on("bye", (user) => {
    addMessage(`"${user}"님이 방을 나갔습니다.`);
})

socket.on("message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});


