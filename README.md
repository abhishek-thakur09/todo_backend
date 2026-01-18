# Autentication
        register
        login
# Team
    create team
    add team members
    remover team members
    view team members

# tasks
  - create 
  - update
  - move 
  - delete
  - assign
  - comment

# Tech used
    Nodejs
    expressjs
    MongoDb
    Jwt Authentication


# installation steps 
      - unzip the project
      - open the project into the vs code
            cd TODOBACKEN
      - npm install

      - create env file
      - npm run dev


# MongoDbcollections
    # USER
            email
            password
            name
    # TASK
            title
            discription
            teamid
            status
            comments
            assignedTo
    # TEAM
            name 
            createdBy
            members
    # ACTIVITY
            action
            taskId
            teadId
            createdBy
            