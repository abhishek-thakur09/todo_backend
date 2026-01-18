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
      - Open the Project
            cd TODOBACKEN
      - Install Dependencies

      - Create Environment File
      - Run the Project
                


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
            