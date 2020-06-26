# access-control
API REST with Nodejs

Create an application that allows login and use roles 

## Requirements
* Node.js v10.15.3
* Mongodb
* accesscontrol

## Setup
Firstly, create  .env file. you just need

* `JWT_SECRET={{TOP_SECRET_VALUE}}`.

## Running the project local
If you want to start the app:
* Make sure you have the `.env` files.
* Install project dependencies : `npm install`
* Run the project: `nodemon app.js`

## Roles
employee, admin

## APIs
login
* GET  `http://localhost:3000/login`
```
{
        "username": "Juan",
        "password": "1234"	
}
```
* GET  `http://localhost:3000/users`
## Users
Diana 123
Juan 1234. Employee
JuanKarlos 2222
Diego 2222
