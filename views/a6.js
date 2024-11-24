// Обработка отправки формы
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Останавливаем стандартное поведение отправки формы

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const registrationNumber = document.getElementById('registrationNumber').value;
    const vin = document.getElementById('vin').value;

    // Вывод введенных данных в консоль (или можно отправить на сервер)
    console.log(`Марка: ${brand}`);
    console.log(`Модель: ${model}`);
    console.log(`Год выпуска: ${year}`);
    console.log(`Гос номер: ${registrationNumber}`);
    console.log(`VIN номер: ${vin}`);

    alert("Автомобиль зарегистрирован!");
});