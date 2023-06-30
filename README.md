# TODO Application

## Structure

This repository consists of 2 folders (todo-backend, todo-web) which is the backend and frontend project respectively. 
The `docker-postgres-init.sql` is the init script for postgres image to create application and testing db.

## Start

`docker-compose up -d` 

Open browser and go to `http://localhost:8080`

## Thoughts

### Backend

It is a nest.js application with users, items resources endpoint.

users:
- Only POST, GET One endpoints are created for simplicity
- No login flow involved
- Act as an identifier to distinguish between different user's notes

items:
- GET, PUT, POST, DELETE endpoints are created.
- Pagination is made for the GET Many endpoints

Involved 2 interceptors 
- LoggingInterceptor: log incoming request,process time
- ResponseInterceptor: Map the response
  
Involved a simple guard 
- SimpleAuthGuard: More on getting the request user rather than doing authentication

Testing
- `yarn test:e2e`
Focused on e2e test more because it is a simple todo api service
Most of the endpoints are calling the corresponding service function directly. Writing e2e test can already confirm everything is working as expected without spending extra effort on unit testing.

DB Migration
Created the typeorm migration script `migration:generate / migration:run` to handle the DB migrations
`synchronize` for typeorm initialization is set to `true` in the code for simplicity of Dockerfile
It would be easier to put the execution of migration script in CD stage rather than building stage

### Frontend

Simple CRA

utilized 
react-query for API consumption
material-ui for better ui component
zustand for minimalistic state management (used to persist the userId mainly)