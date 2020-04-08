const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  let { id } = request.params;

	if (!isUuid(id)) return response.status(400).json({ error: 'Invalid repository. Please try again.' });

	return next();
};

app.use('/repositories/:id', validateRepositoryId); 

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let { title, url, techs } = request.body;
  let likes = 0;

  let repository = { id: uuid(), title, url, techs, likes };
  
  repositories.push(repository)
  
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  let { id } = request.params;
  let { title, url, techs } = request.body;

  let repositoryIndex = repositories.findIndex( repository => repository.id === id );
  
  let repository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
	};
  
	repositories[repositoryIndex] = repository;

	return response.json(repository); 
});

app.delete("/repositories/:id", (req, res) => {
  let { id } = req.params;

  let repositoryIndex = repositories.findIndex( repository => repository.id === id );

  repositories.splice(repositoryIndex, 1);

	return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  let { id } = request.params;

  let repositoryIndex = repositories.findIndex( repository => repository.id === id );

  let repository = {
    id: repositories[repositoryIndex].id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1
	};

  repositories[repositoryIndex] = repository;

  return response.json(repository); 
});

module.exports = app;
