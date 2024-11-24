const express = require('express');
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');
const bcrypt = require('bcrypt');
// Middleware для парсинга JSON
app.use(express.json());
//////////////////
app.use(session({
    secret: 'your-secret-key', // Замените на собственный секретный ключ
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Установите true, если используете HTTPS
}));
app.use((req, res, next) => {
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null;
    delete req.session.error;
    delete req.session.success;
    next();
});
// Подключение маршрутов
const customerRoutes = require('./routes/customers');
app.use('/customers', customerRoutes);

const carRoutes = require('./routes/car');
app.use('/car', carRoutes);

const servisOrdersRoutes = require('./routes/servisorders');
app.use('/orders', servisOrdersRoutes);

const servisPartsRoutes = require('./routes/servisparts');
app.use('/parts', servisPartsRoutes);

const paymentsRoutes = require('./routes/payments');
app.use('/payments', paymentsRoutes);

const servisOrderDetailsRoutes = require('./routes/servisorderdetails');
app.use('/servis_order_details', servisOrderDetailsRoutes);

const fuelTypesRouter = require('./routes/fueltypes');
app.use('/fueltypes', fuelTypesRouter);

const servisesRoutes = require('./routes/servises');
app.use('/servises', servisesRoutes);

const employesRouter = require('./routes/employes');
app.use('/employes', employesRouter);

const employWorkLogRouter = require('./routes/employ_work_log'); 
app.use('/employ_work_log', employWorkLogRouter);

const inventoryRouter = require('./routes/inventory');
app.use('/inventory', inventoryRouter);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const zakazRouter = require('./routes/zakaz');
app.use('/zakaz',zakazRouter)

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.static('public'));
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
