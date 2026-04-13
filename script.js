// --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
const themeToggle = document.getElementById("theme-toggle");

// Функция для обновления иконки кнопки
const updateThemeIcon = () => {
    const isLight = document.documentElement.classList.contains("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
};

// Вызываем один раз при загрузке
updateThemeIcon();

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
    const isLight = document.documentElement.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon();
});

// --- ЛОГИКА ОТПРАВКИ ФОРМЫ ---
const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("tg");
    const textInput = document.getElementById("text");
    const photoInput = document.getElementById("photo");

    // Блокируем кнопку, чтобы избежать повторных нажатий
    submitBtn.disabled = true;
    submitBtn.textContent = "ОТПРАВКА...";

    // Создаем объект FormData для отправки данных (текст + файл)
    const formData = new FormData();
    formData.append("text", textInput.value);
    
    // ВАЖНО: Берем именно ПЕРВЫЙ файл из списка выбранных [0]
    if (photoInput.files && photoInput.files[0]) {
        formData.append("photo", photoInput.files[0]);
    }

    try {
        // Отправляем запрос на твой сервер Vercel
        const response = await fetch("/api/send-message", {
            method: "POST",
            // Заголовки ставить НЕ НУЖНО, браузер сам настроит multipart/form-data
            body: formData
        });

        // Проверяем, что сервер вообще ответил
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка сервера");
        }

        const result = await response.json();

        if (result.ok) {
            alert("✅ Успешно отправлено в Telegram!");
            form.reset(); // Очищаем форму
            updateThemeIcon(); // Возвращаем иконку, если форма сбросилась
        } else {
            alert("❌ Ошибка Telegram: " + (result.description || "неизвестная ошибка"));
        }

    } catch (error) {
        console.error("Ошибка при отправке:", error);
        alert("🚨 Ошибка сети: файл слишком велик или сервер недоступен");
    } finally {
        // Разблокируем кнопку в любом случае
        submitBtn.disabled = false;
        submitBtn.textContent = "ОТПРАВИТЬ В ГРУППУ";
    }
});
