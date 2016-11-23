# `Testing a Dynamic Web Page with AMP and Express-Handlebars`

This project was created in order to see if it's possible to build a dynamic Amp website using Express-Handlebars

NOTE: in order to run this project, node and npm must be installed.

Installation and Running:
1. npm install
2. node ampHand.js
3. view the project in your browser by going to localhost:3000


Things to do:
* Attach Google Analytics

Current Build Issues:
* Breaks the first time the server tries to load the site, but works after that

Current notes:
* There is a sidebar that we can use for a menu
* CMS data can be pulled onto the page using Express http
* Forms can exist, but is a bit funky
* CSS has a size limit (50,000 bytes)
* Amp-iframe must be at least 75% down the page or below the fold
* No similar issues with amp-video
* Amp-Anaytics for using Google Analytics

Server Needs:
* Node server
* Redirect to mobile site when on mobile devices