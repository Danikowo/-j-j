const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // 1. Собираем данные
    const formData = {
        name: this.name.value,
        text: this.text.value
    };

    console.log("Отправка данных...", formData);

    try {
        // 2. Делаем запрос к твоему серверу на Vercel
        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        // 3. Ждем ответ от сервера
        const result = await response.json();
        console.log("Ответ сервера:", result);

        if (result.ok) {
            // ТОЛЬКО ЕСЛИ ВСЁ ОТПРАВЛЕНО
            alert("✅ Сообщение доставлено в Telegram!");
            form.reset(); 
        } else {
            // Если Telegram вернул ошибку (например, неверный ID или токен)
            alert("❌ Ошибка Telegram: " + (result.description || "проверьте токен"));
        }

    } catch (error) {
        // Если вообще не удалось достучаться до сервера
        console.error(error);
        alert("🚨 Критическая ошибка: проверьте соединение или Vercel Logs");
    }
});
