const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET запрос на страницу заказа
router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId; // Получаем ID пользователя из сессии
    if (!userId) {
      return res.redirect("/auth/login"); // Если пользователь не авторизован, перенаправляем на страницу входа
    }

    // Получение имени пользователя
    const [userRows] = await db
      .promise()
      .query("SELECT FIO FROM customers WHERE customer_id = ?", [userId]);
    if (userRows.length === 0) {
      return res
        .status(404)
        .render("error", { message: "Пользователь не найден." });
    }
    const userName = userRows[0].FIO;

    // Получение списка автомобилей пользователя
    const [cars] = await db
      .promise()
      .query(
        "SELECT car_id, mark, model FROM car WHERE customers_customer_id = ?",
        [userId]
      );

    // Получение списка услуг для отображения
    const [services] = await db
      .promise()
      .query("SELECT servis_id, servis_name, servis_price FROM servises");

    // Рендерим страницу, передавая имя пользователя, автомобили и услуги
    res.render("9pd", { fio: userName, cars, services });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Ошибка сервера.",
      error: { status: 500, stack: error.stack },
    });
  }
});

// POST запрос на создание заказа
router.post("/", async (req, res) => {
  try {
    const customerId = req.session.userId;
    if (!customerId) {
      return res
        .status(401)
        .render("error", { message: "Пользователь не авторизован." });
    }

    const { carId, address, additionalRequirements, services } = req.body;

    const quantities = {};
    for (const key in req.body) {
      if (key.startsWith("quantity_")) {
        const serviceId = key.replace("quantity_", "");
        quantities[serviceId] = parseInt(req.body[key]) || 1;
      }
    }

    if (!carId) {
      return res.status(400).render("error", {
        message: "Автомобиль не выбран. Пожалуйста, выберите автомобиль.",
      });
    }

    const [employeeRows] = await db
      .promise()
      .query(
        `SELECT employes_id FROM employes WHERE status = 'active' LIMIT 1`
      );

    if (employeeRows.length === 0) {
      return res.status(500).render("error", {
        message: "Нет доступных сотрудников для обработки заказа.",
      });
    }
    const activeEmployeeId = employeeRows[0].employes_id;

    let totalAmount = 0;
    if (Array.isArray(services) && services.length > 0) {
      for (const serviceId of services) {
        const [serviceRows] = await db
          .promise()
          .query(`SELECT servis_price FROM servises WHERE servis_id = ?`, [
            serviceId,
          ]);

        if (serviceRows.length === 0) continue;

        const servicePrice = parseFloat(serviceRows[0].servis_price) || 0;
        const quantity = quantities[serviceId] || 1;
        totalAmount += servicePrice * quantity;
      }
    }

    const [orderResult] = await db.promise().query(
      `INSERT INTO servis_orders 
           (servis_data, order_status, adress, customers_customer_id, car_car_id, employes_employes_id, total_amount) 
           VALUES (NOW(), 'active', ?, ?, ?, ?, ?)`,
      [address || "", customerId, carId, activeEmployeeId, totalAmount]
    );

    const orderId = orderResult.insertId;

    if (Array.isArray(services) && services.length > 0) {
      for (const serviceId of services) {
        const quantity = quantities[serviceId] || 1;

        await db.promise().query(
          `INSERT INTO servis_order_details 
              (quantity, description, servises_servis_id, servis_orders_order_id, subtotal) 
              VALUES (?, ?, ?, ?, ?)`,
          [
            quantity,
            additionalRequirements || "",
            serviceId,
            orderId,
            quantity * (quantities[serviceId] || 1),
          ]
        );
      }
    }

    // Передача сообщения об успехе
    const [userRows] = await db
      .promise()
      .query("SELECT FIO FROM customers WHERE customer_id = ?", [customerId]);
    const userName = userRows[0]?.FIO || "Неизвестный пользователь";

    const [cars] = await db
      .promise()
      .query(
        "SELECT car_id, mark, model FROM car WHERE customers_customer_id = ?",
        [customerId]
      );

    const [servicesList] = await db
      .promise()
      .query("SELECT servis_id, servis_name, servis_price FROM servises");

    res.render("9pd", {
      fio: userName,
      cars,
      services: servicesList,
      successMessage: "Ваш заказ успешно оформлен!",
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Ошибка сервера.",
      error: { status: 500, stack: error.stack },
    });
  }
});router.post("/", async (req, res) => {
  try {
    const customerId = req.session.userId;
    if (!customerId) {
      return res
        .status(401)
        .render("error", { message: "Пользователь не авторизован." });
    }

    const { carId, address, additionalRequirements, services } = req.body;

    const quantities = {};
    for (const key in req.body) {
      if (key.startsWith("quantity_")) {
        const serviceId = key.replace("quantity_", "");
        quantities[serviceId] = parseInt(req.body[key]) || 1;
      }
    }

    if (!carId) {
      return res.status(400).render("error", {
        message: "Автомобиль не выбран. Пожалуйста, выберите автомобиль.",
      });
    }

    const [employeeRows] = await db
      .promise()
      .query(
        `SELECT employes_id FROM employes WHERE status = 'active' LIMIT 1`
      );

    if (employeeRows.length === 0) {
      return res.status(500).render("error", {
        message: "Нет доступных сотрудников для обработки заказа.",
      });
    }
    const activeEmployeeId = employeeRows[0].employes_id;

    let totalAmount = 0;
    if (Array.isArray(services) && services.length > 0) {
      for (const serviceId of services) {
        const [serviceRows] = await db
          .promise()
          .query(`SELECT servis_price FROM servises WHERE servis_id = ?`, [
            serviceId,
          ]);

        if (serviceRows.length === 0) continue;

        const servicePrice = parseFloat(serviceRows[0].servis_price) || 0;
        const quantity = quantities[serviceId] || 1;
        totalAmount += servicePrice * quantity;
      }
    }

    const [orderResult] = await db.promise().query(
      `INSERT INTO servis_orders 
           (servis_data, order_status, adress, customers_customer_id, car_car_id, employes_employes_id, total_amount) 
           VALUES (NOW(), 'active', ?, ?, ?, ?, ?)`,
      [address || "", customerId, carId, activeEmployeeId, totalAmount]
    );

    const orderId = orderResult.insertId;

    if (Array.isArray(services) && services.length > 0) {
      for (const serviceId of services) {
        const quantity = quantities[serviceId] || 1;

        await db.promise().query(
          `INSERT INTO servis_order_details 
              (quantity, description, servises_servis_id, servis_orders_order_id, subtotal) 
              VALUES (?, ?, ?, ?, ?)`,
          [
            quantity,
            additionalRequirements || "",
            serviceId,
            orderId,
            quantity * (quantities[serviceId] || 1),
          ]
        );
      }
    }

    // Передача сообщения об успехе
    const [userRows] = await db
      .promise()
      .query("SELECT FIO FROM customers WHERE customer_id = ?", [customerId]);
    const userName = userRows[0]?.FIO || "Неизвестный пользователь";

    const [cars] = await db
      .promise()
      .query(
        "SELECT car_id, mark, model FROM car WHERE customers_customer_id = ?",
        [customerId]
      );

    const [servicesList] = await db
      .promise()
      .query("SELECT servis_id, servis_name, servis_price FROM servises");

    res.render("9pd", {
      fio: userName,
      cars,
      services: servicesList,
      successMessage: "Ваш заказ успешно оформлен!",
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Ошибка сервера.",
      error: { status: 500, stack: error.stack },
    });
  }
});
module.exports=router;
