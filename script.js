// --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
const themeToggle = document.getElementById("theme-toggle");

const updateThemeIcon = () => {
    const isLight = document.documentElement.classList.contains("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
};

// 1. При загрузке проверяем сохраненную тему
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
}
updateThemeIcon();

// 2. Переключение по клику
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

    // Блокируем кнопку
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

// Если сервер вернул ошибку, сначала читаем её как текст
if (!response.ok) {
    const errorText = await response.text();
    console.error("Ответ сервера:", errorText);
    throw new Error("Сервер вернул ошибку. Проверь логи в панели Vercel.");
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            alert("✅ Успешно отправлено в Telegram!");
            form.reset();
        } else {
            alert("❌ Ошибка: " + (result.description || "Неизвестная ошибка сервера"));
        }

    } catch (error) {
        console.error("Ошибка при отправке:", error);
        alert("🚨 Ошибка сети: проверьте соединение или размер файла");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "ОТПРАВИТЬ В ГРУППУ";
    }
});
