const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const bcrypt = require("bcrypt");

// Функция для проверки роли админа
function checkAdminRole(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/admin/login"); // Если пользователь не авторизован, перенаправляем на страницу входа
  }

  if (req.session.userRole !== "admin") {
    return res.status(403).send("Доступ запрещен. Только для администраторов."); // Если роль не "admin", запрещаем доступ
  }

  next(); // Если все проверки пройдены, переходим к следующему обработчику
}

// Главная страница админ-панели
router.get("/", checkAdminRole, async (req, res) => {
  try {
    // Получаем активные заказы
    const [activeOrders] = await db.promise().query("SELECT * FROM servis_orders WHERE order_status = 'active'");

    // Получаем инвентарь
    const [inventory] = await db.promise().query("SELECT * FROM inventory");

    res.render("admin", {
      activeOrders,
      inventory,
      userRole: req.session.userRole,
      userId: req.session.userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// Маршрут для страницы входа
router.get("/login", (req, res) => {
  res.render("admin-login");
});

// Обработка входа
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db
      .promise()
      .query("SELECT * FROM employes WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).send("Неверный email или пароль");
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Неверный email или пароль");
    }

    // Сохраняем данные о пользователе в сессии
    req.session.userId = user.employes_id;
    req.session.userRole = user.role;

    if (user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/");  // Для пользователей с другой ролью перенаправляем на домашнюю страницу
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// Маршрут для страницы регистрации
router.get("/register", (req, res) => {
  res.render("admin-register");
});

// Обработка регистрации
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role } = req.body;

    // Проверка существующего email
    const [existingUsers] = await db
      .promise()
      .query("SELECT * FROM employes WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).send("Пользователь с таким email уже существует");
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Добавление нового сотрудника
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO employes (first_name, last_name, email, phone, password, role, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'active')",
        [first_name, last_name, email, phone, hashedPassword, role]
      );

    res.redirect("/admin/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
