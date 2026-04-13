// --- ЛОГИКА ТЕМЫ ---
const themeToggle = document.getElementById("theme-toggle");

// Функция обновления иконки
const updateIcon = () => {
    themeToggle.textContent = document.documentElement.classList.contains("light-theme") ? "☀️" : "🌙";
};

// Проверяем сохраненную тему при загрузке
updateIcon();

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
    const isLight = document.documentElement.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateIcon();
});

// --- ЛОГИКА ОТПРАВКИ ФОРМЫ ---
const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const textInput = document.getElementById("text");
    const photoInput = document.getElementById("photo");
    const submitBtn = document.getElementById("tg");

    // Блокируем кнопку, чтобы не нажали дважды
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    // Используем FormData для поддержки передачи файлов
    const formData = new FormData();
    formData.append("text", textInput.value);
    
    if (photoInput.files[0]) {
        formData.append("photo", photoInput.files[0]);
    }

    try {
        const response = await fetch("/api/send-message", {
            method: "POST",
            body: formData
            // Заголовки Content-Type ставить не нужно, браузер сделает это сам
        });

        const result = await response.json();

        if (result.ok) {
            alert("✅ Отправлено анонимно!");
            form.reset();
        } else {
            alert("❌ Ошибка: " + (result.description || "Не удалось отправить"));
        }
    } catch (error) {
        console.error(error);
        alert("🚨 Ошибка сети. Проверьте размер фото или Vercel Logs.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить в группу";
    }
});
