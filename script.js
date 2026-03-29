const form = document.getElementById("form");
const submitBtn = form.querySelector("#post");

document.querySelector("#post").addEventListener("submit", async e => {
	e.preventDefault();

	const formData = new FormData(form);
	formData.append("access_key", "79c7c414-d0dd-42f7-9023-12d77023a182");

	const originalText = submitBtn.textContent;

	submitBtn.textContent = "Sending...";
	submitBtn.disabled = true;

	try {
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (response.ok) {
			alert("Success! Your message has been sent.");
			form.reset();
		} else {
			alert("Error: " + data.message);
		}
	} catch (error) {
		alert("Something went wrong. Please try again.");
	} finally {
		submitBtn.textContent = originalText;
		submitBtn.disabled = false;
	}
});

document.getElementById("tg").addEventListener("submit", formSend);

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
