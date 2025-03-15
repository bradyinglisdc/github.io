"use strict";

/**
 * Loads the navbar into the current page
 * @returns {Promise<void>}
 */
export async function loadHeader() {
    console.log("loadHeader called...");

    return fetch("./views/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
            updateActiveNavLink();
            checkLogin();
        })
        .catch (error => console.error("[ERROR] Error loading header"));
}

/**
 * Changes header nav link to display current page as active
 */
export function updateActiveNavLink() {
    console.log("updateActiveNavLink called...");

    // Get the current path
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href").replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add("active");
        }

        else {
            link.classList.remove("active");
        }
    })
}

function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem("user");

    loadHeader().then(() => {
        location.hash = "/";
    })
}

function checkLogin() {
    console.log("checking is user logged in...");

    const loginNav = document.getElementById("login");

    if (!loginNav) {
        console.warn("login nav element not found");
        return;
    }

    const userSession = sessionStorage.getItem("user");

    if (userSession) {
        loginNav.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Logout`
        loginNav.href = "#"
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);
    } else {
        loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", () => location.hash = "/login");
    }
}

