document.getElementById('reset-form').onsubmit = function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    const confirmationCode = document.getElementById('confirmation-code').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Проверка на пустые поля
    if (confirmationCode === '') {
        alert('Введите код подтверждения!');
        return;
    }
    if (newPassword === '') {
        alert('Введите новый пароль!');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    alert('Пароль успешно изменён!');
};

document.getElementById('back-button').onclick = function() {
    alert('Возвращение к предыдущему шагу...');
};