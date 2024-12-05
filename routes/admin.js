const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const bcrypt = require("bcrypt");

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

    req.session.userId = user.employes_id;
    req.session.userRole = user.role;
    res.redirect("/admin");
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

// Главная страница админ-панели
router.get("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/admin/login");
    }

    // Получаем активные заказы
    const [activeOrders] = await db
      .promise()
      .query("SELECT * FROM servis_orders WHERE order_status = 'active'");

    // Получаем инвентарь
    const [inventory] = await db.promise().query("SELECT * FROM inventory");

    // Получаем роль пользователя
    const [userRoleResult] = await db
      .promise()
      .query("SELECT role FROM employes WHERE employes_id = ?", [
        req.session.userId,
      ]);

    const userRole = userRoleResult[0]?.role || "Не указана";

    res.render("admin", {
      activeOrders,
      inventory,
      userRole,
      userId: req.session.userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// Добавление на склад
router.post("/add", async (req, res) => {
  try {
    const { inventory_id } = req.body;
    await db
      .promise()
      .query(
        "UPDATE inventory SET quantity_in_stock = quantity_in_stock + 1 WHERE inventory_id = ?",
        [inventory_id]
      );
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
