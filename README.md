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
      - Clone the Repository
                - git clone https://github.com/abhishek-thakur09/todo_backend.git
      - Open the Project
                - cd TODOBACKEN
      - Install Dependencies
                - npm install


      - Create Environment File
                        .env file
      - Run the Project
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
            