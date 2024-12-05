const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "94.250.252.36",
  user: "car_service",
  password: "car_service",
  database: "car_service",
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных: ", err);
    return;
  }
  console.log("Подключено к базе данных");
});

db.query("ALTER TABLE employes MODIFY COLUMN password VARCHAR(255)", (err) => {
  if (err) {
    console.error("Ошибка при изменении размера поля password:", err);
  } else {
    console.log("Размер поля password успешно изменен");
  }
});

module.exports = db;
