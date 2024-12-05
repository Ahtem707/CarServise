const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/", async (req, res) => {
  try {
    const { inventory_name, quantity_in_stock, inventory_price } = req.body;
    const employes_employes_id = req.session.userId; // Получаем ID сотрудника из сессии

    // Добавляем новый товар в инвентарь
    await db
      .promise()
      .query(
        "INSERT INTO inventory (inventory_name, quantity_in_stock, inventory_price, employes_employes_id) VALUES (?, ?, ?, ?)",
        [
          inventory_name,
          quantity_in_stock,
          inventory_price,
          employes_employes_id,
        ]
      );

    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
