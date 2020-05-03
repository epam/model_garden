# Django backend

## DataBase
www.postgresql.org/download
See the recommended pass in www.kb.epam.com/display/EPMCMLCV/Databases+and+Storages
Also update the password in `DATABASES = {...}` dict in settings.py

## Installation

### Install virtualenv
```
$ pip install virtualenv
```

### Create virtual environment
```
$ virtualenv .venv
```

### Activate virtual environment in Linux
```
$ . .venv/bin/activate
```
### Activate virtual environment in Windows
```
$ source ./.venv/Scripts/activate
```
 
### Install requirements and test requirements
```
$ pip install -r requirements.txt -r test-requirements.txt
```

### Run migrations
```
$ ./manage.py migrate
```

### Create a superuser
```
$ ./manage.py createsuperuser
```

### Run server
```
$ ./manage.py runserver 0:9000
...
Django version 3.0.5, using settings 'model_garden.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

## PyCharm
See www.stackoverflow.com/questions/33868806/configuring-pycharm-with-existing-virtualenv

## Docker

### Build image
```
$ make build
$ docker images        
                                         
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
model_garden                                    latest              bd6bc2eadb1d        58 seconds ago      464MB

```

### Run docker compose
```
$ docker-compose up -d
$ docker-compose ps   

           Name                         Command               State           Ports         
--------------------------------------------------------------------------------------------
backend_django_postgres_1    docker-entrypoint.sh postgres    Up      0.0.0.0:5444->5432/tcp
backend_django_webserver_1   bash -c ./manage.py migrat ...   Up      0.0.0.0:9000->9000/tcp
```

## Linting

### Run flake8
```
$ make lint
```
