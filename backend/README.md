# Django Backend

## Database

### Local Database (not recommended - use docker)
www.postgresql.org/download (the current ver. 12.3)

<table style="width:100%">
  <tr>
    <th style="text-align:center">Name</th>
    <th style="text-align:center">Value</th>
  </tr>
  <tr>
    <td>Host name/Address</td>
    <td>model-garden-db-prod-1.&lt;id&gt;.eu-central-1.rds.amazonaws.com</td>
  </tr>
  <tr>
    <td>Username</td>
    <td>postgres</td>
  </tr>
  <tr>
    <td>Password</td>
    <td>******</td>
  </tr>
  <tr>
    <td>Port</td>
    <td>5432</td>
  </tr>
</table>

Also update the password in `DATABASES = {...}` dict in
[settings.py](model_garden/settings.py).

### Local Database Docker Container
1. Update `POSTGRES_PASSWORD` in
[<model_garden_root>/docker-compose.yml](../docker-compose.yml).

Also update the password in `DATABASES = {...}` dict in
[settings.py](model_garden/settings.py).

2. Run the database container:

```
docker-compose up -d postgres
```

The is no need to build the image, because
 [postgres:12-alpine](www.github.com/docker-library/postgres/tree/master/12/alpine)
 is already pre-build.

Run from [<model_garden_root>](..) `docker-compose exec postgres psql
 -U postgres -W <password> model_garden` to access the database via command line.

## Superuser
See in [<model_garden_root>/backend/.env](.env) file.

## Installation

### CVAT Installation
1. Follow all the steps in [CVAT Installation Guide](../cvat/README.md).

2. Add to the installed CVAT a superuser with `CVAT_ROOT_USER_NAME` and
 `CVAT_ROOT_USER_PASSWORD` specified in [<model_garden_root>/backend/.env](.env)
 (see [Add Backend .env File](#add-backend-env-file) below).

### CVAT API

**NOTE**: The currently supported version of CVAT backend API is
 [0.6.1](www.github.com/openvinotoolkit/cvat/tree/v0.6.1).

[<model_garden_root>/backend/CVAT.postman_collection.json](CVAT.postman_collection.json)
 is prepared for [Postman API debug client](www.postman.com) to evaluate used
 backend API calls to CVAT API in isolation from Model Garden code itself (see a
 guide about [Collections In Postman](www.toolsqa.com/postman/collections-in-postman)).  

### Add Backend .env File
Create [<model_garden_root>/backend/.env](.env).

```
AWS_ACCESS_KEY_ID='<ABCDEFGHIJKLMNOPQRST>*'
AWS_SECRET_KEY='<abcdefghijklmnopqrstuvwxyz0123456789-+/>*'

CVAT_HOST='localhost'
CVAT_PORT=8080
CVAT_ROOT_USER_NAME='<cvat_super_user>*'
CVAT_ROOT_USER_PASSWORD='<cvat_super_user_password>*'

DJANGO_DB_HOST='localhost'
DJANGO_DB_PORT=5444
```

<sup>* - environment specific values</sup>

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

### Activate Virtual Environment
#### For Linux
```
$ . .venv/bin/activate
```
#### For Windows
```
$ source ./.venv/Scripts/activate
```
Or

```
$ .venv/Scripts/activate.bat
```
 
### Install Requirements and Test Requirements
```
$ pip install -r requirements.txt -r test-requirements.txt
```

### Run Migrations
Migrate the database from [<model_garden_root>/backend/](backend) dir:
```
$ python ./manage.py migrate
```
### Reset Database
Reset the database from [<model_garden_root>/backend/](backend) dir:
```
$ python ./manage.py reset_db
```

### Reload fixtures
Provide initial data for models by reloading fixtures. It's used to pre-populate
database with some defaults used in local development.
```
python manage.py loaddata default_bucket
```

### Run Server
```
$ ./manage.py runserver 0:9000
...
Django version 3.0.5, using settings 'model_garden.settings'
Starting development server at http://127.0.0.1:9000/
Quit the server with CONTROL-C.
```

### Run Worker
Run worker in background to update task statuses from CVAT
```
python worker.py
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

         Name                        Command               State           Ports
-----------------------------------------------------------------------------------------
model_garden_backend_1    bash -c python3 manage.py  ...   Up      0.0.0.0:9000->9000/tcp
model_garden_frontend_1   /bin/sh -c nginx -g 'daemo ...   Up      0.0.0.0:80->80/tcp    
model_garden_postgres_1   docker-entrypoint.sh postgres    Up      0.0.0.0:5444->5432/tcp
model_garden_worker_1     python3 worker.py                Up
```


## Linting

### Run Flake8
```
$ make lint
```
