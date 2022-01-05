## myteam API

Node/Express/Typescript/mySQL boilerplate 

### env file

- APP_PORT=enter number here
- DB_USER="enter your db username here"
- DB_NAME="enter your mysql db name here"
- DB_PASSWORD="enter your password here"
- JWT_SECRET="Your JWT secret goes here"
## Run
- npm run dev -> Developer mode
- npm run build -> Compile JS
- npm run start -> Run JS
- npm run lint -> Lint
- npm run format -> format to comply with linting rules

## requests response format

**/api/users**
- / GET all users
- /userId GET get user by ID
- /signup POST (email -> unique, password(min 8), username)
- login POST (email, password) returns email and web token
- /userId PUT
- /userId DELETE 



**to do**

Current user logic is able to encryprt passwords with  bcryptjs and check if provided password matches saved in the db. Current logic doesn't provide:
- proper password reset logic (with email confirmation or similar security guard) 
- crsf protection 
- authorization logic


## Changelog 
- Branch **01SQL**:  adding Linting, mySQL, Sequlize, User model, validation around Usermodel
