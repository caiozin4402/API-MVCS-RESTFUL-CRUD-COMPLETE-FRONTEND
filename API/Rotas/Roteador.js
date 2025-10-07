const express = require('express');
const app = express();  
const portaServico = 3000;

app.use(express.json());//interpetra o json, middleware

app.get('/usuarios', (request, response) => {
  const resposta = { msg: 'Recebi um GET' };
  response.status(200).send(resposta);
});

app.get('/usarios/:id', (request, response) => {
  const id = request.params.id; //pega parte da url
  const resposta = {msg: 'Recebi um Get com o id + ', id};
  response.status(200).send(resposta)
});

app.post('/usarios', (request, response) =>{
  const nome = request.body.nome;
  const resposta = {msg : `Cadastrado como :  ${nome}`};
  response.status(200).send(resposta);
});

app.put('/usarios/:id',(request, response) =>{
  const id = request.params.id;
  const nome = request.body.nome;
  const resposta = {msg : `Recebi um Put com o ${id} e o ${nome}`};
  response.status(200).send(resposta);

});

app.delete('/usuarios/:id', (request, response) => {
const id = request.params.id;
const resposta = { msg: `Recebi um DELETE para o usuário com ID ${id}` };
response.status(200).send(resposta);
});

app.get()

app.listen(portaServico, () => {
console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});
