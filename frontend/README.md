# UI Dev Environment Set-up
## Set-up Database and UI Locally.
1. Ask colleagues and copy [<model_garden_root>/backend/.env](.env).
2. Build and run database and backedn docker from
[<model_garden_root>/backend/README.md#docker](../backend/README.md#docker).
3. Run the database container.
```
docker-compose up -d postgres
```
4. Add [<model_garden_root>/frontend/.env](.env) if absent.
5. Set-up local backed host/port in [<model_garden_root>/frontend/.env](.env):

    * PORT=4200
    * REACT_APP_BACKEND_PORT=9000

## Set-up Backend Locally.
1. Install and create Python environment and dependencies according to
[<model_garden_root>/backend#installation](../backend#installation).
2. Activate Python environment from [<model_garden_root>/backend/](backend) dir.
```
".venv/Scripts/activate.bat"
```
3. Run the backend server.
```
python manage.py runserver localhost:9000
```

## Migrate and Reset the Database (if needed).
1. Migrate the database from [<model_garden_root>/backend/](backend) dir:
```
python manage.py migrate
```
2. Reset the database from [<model_garden_root>/backend/](backend) dir:
```
python ./manage.py reset_db
```

# Learn More

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
