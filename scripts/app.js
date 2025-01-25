/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Jan 25, 2025
*/

"use strict";

// Imports
import {PageSetup} from "./pageSetup.js";

/**
 * IIFE: Called as soon as defined in run time.
 */
(function(){

    // On window load, a given page will be dynamically initialized
    window.addEventListener('load', start)
})()

/**
 * Sets up the current page dynamically.
 */
async function start(){
    console.log(`Setting up ${document.title}...`);

    // Calls the respective function to dynamically set up the current page - defaults are always setup.
    PageSetup.setupDefaults();
    switch (document.title) {
        case "Home":
            PageSetup.setupHome();
            break;
        case "Opportunities":
            await PageSetup.setupOpportunities();
            break;
        case "Events":
            PageSetup.setupEvents();
            break;
        case "Contacts":
            PageSetup.setupContacts();
            break;
        case "Donate":
            PageSetup.setupDonate();
    }
}
