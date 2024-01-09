const postMiddleware = (req, res, next) => {
    if (req.body) {
        try {
            const data = req.body;

            if (!data.curriculo || !data.descricao_vaga) {
                throw new Error('Dados inválidos. Não contém os campos obrigatórios.');
            }
            if (typeof data.curriculo != 'string' || typeof data.descricao_vaga != 'string') {
                throw new Error('Dados inválidos. Os campos obrigatórios não são do tipo string.');
            }
        } catch (e) {
            console.log(e);
            res.status(400).send({ error: 'Dados inválidos.'});
            return;
        }
    } else {
        console.log('Nenhum dado enviado.');
        res.status(400).send({ error: 'Nenhum dado enviado.'});
        return;
    }

    next();
};

module.exports = postMiddleware;