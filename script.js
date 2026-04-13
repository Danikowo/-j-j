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
const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

// 1. Проверяем, была ли сохранена тема ранее
if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "☀️"; // Иконка для светлой
} else {
    themeToggle.textContent = "🌙"; // Иконка для темной
}

// 2. Слушаем клик по кнопке
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    
    let theme = "dark";
    if (document.body.classList.contains("light-theme")) {
        theme = "light";
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
    
    // 3. Сохраняем выбор пользователя
    localStorage.setItem("theme", theme);
});
const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // Создаем объект FormData (он сам соберет текст и файл)
    const formData = new FormData();
    formData.append("text", document.getElementById("text").value);
    formData.append("photo", document.getElementById("photo").files[0]); // Берем файл

    try {
        const response = await fetch("/api/send-message", {
            method: "POST",
            // Заголовок Content-Type ставить НЕ НУЖНО, браузер сделает это сам
            body: formData 
        });

        const result = await response.json();
        if (result.ok) {
            alert("✅ Отправлено с фото!");
            form.reset();
        } else {
            alert("❌ Ошибка: " + result.description);
        }
    } catch (error) {
        alert("🚨 Ошибка сети");
    }
});
