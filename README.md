TC39 Timebox
============

**<https://timebox.now.sh>**

**This app helps TC39 stay on agenda during meetings.** Essentially it's an over-engineered, real-time, collaborative timer.

[![TC39 Timebox screenshot](https://cloud.githubusercontent.com/assets/29096/19759322/7b442876-9bfa-11e6-8928-a07afcb884ef.png)](https://timebox.now.sh)

## Overview

The app allows TC39 members (authenticated via GitHub) to set the current meeting agenda (parsed from the [agenda Markdown files](https://github.com/tc39/agendas)), and select a timeboxed agenda item to start the timer. The UI is real-time and collaborative, so any mutations made by a TC39 member are seen by everyone using/viewing the app.

The app written in JavaScript (of course) and is built on these wonderful technologies:

- [React](https://facebook.github.io/react/)
- [React Native Web](https://github.com/necolas/react-native-web)
- [React Router v4](https://react-router.now.sh)
- [Create React App](https://github.com/facebookincubator/create-react-app)
- [Firebase](https://firebase.google.com)
- [Now](https://zeit.co/now/)

## Developing

Getting setup for development is a bit more involved since you'll need to create a (free) Firebase app and database to connect to during development.

Once you clone the repo, install the dependencies.

```
cd timebox/
npm install
```

### Setup Firebase

It's easiest to install the Firebase CLI to setup the Firebase project.

```
npm install -g firebase-tools
```

Inside the `timebox` directory, you can now initialize the Firebase project. You'll be asked a series of questions that you can answer as shown here:

```
firebase init

? What Firebase CLI features do you want to setup for this folder?
 ◉ Database: Deploy Firebase Realtime Database Rules
❯◯ Hosting: Configure and deploy Firebase Hosting sites

? What Firebase project do you want to associate as default?
❯ [create a new project]

? What file should be used for Database Rules? database.rules.json
? File database.rules.json already exists. Do you want to overwrite it with the
Database Rules for undefined from the Firebase Console? No
Skipping overwrite of Database Rules.
The rules defined in database.rules.json will be published when you do firebase
deploy.

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!

Project creation is only available from the Firebase Console
Please visit https://console.firebase.google.com to create a new project, then
run firebase use --add
```

#### Create Firebase Project

As the Firebase CLI says, navigate to <https://console.firebase.google.com> to create a Firebase project to use for development. You can name your Firebase project: __timebox-dev__.

Once the project is created, select the _Add Firebase to your web app_ button, then __create a `.env` file with your project's configuration:__

```
REACT_APP_API_KEY=<apiKey>
REACT_APP_AUTH_DOMAIN=<authDomain>
REACT_APP_DATABASE_URL=<databaseURL>
```

**Note:** You can copy `.env.example` --> `.env` and fill in the values.

This configuration will be picked up by the app during the dev and build processes and will be used to configure Firebase when running in the browser.

Now back to the Firebase CLI, finish the init process by running the following:

```
firebase use --add

? Which project do you want to add? timebox-dev
? What alias do you want to use for this project? (e.g. staging) dev

Created alias dev for timebox-dev.
Now using alias dev (timebox-dev)
```

#### Deploy Firebase Database

With your Firebase project all setup, you can now create a version of the database which gives __your GitHub account__ write access and deploy that database and its rules to Firebase:

```
node scripts/create-db ericf | firebase database:set -y "/" && firebase deploy

✔  Data persisted successfully

View data at: https://console.firebase.google.com/project/timebox-dev/database/data/

=== Deploying to 'timebox-dev'...

i  deploying database
✔  database: rules ready to deploy.
i  starting release process (may take several minutes)...

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/timebox-dev/overview
Hosting URL: https://timebox-dev.firebaseapp.com
```

#### Setup Firebase Authentication

1. Navigate to Authentication --> Sign-In Method
2. Enable Anonymous
3. Enable GitHub

**Note:** Setting up GitHub authentication is a bit more involved, but it should only take a minute if you follow these instructions: <https://firebase.google.com/docs/auth/web/github-auth#before_you_begin>

### Running the App

Now with Firebase all setup, you can run the app and start developing:

```
npm run dev
```

## Deploying

The app is deployed to and served from [Now](https://zeit.co/now/). You can deploy to Now as well by first following the instructions to get started: <https://zeit.co/now/#get-started>

### Create a Production Firebase Project

Follow the [Firebase setup instructions above](#setup-firebase) to create _another_ Firebase project to use in production. This way the database is isolated from your development database.

### Setup Now Secrets

You need to configure your Now account with secrets that can be mapped to environment variables for your Now deployments. This way your local `.env` file is configured for your development Firebase project, while Now is configured with your production Firebase project.

You should first read through the help on Now's secrets feature:

```
now help secrets
```

Create the following secrets to configure Now with your production Firebase project:

```
now secrets add timebox_prod_api_key "<apiKey>"
now secrets add timebox_prod_auth_domain "<authDomain>"
now secrets add timebox_prod_database_url "<databaseURL>"
```

### Deploy to Now

With the production Firebase project setup and Now secrets configured to it, you can run the following command which will deploy the app to Now with all the proper environment variables:

```
npm run now
```
