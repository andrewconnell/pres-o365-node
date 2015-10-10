Node.js Website with AzureAD & Office 365 Integration
=================================================
This sample demonstrates how to create a website using [Node.js](http://www.nodejs.org) that authenticates with AzureAD & Office 365 using REST APIs. In this sample the website is bare-bones... implemented as an MVC style site using [Handlebars](https://github.com/donpark/hbs) as the view engine. All JavaScript in this sample is written using [TypeScript](http://typescriptlang.org).

The Scenario - End User
-----------------------
This sample simply uses a simple website that shows how to authenticate with AzureAD, obtain access tokens and query different Office 365 services via the REST APIs.

Scenario Explained
------------------
The Node.js application is written in TypeScript and is compiled down to JavaScript using either the developer's IDE or using a build process implemented using [gulp](http://gulpjs.com/) (*more on the build process below*). The view engine for the MVC site leverages [Handlebars](https://github.com/donpark/hbs).

The site uses sessions to persist the currently logged in user and store credential information for specified endpoints (*ie: access tokens, resource IDs and endpoints for Office 365 and Azure endpoints*). The sessions are stored in JSON files located in the `/sessions` folder. This is not a great production practice, rather you should look at some of the packages for using something like [Redis, Mongo or others](https://github.com/expressjs/session#compatible-session-stores). The file store is used to easily view the session contents.

Developer Application Requirements
----------------------------------
This sample can be run from any platform (Windows, OS X or Linux) and use any developer IDE of choice (Visual Studio, WebStorm, Brackets, notepad). You do need Node.js installed and the following packages must be installed globally on your environment:

- bower
- express
- tsd
- typescript

Install these globally using the following command:

````
npm install -g bower express typescript tsd
````

Furthermore you can install the following additional packages globally if you want to run the build process:

- gulp
- nodemon
- node-inspector

### Compile Everything
First obtain all external references, packages & type definitions by running the following command:

````
npm install
````

This will (1) download all NPM packages referenced in the project, (2) download all bower packages and (3) download all TypeScript type definitions. Stes 2 & 3 are done after `npm install` completes as dictated by a script in the `package.json` file. You can run them manually using `bower install` and `tsd reinstall` if you wanted.

Compile the TypeScript, used in Node.js application, by running the following command from within the root of the application:

````
gulp compile-server-ts
````

You can remove all compiled JavaScript and source maps by running the following:

````
gulp clean-ts
````

When developing you can run the following. This will monitor any changes to TypeScript and handlebars files (used as the MVC view engine in the Node.js application). If any changes are detected it will automatically do the following things:

- **lint all TypeScript** (gulp task **lint**): This will check all TypeScript to ensure it meets the coding style rules defined in the [tslint.json](tslint.json) file.
- **update TypeScript references** (gulp task **gen-server-tsrefs**): There are three files referenced at the top of every TypeScript file. The first, **/tools/typings/tsd.d.ts**, contains references to all TypeScript type definition files obtained using the tool [tsd.exe](http://definitelytyped.org/tsd). The other other file that's referenced is **/tools/typings/server.d.ts**... it references the TypeScript files used within the application. This saves the developer from adding all these references to each and every file in the project.
- **comile all TypeScript** (gulp task **compile-server-ts**): This compiles all the TypeScript to JavaScript.

Running the Application
-----------------------
The application, as it stands in the GitHub repo, is configured to run locally.

Developing with WebStorm
------------------------
This sample was built using WebStorm, but you can use any IDE you want. The way I developed it was to open a Terminal / command window and run `gulp` which did all the compilation and updates to the app and then monitored it for changes. I also created a new run configuration which is shown in this blog post: [Running and debugging Node.js application](http://blog.jetbrains.com/webstorm/2014/02/running-and-debugging-node-js-application/). For the specific settings in my configuration:

- **Node parameters**: --debug
  - *only necessary if you want to debug with breakpoints*
- **Working directory**: (path to this folder)
- **JavaScript File**: src/server/server.js

Developing with Anything Else
-----------------------------
You can use any tool you want to customize this application, including Visual Studio provided you have the Node.js tools for Visual Studio installed.

If you use any other text editor, you can setup debugging. First turn on **node-inspector** for rich Node.js debugging using the browser's developer tools:

````
node-inspector
````

Then run the following gulp task that will do the same watching, linting & recompilation that I mentioned above, except it will also automatically restart the Node.js process to get the latest code changes:

````
gulp watch-nodemon
````
