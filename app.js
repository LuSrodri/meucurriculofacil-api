require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
app.disable('x-powered-by');
app.use(cors());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`Aplicação escutando na porta ${port}`);
});