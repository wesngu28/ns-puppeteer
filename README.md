# NS Puppeteer
NS Puppeteer is a web application that allows you to automatically log in to all your puppets, as well as restore those that have ceased to exist. Perfect for raiders or trading card deviants or those who just like having a lot of nations.

Heavily inspired from Auralia's [nslogin-web](https://github.com/auralia/nslogin-web) but rewritten (for better or worse) in Svelte. Uses their iframe to act as a hidden form in order to restore, otherwise I'd have probably set up Playwright and mocked it (which I'm not sure how that runs in the ToS). I removed the part that deals with log-in. Restore request is also based off theirs but is changed to use vanilla JS APIs instead of JQuery. A lot of the feature-set is the same.

Delay between requests is currently set to 1 seconds. This is a bit on the safe side (50 requests per 30 seconds) and each nation's ping generates 1 api call. Delay between restore requests rely on one request every 6 seconds.

## Features
1. Enter a list of nations to run through, and the app will log in or restore as needed.
2. Aggressively saves to local storage so you don't have to worry about forgetting to click save.
3. Ability to export and import your nation list to a text file. Clear your history and cache without worrying about losing your puppet list.

## Usage
To run this web app yourself, run the following commands.
```
git clone https://github.com/wesngu28/ns-puppeteer.git

npm install

npm run dev
```
The website will run on port 5413 by default.
