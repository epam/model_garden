<div align="center"><img src="https://es.wiki.elvenar.com/images/0/04/Glossy_Garden.png" width="50%"/></div>

<div align="center"><h2>🏷️ Model Garden</h2></div>


**‍🖌️ Material Design**: **Intuitive** UI based on the world's most widespread design language.

**🏃 Single Page Application**: Fast, responsive ux to get what you need done without waiting for fullscreen refreshes.

**🐍 Python Django and Postgres**

## Installation

- [CVAT Installation Guide](cvat/README.md)
- [Installation guide for Backend developer](backend/README.md)
- [Installation guide for Frontend developer](frontend/README.md)

## Run Application with Docker Compose
```
$ docker-compose up -d

Creating network "model_garden_default" with the default driver
...
Creating model_garden_postgres_1 ... done
Creating model_garden_backend_1  ... done
Creating model_garden_frontend_1 ... done
```

### Check Running Docker Containers
```
$ docker-compose ps

         Name                        Command               State           Ports         
-----------------------------------------------------------------------------------------
model_garden_backend_1    bash -c ./manage.py migrat ...   Up      0.0.0.0:9000->9000/tcp
model_garden_frontend_1   /bin/sh -c nginx -g 'daemo ...   Up      0.0.0.0:80->80/tcp    
model_garden_postgres_1   docker-entrypoint.sh postgres    Up      0.0.0.0:5444->5432/tcp
```

## Deployment

  The build pipeline is started automatically after commits to main and develop branches
- [Deployment guide](deploy/ReadMe.md)
