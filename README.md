# How to Run using PM2

Using PM2 - production process manager for Node.js 
* Install it by doing ```npm install pm2 -g```
* Navigate to project folder (i.e. ~/Developer/project-chat)
* Run ```pm2 start ./bin/www``` to start app
* Run ```pm2 stop all --watch=0``` to stop all apps
* ```pm2 stop all --watch 0``` -- to stop all processes
* ```pm2 start all --watch 1``` -- to start all processes
* ```pm2 logs``` -- to get a stream of the logs

[User Authentication with Passport and Express 4](http://mherman.org/blog/2015/01/31/local-authentication-with-passport-and-express-4/#.V6aJKZMrKRs)