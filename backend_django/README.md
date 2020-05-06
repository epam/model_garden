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
Starting development server at http://127.0.0.1:9000/
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

## Deployment

### Image build pipeline on Gitlab

Gitlab pipeline uses `.gitlab-ci.yml` file for pipeline configuration. In order to launch 
the docker image build a new git tag needs to be created:

#### Check existing tags
```
$ git tag
v0.0.1
```

#### Create new tag
```
$ git tag -a v0.0.2 -m "v0.0.2"
```

#### Push new tag
```
$ git push origin v0.0.2
```

#### Check Gitlab pipelines:

A new pipeline run should be created here:

https://git.epam.com/epmc-mlcv/model_garden/pipelines

Once the run is completed successfully a new docker image will be available in Amazon ECR repository:

https://eu-central-1.console.aws.amazon.com/ecr/repositories/model_garden_backend/?region=eu-central-1
