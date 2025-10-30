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
2. Run your migration `npx prisma migrate dev --name describe_your_change`
3. Create the Prisma Client Helper in `src/utils/db.ts`
4. Create the service logic in `src/services`
5. Create the controller in `src/controllers`
6. Define the routes in `src/routes`
7. If a new route file is created, make sure that you have it added to index.ts
8. Initialize Express server

#### Getting an error in prisma migration 
Error: 
Drift detected: Your database schema is not in sync with your migration history.
We need to reset the "public" schema at "aws-0-us-east-1.pooler.supabase.com:5432"
#### To reset
1. `npx prisma migrate reset`
    - this means you're losing all your data
2. `npx prisma migrate status` - verify reset and should say "Database schema is up to date!"
3. `npx prisma migrate dev --name describe_your_change`
#### When pulling from git: 
1. `git pull`
2. `npx prisma migrate dev` #applies any new migrations
3. `cp .env.example .env` - not sure what this is for
3. `npx prisma migrate dev`


### Install JWT Library for Authentication
`npm install jsonwebtoken`
`npm install --save-dev @types/jsonwebtoken`

### Install CORS so that the frontend could access your backend 
`npm install cors`
`npm install --save-dev @types/cors`

### Practice API versioning
- We want to do best practice for API versioning, and these are the steps created: 
1. added `versionMiddleware.ts`
2. Update your calls to include headers such as Content-Type and api-version

- When do we add Content-Type header? 
    - Sample is Content-Type: application/json
    - This is needed for POST/PUT/PATCH Methods (Sending Data)
    - The server needs to know: "What format is this data in?" and "How should I parse this body?"

