<div align="center"><img src="https://es.wiki.elvenar.com/images/0/04/Glossy_Garden.png" width="50%"/></div>

<div align="center"><h2>🏷️ Model Garden</h2></div>
<img src="https://img.shields.io/badge/Code_Style-prettier-ff69b4.svg"/>
<img src="https://img.shields.io/badge/State-redux-44CC11.svg"/>
<img src="https://img.shields.io/badge/Routing-react_router-007EC6.svg"/>

**‍🖌️ Material Design**: Intuitive UI based on the world's most widespread design language.

**🏃 Single Page Application**: Fast, responsive UX increase productivity and avoids fullscreen refreshes.

**🐍 Python Django and Postgres**

## Table of Contents
- [Install docker](https://docs.docker.com/get-docker/)
- [Run Database and Backend from Docker](#run-database-and-backend-from-docker)
- [Setup Front-end Locally](#setup-front-end-locally)

  
 - [Learn More](#learn-more)

## Run Database and Backend from Docker

1. Create [<model_garden_root>/backend/.env](.env). Ask colleagues to share this
   file content.
2. Build Docker Image:
   [<model_garden_root>/backend/README.md#build-docker-image](../backend/README.md#build-docker-image).
3. Run the database container:

```
docker-compose up -d postgres
```

4. Run the backend container:

```
docker-compose up -d backend
```
5. Run the worker container:

```
docker-compose up -d worker 
```

## Setup Front-end Locally

1. Add [<model_garden_root>/frontend/.env](.env) if absent.
2. Setup local backend port in [<model_garden_root>/frontend/.env](.env):

```
PORT=4200
REACT_APP_BACKEND_PORT=9000
```

3. Install packages in [<model_garden_root>/frontend/](frontend) dir

```
npm install
```

4. Run front-end in [<model_garden_root>/frontend/](frontend) dir

```
npm start
```

## Learn More

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
