# proj6102

## Project setup
```
npm install
```
Remember to create database.
```
create database if not exist user_management;
use user_management;

create table users(id int primary key auto_increment,username varchar(50) unique not null,password varchar(100) not null,email varchar(100) not null);
```
Please edit the content in the .env file to adapt to your own environment.

### Compiles and hot-reloads for development
```
npm run serve
```
then,
```
cd backend
```
```
node backend.js
```
### Create an admin acount
Register a user named admin.

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
