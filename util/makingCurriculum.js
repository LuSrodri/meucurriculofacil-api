const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const makingCurriculum = async (curriculo, descricao_vaga) => {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Você vai gerar um novo currículo com base no currículo passado pelo usuário e a descrição da vaga. 
                O novo currículo deve ser dedicado a vaga, infalível, exelente, dinâmico e não prolixo.
                O retorno deve ser unicamente e exclusivamente o novo currículo. Não deve conter nada além do novo currículo.`
            },
            {
                role: "user",
                content: `Currículo: \n'''\n${curriculo}\n'''\n\n Descrição da vaga: \n'''\n${descricao_vaga}\n'''`
            },
        ],
        model: "gpt-4-1106-preview",
        presence_penalty: -2,
    });

    const newCurriculum = completion.choices[0].message.content;

    return newCurriculum;
};

module.exports = makingCurriculum;