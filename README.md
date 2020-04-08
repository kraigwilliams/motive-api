# Folkul API 

## Client 
Checkout Folkul's client repo [here](https://github.com/kraigwilliams/motive-client) 
Or the live product [here](https://folkul.now.sh/)

## What is Folkul? 
- Fokul is a place where you can privately gather your thoughts - this can be small ideas to the next greatest invention. You can connect to other users and then share this idea with them - getting criticism, feedback and overall collaboration.

## Local dev setup 
bash
mv example.env .env
createuser dunder_mufflin //if you don't have one
createdb -U dunder_mufflin motive
createdb -U dunder_mufflin motive-test

f your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.
bash
npm install
npm run migrate
env MIGRATION_DATBASE_NAME=motive-test npm run migrate


## Scripts 
Start the application `npm start`
Start nodemon for the application `npm run dev`
Run the tests mode `npm test`
Run the migrations up `npm run migrate`
Run the migrations down `npm run migrate -- 0`

## Routes 
### User Endpoints `/api/user`
#### POST 
- Hit when a user signs up
- Request body: first_name, last_name, username and password 
- Takes the posted user, serializes the data
- Returns: the user id, username, first_name, last_name

### Thought Endpoints `/api/thought`
#### GET 
- Getting all thoughts for a specific user 
- Request body: user id 
- Returns: an array of thought objects 
- A thought consists of: id, thought_title, thought_content, thought_owner, thought_topic, level, date_modified

#### POST 
- Hit when creating/posting a new thought 
- Request body: user id, thought_title, thought_content, thought_topic
- Returns: the created thought (client uses this thought id to push the user to the next page)

#### GET `/:thoughtId`
- Getting specific details for the expanded thought view 
- Uses thoughtId from params 
- Returns: thought id, thought_title, thought_content, thought_owner, thought_topic, level, date_modified from the THOUGHT table
and id, username, first_name and last_name from the FOKUL_USERS table

#### PATCH `/:thoughtId`
- Hit when updating a specific thought 
- Request body: thought_title, thought_content, thought_topic, date_modifed
- Returns: the updated thought details 

#### DELETE `/:thoughtId`
- Takes a thought id and removes it from the database
- Sends status of 204 

#### GET `/:thoughtId/level` 
- Hit when getting the "share" level of thought 
- This level can be 1 (private), 2 (collaboaration), 3 (shared)
- Takes the thoughtId from the params and returns the level for that thought

#### GET `/share/:thoughtId`
- Hit when getting the users this thought was shared with 
- Takes the thoughtId from the params and returns the shared users

#### POST `/share/:thoughtId`
- Hit when sharing a thought with a user 
- Take the thoughtId from the params and the user id from the request body 
- Returns: the shared thought

### Topic Endpoints `/api/topic`

### Comment Endpoints  `/api/comments`

## Connection Endpoints `/api/connection`








# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
