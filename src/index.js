const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/*
  Crie um middleware global chamado em todas requisições que imprime 
  (console.log) uma contagem de quantas requisições foram feitas na aplicação 
  até então;
*/
function logReq(req, res, next) {
  console.count("Requisições feitas na aplicação até o momento");

  return next();
}

server.use(logReq);

/*
  Crie um middleware que será utilizado em todas rotas que recebem o ID do 
  projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. 
  Se não existir retorne um erro, caso contrário permita a requisição continuar 
  normalmente;
*/
function checkProject(req, res, next) {
  const { id } = req.params;

  const project = projects.find(projec => projec.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

/* 
  GET /projects: 
  Rota que lista todos projetos e suas tarefas;
*/
server.get('/projects', (req, res) => {
  return res.json(projects);
})

/*
  POST /projects: 
  A rota deve receber id e title dentro do corpo e cadastrar um novo projeto 
  dentro de um array no seguinte formato: 
  { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto 
  o ID quanto o título do projeto no formato string com aspas duplas.
*/
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [String]
  }

  projects.push(project);

  return res.json(project);
})

/* 
  POST /projects/:id/tasks: 
  A rota deve receber um campo title e armazenar uma nova tarefa no array de 
  tarefas de um projeto específico escolhido através do id presente nos 
  parâmetros da rota;
*/
server.post('/projects/:id/tasks', checkProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
})

/* 
  PUT /projects/:id: 
  A rota deve alterar apenas o título do projeto com o id presente nos 
  parâmetros da rota;
*/
server.put('/projects/:id', checkProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project)
})

/* 
  DELETE /projects/:id: 
  A rota deve deletar o projeto com o id presente nos parâmetros da rota;
*/
server.delete('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id == id);

  projects.splice(project, 1);

  return res.send();
})

server.listen(3000)