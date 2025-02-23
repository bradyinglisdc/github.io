/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/
/**
 * Function to highlight the active nav link.
 */
function updateActiveNavLink() {
    console.log("[INFO] update Active Nav Link");

    const currentPage = document.title.trim();
    const navLinks = document.querySelectorAll('nav a')

    navLinks.forEach(link => {
        if(link.textContent.trim() === currentPage) {
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
        const response = await fetch("header.html");
        if (!response.ok) {
            throw new Error("Failed to fetch header.");
        }
        const data = await response.text();
        document.querySelector("header").innerHTML = data;
        updateActiveNavLink();

        // Ensure navbar modifications happen after the header loads - await this so this thread does not continue until completion
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                import("./pageSetup.js").then(({ PageSetup }) => {
                    PageSetup.setNavBar();

                    // Reinitialize Bootstrap dropdowns manually
                    if (window.bootstrap) {
                        document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
                            new bootstrap.Dropdown(dropdown);
                            resolve();
                        });
                    }

                    else {
                        reject();
                    }
                });
            }, 0);
        });
    } catch (error) {
        console.error("[ERROR] Unable to load Header:", error);
    }
}

/**
 * Function to check if the user is logged in and updates the login buton to logout.
 * @returns 
 */
export function checkLogin(){
    console.log("checking is user logged in...");

    const loginNav = document.getElementById("login");

    if (!loginNav) {
        console.warn("login nav element not found");
        return;
    }

    const userSession = sessionStorage.getItem("user");

    if (userSession) {
        loginNav.innerHTML = `Logout`
        loginNav.href = "#"
        loginNav.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("user");
            location.href = "index.html";
        });
    }
}