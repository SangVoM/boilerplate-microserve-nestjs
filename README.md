# BOILER PLATE MICROSERVICE Docker

## Usage example

### Step 1: Init project

* Open 'boilerplate-microservice-nestjs' folder in terminal and run this command

```
bash start.sh
```

### Step 2: Init database

* create schema database

```
docker exec -it app-service_1 yarn migrate:init-schema 
```

* create tables database

```
docker exec -it app-service_1 yarn migrate:run
```

### Step 3: Access

* Json rpc api:
  <a href="http://localhost:3001/rpc/v1">api-gateway</a>
  <br/>

* Example request
  ```
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "user.register",
    "params": {
        "username": "sangvm",
        "email": "sang.vo@smartdev.com",
        "password": "123123123",
        "passwordConfirm": "123123123"
  }
  ```

## Other

### Log System

* api-gateway

```
docker logs --tail 1000 api-gateway_1 
```

* app-service

```
docker logs --tail 1000 app-service_1 
```
