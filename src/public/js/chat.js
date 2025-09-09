const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector('form');
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message, isMine = false) {
    console.log(`message:${message} isMine:${isMine}`)
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    if (isMine) {
        li.classList.add("me");
    }
    ul.append(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const message = input.value.trim();
    socket.emit("message", input.value, roomName, () => {
        addMessage(`${message}`, true);
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
    h3.innerText = `Room: ${roomName}`;
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

function setRoomName(roomName, userCount) {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${userCount})`;
}

socket.on("welcome", (user, userCount) => {
    setRoomName(roomName, userCount);
    addMessage(`\`${user}\`님이 방에 들어왔습니다.`);
})


socket.on("bye", (user, userCount) => {
    setRoomName(roomName, userCount);
    addMessage(`\`${user}\`님이 방을 나갔습니다.`);
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


