## myteam API

Nodejs Rest API to register and login users.

The project is implemented as part the InterShip in Quantox Techologies.

### env file

If you are running this project in development mode, set `ENVIORMENT=development`.
That will initialize the development SQLite database instead of MySQL database.

Create `.env` file in the root directory of the project and change the values of the variables.

```
APP_PORT="enter app PORT number here"
DB_HOST="enter your db host here"
DB_USER="enter your db username here"
DB_NAME="enter your mysql db name here"
DB_PASSWORD="enter your password here"
JWT_SECRET="Your JWT secret goes here"
ENVIRONMENT="production"
```

## Run

Clone project from github, install dependencies with `npm install` and run the server in development mode with `npm dev`.

- `npm run dev` -> Developer mode
- `npm run build` -> Compile JS
- `npm run start` -> Run JS
- `npm run lint` -> Lint
- `npm run format` -> format to comply with linting rules

## requests response format

**/users**

- `GET /` all users returns json object with requested information
- `GET /{userId}` get user by ID returns json object with requested information
- `PUT /{userId}`
- `DELETE /{userId}` -> Checks for user profile and delets it before it removes a user

- `POST /register` (email -> unique, password(min 8), username)
- `POST /login` (email, password) returns email and web token

**/profiles**

- `GET /` all users returns json object with requested information
- `GET /{profileId}` get user by ID returns json object with requested information
- `PUT /{profileId}`
- `DELETE /{profileId}`

**to do**

Current user logic is able to encryprt passwords with bcryptjs and check if provided password matches saved in the db. Current logic doesn't provide:

- [ ] proper password reset logic (with email confirmation or similar security guard)
- [ ] crsf protection
- [ ] authorization logic

## Changelog

- Branch **01SQL**: adding Linting, mySQL, Sequlize, User model, validation around Usermodel
- Branch **02ProfileModel**: addedd Profile Model, made changes to user model so logic follows the relationship user/model
