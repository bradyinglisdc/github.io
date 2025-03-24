/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/

import {PageSetup} from "./pageSetup.js"
import {Router} from "./router.js"

declare global {
    interface Window {
        bootstrap: any;
    }
}

/**
 * Function to highlight the active nav link.
 */
export function updateActiveNavLink() {
    console.log("[INFO] update Active Nav Link");

    const currentPage = document.title.trim();
    const navLinks = document.querySelectorAll('nav a')

    navLinks.forEach(link => {
        if(link.textContent?.trim() === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Function to load the header dynamically.
 */
export async function loadHeader() {
    console.log("Loading Header...");
    
    try {
        const response = await fetch("views/components/header.html");
        if (!response.ok) {
            throw new Error("Failed to fetch header.");
        }
        const data = await response.text();
        (document.querySelector("header") as HTMLElement).innerHTML = data;

        updateActiveNavLink();

        // Wait for the DOM to update before modifying the navbar
        setTimeout(() => {
            import("./pageSetup.js").then(({ PageSetup }) => {
                PageSetup.setNavBar();

                if (window.bootstrap) {
                    document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
                        new window.bootstrap.Dropdown(dropdown);
                    });
                }

                document.querySelectorAll(".navbar-toggler").forEach((btn) => {
                    btn.addEventListener("click", () => {
                        document.getElementById("navbarSupportedContent")?.classList.toggle("show");
                    });
                });

            });
        }, 0);
    } catch (error) {
        console.error("[ERROR] Unable to load Header:", error);
    }
}


/**
 * Function to check if the user is logged in and updates the login buton to logout.
 * @returns 
 */
export function checkLogin(router : Router) {
    console.log("checking if user is logged in...");

    const loginNav = document.getElementById("login") as HTMLAnchorElement;

    if (!loginNav) {
        console.warn("login nav element not found");
        return;
    }

    const userSession = sessionStorage.getItem("user");

    if (userSession) {
        loginNav.innerHTML = `Logout`;
        loginNav.href = "#"; // Now TypeScript knows it's an anchor element
        loginNav.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("user");
            router.navigate("/")
        });
    }
    else {
        loginNav.innerHTML = `Login`;
    }
}