# Development Environment Setup

## Setup Database and Backend Containers
1. Create [<model_garden_root>/backend/.env](.env). Ask colleagues to share this
file content.
2. Build and run database and backend docker containers:
[<model_garden_root>/backend/README.md#docker](../backend/README.md#docker).
3. Run the database container:
```
docker-compose up -d postgres
```

## Setup Backend Locally
1. Install and create Python environment and dependencies according to
[<model_garden_root>/backend#installation](../backend#installation).
2. Activate Python environment from [<model_garden_root>/backend/](backend) dir.
```
".venv/Scripts/activate.bat"
```
3. Run the backend server
```
python manage.py runserver localhost:9000
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

## Migrate and Reset the Database (if needed)
1. Migrate the database from [<model_garden_root>/backend/](backend) dir:
```
python manage.py migrate
```
2. Reset the database from [<model_garden_root>/backend/](backend) dir:
```
python manage.py reset_db
```

# Learn More
This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
