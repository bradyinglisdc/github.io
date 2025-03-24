"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Imports
import { PageSetup } from "./pageSetup.js";
import { loadHeader, checkLogin, updateActiveNavLink } from "./header.js";
import { Router } from "./router.js";
import { authGuard } from "./authguard.js";
// Constants
const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/contacts": "views/pages/contacts.html",
    "/donate": "views/pages/donate.html",
    "/events": "views/pages/events.html",
    "/gallery": "views/pages/gallery.html",
    "/login": "views/pages/login.html",
    "/news": "views/pages/news.html",
    "/opportunities": "views/pages/opportunities.html",
    "/privacy-policy": "views/pages/privacy-policy.html",
    "/terms-of-service": "views/pages/terms-of-service.html",
    "/404": "views/pages/404.html",
    "/statistics": "views/pages/statistics.html",
    "/events-planning": "views/pages/events-planning.html"
};
const titles = {
    "/": "Home",
    "/home": "Home",
    "/contacts": "Contact Us",
    "/donate": "Donate",
    "/events": "Events",
    "/gallery": "Gallery",
    "/login": "Login",
    "/news": "News",
    "/opportunities": "Opportunities",
    "/privacy-policy": "Privacy Policy",
    "/terms-of-service": "Terms of Service",
    "/404": "Page not Found!",
    "/statistics": "Statistics",
    "/events-planning": "Events Planning"
};
/**
 * IIFE: Called as soon as defined in run time.
 */
(function () {
    window.addEventListener("load", start);
})();
/**
 * Sets up the current page dynamically.
 */
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Initializing app...");
        // Load all data into memory
        yield PageSetup.grabLocalJSON("events");
        yield PageSetup.grabLocalJSON("opportunities");
        yield PageSetup.grabLocalJSON("siteStatistics");
        // Subscribe to session expired event
        window.addEventListener('sessionExpired', () => {
            router.navigate("/");
        });
        // Header loaded in only once rather than after each route is loaded
        yield loadHeader();
        // Set default hash if needed, then instantiate router object
        if (!location.hash) {
            location.hash = "/";
        }
        const router = new Router(routes);
        document.addEventListener("routeLoaded", (e) => {
            const path = e.detail;
            // Load document title, then update nav link and check login
            document.title = titles[path] || "/";
            updateActiveNavLink();
            checkLogin(router);
            // Setup page with js
            authGuard();
            PageSetup.setupDefaults();
            switch (path) {
                case "/":
                case "/home":
                    PageSetup.setupHome(router);
                    break;
                case "/opportunities":
                    PageSetup.setupOpportunities();
                    break;
                case "/events":
                    PageSetup.setupEvents();
                    break;
                case "/contact":
                    PageSetup.setupContacts(router);
                    break;
                case "/login":
                    PageSetup.setupLogin(router);
                    break;
                case "/donate":
                    PageSetup.setupDonate();
                    break;
                case "/gallery":
                    PageSetup.setupGallery();
                    break;
                case "/news":
                    PageSetup.setupNews();
                    break;
                case "/privacy-policy":
                case "/terms-of-service":
                    PageSetup.setupLegal();
                    break;
                case "/404":
                    PageSetup.setupLegal(); // or PageSetup.setup404() if defined
                    break;
                case "/statistics":
                    PageSetup.setupStatistics();
                    break;
                case "/events-planning":
                    PageSetup.setupEventsPlanning();
                    break;
                default:
                    console.warn("Unhandled route:", path);
                    break;
            }
        });
    });
}
//# sourceMappingURL=app.js.map