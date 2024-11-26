document.addEventListener('DOMContentLoaded', () => {

    // Обработка выбора услуг
    const serviceButtons = document.querySelectorAll('.service-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active'); // Переключение активного состояния
        });
    });

    // Обработка отправки формы
    document.getElementById('order-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращение стандартной отправки формы

        // Собираем данные формы
        const fio = document.getElementById('fio').value;
        const car = document.getElementById('car').value;
        const address = document.getElementById('address').value;

        // Получаем выбранные услуги
        const selectedServices = Array.from(serviceButtons)
                                      .filter(btn => btn.classList.contains('active'))
                                      .map(btn => btn.dataset.service);

        const additional = document.getElementById('additional').value;

        // Проверка обязательных полей
        if (!fio || !car || !address || selectedServices.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        // Обработка данных (например, отправка на сервер или отображение сообщения)
        alert(`Форма успешно отправлена! Услуги выбраны: ${selectedServices.join(', ')}`);

        // Здесь можно добавить логику для отправки данных на сервер
        // Например, с использованием fetch() для AJAX-запроса.

        console.log({
            fio,
            car,
            address,
            services: selectedServices,
            additional
        });

        // Очистка формы после успешной отправки (по желанию)
        this.reset();
        serviceButtons.forEach(btn => btn.classList.remove('active'));

    });
});