/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Jan 25, 2025
*/

"use strict";

// Imports
import {PageSetup} from "./pageSetup.js";
import {loadHeader} from "./header.js";
import {checkLogin} from "./header.js";

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

    await loadHeader();
    checkLogin();

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
            await PageSetup.setupEvents();
            break;
        case "Contacts":
            PageSetup.setupContacts();
            break;
        case "Donate":
            PageSetup.setupDonate();
            break;
        case "Gallery":
            await PageSetup.setupGallery();
            break;
        case "Login":
            PageSetup.setupLogin();
            break;
        case "News":
            await PageSetup.setupNews();
            break;
        case "Privacy Policy":
            PageSetup.setupLegal();
            break;
        case "Terms Of Service":
            PageSetup.setupLegal();
            break;
        default:
            console.log("[WARN] Should not happen")
            break;
    }
}
