# A notes, micro blog journaling nodejs app.

Inspired during a timemanagement training to write your thoughs away in a journal or diary to empty your mind.
Or as said in Dutch 'van je af schrijven'.

This is a online journaling webserver that works for me. 
A tool to build a repository of thoughts, or create a page that can be shared with anyone. I've added this nodejs app behind a nginx reverse proxy server and use PM2 as heartbeat tool (both not documented here)

## Features

 * Content hidden by default
 * Write in markdown
 * Share page url in read mode
 * Simple to install
 * Speed

## Requirements

 * [node.js](http://nodejs.org/)
 * [mongodb](http://www.mongodb.org/)

### Ubuntu
    
  `$ sudo apt-get install mongodb`

## Install Journaling
    
    $ git clone https://github.com/JohannesKalma/journaling.git
    $ cd journaling
    $ npm install

## Setup
    .env file must be created, with these variables:
    PORT=3000
    BASE_URL=
    COOKIE_PARSER_KEY=
    ACCESS_TOKEN_KEY=
    USER_KEY= 
    MONGODB="mongodb://127.0.0.1:27017/documents" 

## Start the server
    $ npm run start

## Used modules
Backend:
  * express router
  * ejs based views
  * mongoose model
  * jsonwebtoken for authentication
  * markdown-it encode markdown to html

Client:
  * [EasyMDE - Markdown Editor](https://github.com/Ionaru/easy-markdown-editor)

## Screenshots
![image](https://raw.githubusercontent.com/JohannesKalma/JohannesKalma/main/images/Screenshot%202023-11-19%2021.34.06.png)

![image](https://raw.githubusercontent.com/JohannesKalma/JohannesKalma/main/images/Screenshot%202023-11-19%2021.34.06.png)
 
