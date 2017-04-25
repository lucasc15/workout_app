Workout App
===========

A simple Cordova/Ionic/Phonegap application for entering working data to track progress.

#Setup
------
To setup, clone the repository, then complete the following 

*`bower install` to download dependencies
*`cordova platform add android` to create a runnable project
*`cordova prepare` to allow for emulation
*`ripple emulate` to test in the browser.

Sometimes random errors stop it from running, and I found this helped:

*`cordova platform remove android`
*`cordova platform add android`
*`cordova prepare`

Requires cordova and ripple installed.

*`npm install cordova`
*`npm install ripple`
