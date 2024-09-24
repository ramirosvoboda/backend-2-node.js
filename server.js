const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = [];

app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

app.post('/productos', (req, res) => {
    const { name, price } = req.body;
    products.push({ name, price });
    io.emit('productAdded', { name, price });
    res.redirect('/');
});

io.on('connection', (socket) => {
    console.log('Usuario conectado');
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
