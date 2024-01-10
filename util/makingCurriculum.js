const fs = require("fs").promises;
const fs_standart = require("fs");
const { v4: uuidv4, v4 } = require('uuid');
const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const makingCurriculum = async (curriculo, descricao_vaga) => {
    const modelo_escolhido = Math.floor(Math.random() * 3) + 1;
    const modelo_curriculo_path = "modelo_curriculo_" + modelo_escolhido + ".pdf";
    const modelo_curriculo = await openai.files.create({
        file: fs_standart.createReadStream("./assets/" + modelo_curriculo_path),
        purpose: "assistants",
    });

    const assistant = await openai.beta.assistants.create({
        name: "O Melhor Criador de Currículos. Todo mundo que faz currículo com ele consegue o emprego.",
        instructions: `Você vai gerar um novo currículo com base no currículo passado pelo usuário e a descrição da vaga. 
        O novo currículo deve ser dedicado a vaga, infalível, exelente, dinâmico e não prolixo.
        Faça o novo currículo baseado no modelo '''${modelo_curriculo_path}''', com as devidas adaptações.

        O retorno deve ser, unica e exclusivamente, o novo currículo em PDF.

        OBS: Faça que o recrutador leia o currículo e pense: "Esse é o cara que eu quero contratar!".
        OBS2: O usuário não deve ter que fazer nada além de enviar o currículo e a descrição da vaga.`,
        tools: [{ type: "code_interpreter" }],
        model: process.env.MODEL,
        file_ids: [modelo_curriculo.id]
    });

    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: `Currículo: \n'''\n${curriculo}\n'''\n\n Descrição da vaga: \n'''\n${descricao_vaga}\n'''`,
        }
    );
    const run = await openai.beta.threads.runs.create(
        thread.id,
        {
            assistant_id: assistant.id,
        }
    );

    let isRunned = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
    );
    while (isRunned.status != "completed") {
        isRunned = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );
    }
    const response = (await openai.beta.threads.messages.list(
        thread.id
    ));

    const file_id = response.data[0].file_ids[0];
    const file_response = await openai.files.content(file_id);
    const file_data = await file_response.arrayBuffer();
    const file_data_buffer = Buffer.from(file_data);

    const pathNewCurriculum = "/generatedCurriculum/" + uuidv4() + ".pdf";

    await fs.writeFile('.' + pathNewCurriculum, file_data_buffer);

    await openai.files.del(modelo_curriculo.id);
    await openai.beta.assistants.del(assistant.id);

    return pathNewCurriculum;
};

module.exports = makingCurriculum;