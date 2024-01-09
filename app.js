require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const postMiddleware = require('./util/postMiddleware');

app.post('/meu-curriculo-facil', postMiddleware, (req, res) => {
    res.send({ data: req.body});
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`Aplicação escutando na porta ${port}`);
});