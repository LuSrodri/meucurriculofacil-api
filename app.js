require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const postMiddleware = require('./util/postMiddleware');
const makingCurriculum = require('./util/makingCurriculum');

app.post('/meu-curriculo-facil', postMiddleware, async (req, res) => {
    const body = req.body;
    const curriculo = body.curriculo;
    const descricao_vaga = body.descricao_vaga;

    const pathNewCurriculum = await makingCurriculum(curriculo, descricao_vaga);

    res.sendFile(__dirname + pathNewCurriculum);
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`Aplicação escutando na porta ${port}`);
});