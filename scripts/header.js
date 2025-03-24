/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Function to highlight the active nav link.
 */
export function updateActiveNavLink() {
    console.log("[INFO] update Active Nav Link");
    const currentPage = document.title.trim();
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        var _a;
        if (((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === currentPage) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}
/**
 * Function to load the header dynamically.
 */
export function loadHeader() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Loading Header...");
        try {
            const response = yield fetch("views/components/header.html");
            if (!response.ok) {
                throw new Error("Failed to fetch header.");
            }
            const data = yield response.text();
            document.querySelector("header").innerHTML = data;
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
                            var _a;
                            (_a = document.getElementById("navbarSupportedContent")) === null || _a === void 0 ? void 0 : _a.classList.toggle("show");
                        });
                    });
                });
            }, 0);
        }
        catch (error) {
            console.error("[ERROR] Unable to load Header:", error);
        }
    });
}
/**
 * Function to check if the user is logged in and updates the login buton to logout.
 * @returns
 */
export function checkLogin(router) {
    console.log("checking if user is logged in...");
    const loginNav = document.getElementById("login");
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
            router.navigate("/");
        });
    }
    else {
        loginNav.innerHTML = `Login`;
    }
}
//# sourceMappingURL=header.js.map