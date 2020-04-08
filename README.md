# Folkul API 

## Client 
Checkout Folkul's client repo [here](https://github.com/kraigwilliams/motive-client) 
Or the live product [here](https://folkul.now.sh/)

## What is Folkul? 
- Fokul is a place where you can privately gather your thoughts - this can be small ideas to the next greatest invention. You can connect to other users and then share this idea with them - getting criticism, feedback and overall collaboration.

## Local dev setup 
bash <br />
mv example.env .env <br />
createuser dunder_mufflin //if you don't have one <br />
createdb -U dunder_mufflin motive <br />
createdb -U dunder_mufflin motive-test <br />

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately. <br />
bash <br />
npm install <br />
npm run migrate <br />
env MIGRATION_DATBASE_NAME=motive-test npm run migrate


## Scripts 
Start the application `npm start` <br />
Start nodemon for the application `npm run dev` <br />
Run the tests mode `npm test` <br />
Run the migrations up `npm run migrate` <br />
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
#### GET 
- Getting all topicss for a specific user 
- Request body: user id 
- Returns: an array of topic objects 
- A topic consists of: id, topic_title, topic_content, topic_owner,  level

#### POST 
- Hit when creating/posting a new topic 
- Request body: user id, topic_title, topict_content
- Returns: the created topic (client uses this topic id to push the user to the next page)

#### GET `/:topicId`
- Getting specific details for the expanded topic view 
- Uses topicId from params 
- Returns: topic id, topic_title, topict_content, topic_owner, level

#### DELETE `/:topicId`
- Takes a topic id and removes it from the database
- Sends status of 204 

#### GET `/:topicId/level` 
- Hit when getting the "share" level of topic 
- This level can be 1 (private), 2 (collaboaration), 3 (shared)
- Takes the topicId from the params and returns the level for that topic

#### POST `/share/:topicId`
- Hit when sharing a topic with a user 
- Take the topicId from the params and the user id from the request body 
- Returns: the shared topic

#### GET `/:topicId/thoughts`
- Hit when in the expanded topic view, to display all thoughts within that topic
- Take the topicId from the params and the user id from the request body 
- Returns: all thoughts within a specific topic 

#### GET `/:topicId/thoughts/:sort_option`
- Hit when sorting the thought in the topic view 
- Takes the topicId and sort_option from the params 
- sort_option can be 1 (recent modified) or 2 (alphabetical)
- Orders the thoughts via knex query
- Returns: all thought within a specific topic in specific order 

### Comment Endpoints  `/api/comments`
#### GET `/:thoughtId`
- Hit when getting all comments for a specific thought 
- Takes the thoughtId from the params
- Returns: all comments on that thought
- Comment consists of: id, thought_id, commenter_id, comment_content, date_posted

#### POST `/:thoughtId`
- Hit when posting a new comment on a specific thought
- Takes the thoughtId from the params and the comment_content and the user.id (commenter_id) from the request body 
- Posts the comment in the comment table
- Returns: the comment just created

### Connection Endpoints `/api/connection`
#### GET 
- Hit when getting all existing connections for a specific user
- Takes the user id from the request body 
- Returns: all connections - this includes users that the logged in user has added AND the all users that added the logged in user 

#### POST `/:userId`
- Hit when a user adds a new connection from the connections page
- Takes the user id and the connectionId from the request body 
- The connectionId is the id of the user they want to connection with
- Returns: message saying 'Succesfully added connection'

#### GET `/new`
- This is getting all users the logged in user is NOT connected with for the search on the connections page 
- Takes the user id from the request body 
- Returns: An array of user objects 
- A user object contains: id, first_name, last_name and username

- - - -

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
