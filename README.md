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

# To Deploy
Use Heroku and mLab MongoDB for Database (it's free)
* Sign up with Heroku 
* Follow the deployment guide or literally in your project, run the following commands:
* ```cd project-chat```
* ```heroku create```
* ```git push heroku master```
* ```heroku open```
* Make sure your env variable for mLab MongoDB connection is ```MONGODB_URI```
* The mLab connection pattern should be something like: 'mongodb://user:pass@host:port/db'
* Heroku automatically does npm install and package.json script automatically starts via "node app.js" for you

[Heroku](https://www.heroku.com/home)
[mLab MongoDB](https://elements.heroku.com/addons/mongolab)
[Deployment Guide](https://github.com/heroku/node-js-getting-started)