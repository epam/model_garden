# Django Backend

## Database (not recommended - use docker)
www.postgresql.org/download

See the recommended pass in www.kb.epam.com/display/EPMCMLCV/Databases+and+Storages

Also update the password in `DATABASES = {...}` dict in settings.py

## Superuser
See in [<model_garden_root>/backend/.env](.env) file.

## Installation

### CVAT Installation
Follow all the steps in [CVAT Installation Guide](../cvat/README.md).

### Add Backend .env File
Create [<model_garden_root>/backend/.env](.env). Ask colleagues to share this
file content.

### Make sure you have Python 3.8 installed
```
$ python -V
Python 3.8.2
```

### Install Virtualenv
```
$ pip install virtualenv
```

### Create Virtual Environment
```
$ virtualenv .venv
```

### Activate Virtual Environment in Linux
```
$ . .venv/bin/activate
```
### Activate Virtual Environment in Windows
```
$ source ./.venv/Scripts/activate
```
 
### Install Requirements and Test Requirements
```
$ pip install -r requirements.txt -r test-requirements.txt
```

### Run Migrations
```
$ ./manage.py migrate
```

### Run Server
```
$ ./manage.py runserver 0:9000
...
Django version 3.0.5, using settings 'model_garden.settings'
Starting development server at http://127.0.0.1:9000/
Quit the server with CONTROL-C.
```

## PyCharm
See www.stackoverflow.com/questions/33868806/configuring-pycharm-with-existing-virtualenv

## Docker

### Build Docker Image
From repository root:
```
$ docker-compose build
```
To check the results:
```
$ docker images        
                                         
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
model_garden                                    latest              bd6bc2eadb1d        58 seconds ago      464MB
```

### Run Backend with Docker Compose
From repository root:
```
$ docker-compose up -d
```
To check the results:
```
$ docker-compose ps   

           Name                         Command               State           Ports         
--------------------------------------------------------------------------------------------
model_garden_backend_1    bash -c ./manage.py migrat ...   Up      0.0.0.0:9000->9000/tcp
model_garden_frontend_1   /bin/sh -c nginx -g 'daemo ...   Up      0.0.0.0:80->80/tcp
model_garden_postgres_1   docker-entrypoint.sh postgres    Up      0.0.0.0:5444->5432/tcp
```

## Linting

### Run Flake8
```
$ make lint
```
