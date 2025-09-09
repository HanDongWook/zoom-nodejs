const socket = io();

const chatWelcome = document.getElementById("chatWelcome");
const form = chatWelcome.querySelector('form');
const chatRoom = document.getElementById("chatRoom");

chatRoom.hidden = true;

let chatRoomName;

function addMessage(message, isMine = false) {
    console.log(`message:${message} isMine:${isMine}`)
    const ul = chatRoom.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    if (isMine) {
        li.classList.add("me");
    }
    ul.append(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = chatRoom.querySelector("#msg input");
    const message = input.value.trim();
    socket.emit("message", input.value, chatRoomName, () => {
        addMessage(`${message}`, true);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = chatRoom.querySelector("#name input");
    const nickname = input.value.trim();
    socket.emit("nickname", nickname);
}

function showRoom() {
    chatWelcome.hidden = true;
    chatRoom.hidden = false;
    const h3 = chatRoom.querySelector("h3");
    h3.innerText = `Room: ${chatRoomName}`;
    const msgForm = chatRoom.querySelector("#msg");
    const nameForm = chatRoom.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);

}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    const inputRoomName = input.value.trim();
    socket.emit("enter_room", inputRoomName, showRoom);
    chatRoomName = inputRoomName;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);

function setRoomName(chatRoomName, userCount) {
    const h3 = chatRoom.querySelector("h3");
    h3.innerText = `Room ${chatRoomName} (${userCount})`;
}

socket.on("welcome", (user, userCount) => {
    setRoomName(chatRoomName, userCount);
    addMessage(`\`${user}\`님이 방에 들어왔습니다.`);
})


socket.on("bye", (user, userCount) => {
    setRoomName(chatRoomName, userCount);
    addMessage(`\`${user}\`님이 방을 나갔습니다.`);
})

socket.on("message", addMessage);

socket.on("room_change", (chatRooms) => {
    const roomList = chatWelcome.querySelector("ul");
    roomList.innerHTML = "";
    if(chatRooms.length === 0) {
        return;
    }
    chatRooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});


