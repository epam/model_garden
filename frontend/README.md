This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Set-up for UI Development
1. Build and run database and backedn docker from
[<model_garden_root>/backend/README.md#docker](../backend/README.md#docker).
2.Add [<model_garden_root>/frontend/.env](.env) if absent.
3. Set-up local backed host/port in [<model_garden_root>/frontend/.env](.env):

    BACKEND_HOST=localhost
    REACT_APP_BACKEND_PORT=9000


## Run Commands
To work with the PROD server you need running Global Protect

### Environment activation (on Windows):
".venv/Scripts/activate.bat"

### Run server:
python manage.py runserver localhost:9000

Now the server is running.

## Maintenance Commands
### Migration:
python manage.py migrate

### reset_db:
python ./manage.py reset_db

## UI Set-up and Running Commands

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
