document.addEventListener("DOMContentLoaded", function () {
  // Обработка выбора услуг
  const servicesContainer = document.querySelector(".services-container");

  servicesContainer.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("service-btn") &&
      !e.target.classList.contains("add-service")
    ) {
      e.target.classList.toggle("active");
    }
  });

  // Обработка отправки формы
  const submitBtn = document.querySelector(".submit-btn");

  submitBtn.addEventListener("click", function () {
    const formData = {
      name: document.getElementById("name").value,
      car: document.getElementById("car").value,
      address: document.getElementById("address").value,
      services: Array.from(
        document.querySelectorAll(".service-btn.active")
      ).map((btn) => btn.textContent),
      requirements: document.getElementById("requirements").value,
    };

    // Здесь можно добавить валидацию и отправку данных на сервер
    console.log("Данные формы:", formData);
  });
});
