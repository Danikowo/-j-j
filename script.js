const form = document.getElementById("form");

form.addEventListener("submit", formSend);

// Теперь адрес — это путь к твоему секретному файлу на Vercel
const API_URL = "/api/send-message"; 

async function formSend(event) {
    event.preventDefault();

    // Собираем данные из полей формы
    // Убедись, что в HTML у <input> есть name="name", а у <textarea> name="text"
    const formData = {
        name: this.name.value,
        text: this.text.value
    };

    // Отправляем данные на твой сервер Vercel
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.ok) {
        alert("Отзыв успешно отправлен!");
        form.reset();
    } else {
        alert("Ошибка при отправке. Попробуйте позже.");
    }
}
