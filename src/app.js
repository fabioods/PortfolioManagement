const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repo);
  return response.json(repo);
});

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ msg: 'Repo not found' });
  }

  const repo = repositories[repoIndex];
  const newRepo = {
    ...repo,
    title,
    url,
    techs,
  };
  repositories[repoIndex] = newRepo;
  return response.json(newRepo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ msg: 'Repo not found' });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ msg: 'Repo not found' });
  }

  const repo = repositories[repoIndex];

  const repoUpdated = {
    ...repo,
    likes: repo.likes + 1,
  };

  repositories[repoIndex] = repoUpdated;
  return response.json(repoUpdated);
});

module.exports = app;
