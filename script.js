// --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
const themeToggle = document.getElementById("theme-toggle");

// Функция для обновления иконки кнопки
const updateThemeIcon = () => {
    const isLight = document.documentElement.classList.contains("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
};

// ЧИТАЕМ СОХРАНЕННУЮ ТЕМУ ПРИ ЗАГРУЗКЕ
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
}
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

    submitBtn.disabled = true;
    submitBtn.textContent = "ОТПРАВКА...";

    const formData = new FormData();
    formData.append("text", textInput.value);
    
    if (photoInput.files && photoInput.files[0]) {
        formData.append("photo", photoInput.files[0]);
    }

    try {
        const response = await fetch("/api/send-message", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || "Ошибка сервера");
        }

        const result = await response.json();

        if (result.ok) {
            alert("✅ Успешно отправлено!");
            form.reset();
        } else {
            alert("❌ Ошибка Telegram: " + (result.description || "неизвестно"));
        }

    } catch (error) {
        console.error("Ошибка:", error);
        alert("🚨 " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "ОТПРАВИТЬ В ГРУППУ";
    }
});
