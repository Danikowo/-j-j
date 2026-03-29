const form = document.getElementById("form");
const submitBtn = form.querySelector("#post");

form.addEventListener("submit", formSend);
const TOKEN = "8795571337:AAESgBTvz4S1hg8iagCb77qLMX05vOkwuBQ";
const CHAT_ID = "5502948313";
const API_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

async function formSend(event) {
	event.preventDefault();
	let message = `Отзыв от $(this.name.value)\n${this.text.value}`;
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chat_id: CHAT_ID,
			text: message,
		}),
	});
	const result = await response.json();
	if (result.ok) {
		alert("отправлено");
		form.reset();
	} else alert("не отправлено");
}
