# PlayMATES
A social sports platform that lets you create and join pickup games near you—whether it's tennis at 8 PM or a 5v5 soccer match. Find players, book spots, and get in the game—fast.

### Steps in creating the project:
`npm init -y`
`npm install -D typescript ts-node-dev @types/node`
`npx tsc --init`

### For installing typescript:
`npm install typescript --save-dev`
`npx tsc --init`
### Compile typescript file
`npx tsc index.ts`
### Run .js file that is compiled
`node src/index.js`

### Installing Express
`npm install express`
`npm install -D @types/express`


### Scripts for RUNNING
`npm run dev`   - You can code, save, and see changes live without doing anything else.
`npm run build` - Preparing to deploy, building your app for production
`npm start`     - To run the built app in production

### Installing Prisma
`npm install prisma --save-dev`
`npm install @prisma/client`
`npx prisma init`
`npx prisma migrate dev --name init` - after models are set up

### Install dotenv to load environment variables in app
`npm install dotenv`

### Install bycrypt for hashing password
`npm install bcrypt`
`npm install --save-dev @types/bcrypt`

### Flow for creating database models, schemas, and API calls 
1. Add a schema in schema.prisma
2. Run your migration `npx prisma migrate dev --name init`
3. Create the Prisma Client Helper in `src/utils/db.ts`
4. Create the service logic in `src/services`
5. Create the controller in `src/controllers`
6. Define the routes in `src/routes`
7. If a new route file is created, make sure that you have it added to index.ts
8. Initialize Express server

### Install JWT Library for Authentication
`npm install jsonwebtoken`
`npm install --save-dev @types/jsonwebtoken`

