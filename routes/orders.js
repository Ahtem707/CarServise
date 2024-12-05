const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Получаем информацию о заказе
    const [orders] = await db
      .promise()
      .query("SELECT * FROM servis_orders WHERE order_id = ?", [orderId]);

    if (orders.length === 0) {
      return res.status(404).send("Заказ не найден");
    }

    const servis_orders = orders[0];

    // Получаем информацию о клиенте
    const [customers] = await db
      .promise()
      .query("SELECT * FROM customers WHERE customer_id = ?", [
        servis_orders.customers_customer_id,
      ]);

    const customer = customers[0];

    // Получаем информацию об автомобиле
    const [cars] = await db
      .promise()
      .query("SELECT * FROM car WHERE car_id = ?", [servis_orders.car_car_id]);

    const car = cars[0];

    // Получаем использованные запчасти
    const [parts] = await db.promise().query(
      `
        SELECT i.inventory_name, i.inventory_price, sp.quantity_parts as quantity
        FROM servis_parts sp
        JOIN inventory i ON sp.inventory_id = i.inventory_id
        WHERE sp.servis_orders_order_id = ?
      `,
      [orderId]
    );

    res.render("order-details", {
      servis_orders,
      customer,
      car,
      parts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
