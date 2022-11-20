This is a project for a login screen demo.
No credential system. Fixed to 1 single user that logs in with an auth screen.
node-modules:
- express
- jwt
- 

step 1:
create (generate) a base express application: 
`$ npx express-generator --view=ejs --git`
  -- ejs is the viewer
  -- it's a git project (add .gitignore)

install nodemon (only development dependency)
`$ npm install --save-dev nodemon`

ejs installation showed a critical serverity vulnerability message:
`$ npm audit fix --force`

to make use of a .env file the dotenv module is needed:
`$ npm install --save dotenv`

and finaly for the auth I'm going to use jsonwebtoken
`$ npm install --save jsonwebtoken`

now all modules needed have been installed.

The express generator allready did a complete setup of a simple project.
Both a views and routes folder were created. a public folder that can be used to store the static files (stylesheets, javascripts and images)

Now some base configuration is needed in the package.json file, by adding this line to the scripts node:
"devStart": "nodemon ./bin/www"

The app can be started in deve by entering
$nodemon start devStart

now when changing any line in the application, it will restart itself.

now let's 