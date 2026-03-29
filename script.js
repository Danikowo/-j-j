const form = document.getElementById("form");
const submitBtn = form.querySelector("#post");

form.addEventListener("submit", formSend);
const TOKEN = "8795571337:AAESgBTvz4S1hg8iagCb77qLMX05vOkwuBQ";
const CHAT_ID = "5502948313";
const API_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const API_URL = "/api/send-message"; 

async function formSend(event) {
    event.preventDefault();
    const messageData = {
        name: this.name.value,
        text: this.text.value
    };

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(messageData),
    });
	const result = await response.json();
	if (result.ok) {
		alert("отправлено");
		form.reset();
	} else alert("не отправлено");
}
