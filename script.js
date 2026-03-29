const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Данные из полей формы
    const formData = {
        name: this.name.value,
        text: this.text.value
    };

    try {
        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.ok) {
            alert("Отзыв успешно отправлен в Telegram!");
            form.reset();
        } else {
            alert("Ошибка сервера: " + (result.description || "Неизвестная ошибка"));
        }
    } catch (error) {
        alert("Ошибка сети. Проверьте соединение или настройки Vercel.");
    }
});
