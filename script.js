const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const btn = document.getElementById("tg");
    
    // Собираем данные формы напрямую
    const formData = new FormData(form);

    btn.disabled = true;
    btn.textContent = "ОТПРАВКА...";

    try {
        const response = await fetch("/api/send-message", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.ok) {
            alert("✅ Успешно отправлено с фото!");
            form.reset();
        } else {
            alert("❌ Ошибка Telegram: " + (result.description || "неизвестно"));
        }
    } catch (e) {
        alert("🚨 Ошибка сети: файл слишком велик или нет связи");
    } finally {
        btn.disabled = false;
        btn.textContent = "ОТПРАВИТЬ В ГРУППУ";
    }
});
