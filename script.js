const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById("tg");
    const textInput = document.getElementById("text");
    const photoInput = document.getElementById("photo");

    // Блокируем кнопку, чтобы видеть, что процесс пошел
    submitBtn.disabled = true;
    submitBtn.textContent = "ЧИТАЮ ФАЙЛ...";

    // Создаем FormData
    const formData = new FormData();
    formData.append("text", textInput.value);
    
    // Проверяем, выбрал ли пользователь файл
    if (photoInput.files && photoInput.files[0]) {
        formData.append("photo", photoInput.files[0]);
        console.log("Файл обнаружен:", photoInput.files[0].name);
    }

    try {
        submitBtn.textContent = "ОТПРАВЛЯЮ...";
        
        const response = await fetch("/api/send-message", {
            method: "POST",
            body: formData
            // Важно: заголовки НЕ СТАВИМ, браузер сам настроит multipart/form-data
        });

        // Пытаемся прочитать ответ
        const result = await response.json();
        console.log("Результат от сервера:", result);

        if (result.ok) {
            alert("✅ Успешно отправлено в Telegram!");
            form.reset();
        } else {
            alert("❌ Ошибка от бота: " + (result.description || "неизвестно"));
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
        alert("🚨 Ошибка соединения. Возможно, файл слишком большой.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "ОТПРАВИТЬ В ГРУППУ";
    }
});

// Логика темы (оставляем без изменений)
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
    const isLight = document.documentElement.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
});
