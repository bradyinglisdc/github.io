/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Jan 25, 2025
*/

import {Router} from "./router.js";
import {OpportunitiesPageSetup} from "./opportunitiesPageSetup.js";
import {EventsPageSetup} from "./eventsPageSetup.js";
import {NewsPageSetup} from "./newsPageSetup.js";
import {StatisticsPageSetup} from "./statisticsPageSetup.js";
import {EventsPlanningPageSetup} from "./eventsPlanningPageSetup.js";

/**
 * A collection of static functions used for the purpose of dynamically setting up pages.
 */
export class PageSetup {

    /**
     * Any default document items that should be dynamically set in .js are set here.
     */
    static setupDefaults() {

        // Show user dropdown if logged in
        const userNavItem = document.getElementById("userNavItem");
        if (sessionStorage.getItem("user") && userNavItem) {
            userNavItem.classList.remove("d-none");
        }

        // Hide search area initially
        const searchArea = document.getElementById("globalSearchArea");
        if (searchArea) {
            searchArea.classList.add("d-none");
        }

        // Subscribe event listener to scroll event such that scroll to top button appears when needed.
        const btnScrollToTop = document.getElementById("btnScrollToTop") as HTMLButtonElement;
        btnScrollToTop.style.opacity = "none";
        btnScrollToTop.addEventListener("click", function () {
            window.scrollTo(0, 0);
        });
        window.addEventListener("scroll", function () {
            if (window.scrollY > 0) {
                btnScrollToTop.style.opacity = "100";
                return;
            }
            btnScrollToTop.style.opacity = "0";
        });
    }

    /**
     * Any element to be changed/programmatically added to the navbar is added here.
     */
    static setNavBar() {

        // "Donate" link programmatically created here.
        const donateItem = document.createElement("li");
        const donateLink = document.createElement("a");
        donateItem.appendChild(donateLink);
        donateItem.className = "nav-item";
        donateLink.className = "nav-link";
        donateLink.id = "donateNavItem";
        donateLink.href = "#/donate";
        donateLink.innerHTML = "Donate";

        // Donate link added to nav bar before second last nav item, such that it remains next to login.
        const navbar = document.getElementById("navbar") as HTMLElement;
        const lastNavItem = navbar.children[navbar.children.length - 3];
        navbar.insertBefore(donateItem, lastNavItem);

        // Opportunities link text changed to "Volunteer Now".
        const opportunitiesNavItem = document.getElementById("opportunitiesNavItem");
        if (opportunitiesNavItem) {
            opportunitiesNavItem.innerText = "Volunteer Now";
        } else {
            console.error("Element with id 'opportunitiesNavItem' not found");
        }

    }

    /**
     * Dynamically sets up home page (to be called on window load on home page).
     */
    static setupHome(router: Router) {
        const getInvolvedButton = document.getElementById("getInvolvedButton");
        if (getInvolvedButton) {
            getInvolvedButton.addEventListener("click", function () {
                router.navigate("/opportunities")
            });
        } else {
            console.error("Element with id getInvolvedButton not found");
        }
    }

    /**
     * Dynamically loads opportunities JSON into memory.
     * @returns {Promise<void>}
     */
    static async setupOpportunities(): Promise<void> {

        // Grab opportunities and store them in session storage with grabLocalJSON, then setup page.
        OpportunitiesPageSetup.displayOpportunities();
        setTimeout(PageSetup.setupSearchArea, 0);
    }

    /**
     * Dynamically loads events JSON into memory.
     * @returns {Promise<void>}
     */
    static async setupEvents(): Promise<void> {

        // Grab events and store them in session storage with grabLocalJSON, then setup page.
        EventsPageSetup.displayEvents();
        setTimeout(PageSetup.setupSearchArea, 0);
    }

    /**
     * Dynamically sets up search area based on current page.
     */
    static setupSearchArea() {

        const searchArea = document.getElementById("globalSearchArea");
        const searchInput = document.getElementById("globalSearchInput") as HTMLInputElement;
        const btnSearch = document.getElementById("btnGlobalSearch");

        if (!searchArea || !btnSearch) {
            console.warn("One or more elements not found.")
            return;
        }
        // Swap search input placeholder based on page
        if (document.title === "Opportunities") {
            searchInput.placeholder = "Search opportunities...";
            btnSearch.addEventListener("click", OpportunitiesPageSetup.sortOpportunities);
        } else {
            searchInput.placeholder = "Search events...";
            btnSearch.addEventListener("click", EventsPageSetup.sortEvents);
        }

        // Make search area visible
        searchArea.classList.remove("d-none");
    }

    /**
     * Grabs specified JSON from site-data and saves to session storage.
     */
    static async grabLocalJSON(fetchItem: string): Promise<any> {

        // Grab JSON, store in session storage.
        let JSONToStore;
        try {
            const response = await fetch(`./site-data/${fetchItem}.json`);
            if (!response.ok) {
                throw new Error("Invalid Response.");
            }
            JSONToStore = await response.json();

        } catch (error) {
            console.error(`Could not fetch: ${fetchItem}:` + error);
        }

        // Save to session storage
        sessionStorage.setItem(`${fetchItem}`, JSON.stringify(JSONToStore));
    }

    /**
     * Dynamically sets up news page.
     */
    static async setupNews(): Promise<void> {

        // Indicate load
        const resultsContainer = document.getElementById("newsResults");
        if (!resultsContainer) {
            console.error("[ERROR] News results container or status container not found.");
            return;
        }

        resultsContainer.innerHTML += `<h4 class="h-100 d-flex justify-content-center align-items-center" id="statusDisclaimer">Pulling local news, this may take a few seconds...</h4>`;

        let data;
        try {
            const response = await fetch(NewsPageSetup.localNewsURL);
            if (!response.ok) {
                throw new Error("Bad Response.");
            }
            data = await response.json();
        } catch (error) {
            console.log("Error fetching local news: " + error);
            resultsContainer.innerText = "Could not fetch local news.";
        }

        // Create JSON array
        const communityNews: {
            articles: {
                org: string;
                name: string;
                description: string;
                url: string;
            }[]
        } = {
            articles: []
        }

        // Add necessary data for each article into the array
        for (const article of data.articles) {
            let articleOrg: string = (article.source.name as string).split(".")[0];
            let articleName: string = (article.title as string);
            let articleDescription: string = (article.description as string);
            let articleUrl: string = (article.url as string);

            communityNews.articles.push({
                org: articleOrg,
                name: articleName,
                description: articleDescription,
                url: articleUrl
            });
        }

        // Add array to session storage
        sessionStorage.setItem("communityNews", JSON.stringify(communityNews));

        // Initialize and display news
        await NewsPageSetup.initialize();
    }


    /**
     * Dynamically sets up contacts page.
     */
    static setupContacts(router: Router): void {
        const sendButton = document.getElementById("sendButton") as HTMLButtonElement | null;
        const contactForm = document.getElementById("contactForm") as HTMLFormElement | null;

        if (!sendButton || !contactForm) {
            console.error("Missing send button or contact form.");
            return;
        }

        sendButton.addEventListener("click", function (event: Event) {
            event.preventDefault(); // Prevent form submission

            if (contactForm.checkValidity()) {
                alert("Thank you!");
                setTimeout(() => {
                    router.navigate("/")
                }, 5000);
            } else {
                contactForm.classList.add("was-validated");
            }
        });
    }


    /**
     * Dynamically sets up donate page.
     */
    static setupDonate() {
        // Since donate nav link is added programmatically, it is manually set to active here.
        const donateNavItem = document.getElementById("donateNavItem")

        if (!donateNavItem) {
            console.warn("Missing HTML Element")
            return;
        }
        donateNavItem.className = "nav-link active";
    }

    /**
     * Simply submits signup using modal form details in opportunities.html.
     */
    static signUpOpportunity(): void {
        const fullNameInput = document.getElementById("fullName") as HTMLInputElement | null;
        const emailInput = document.getElementById("emailAddress") as HTMLInputElement | null;
        const preferredRoleInput = document.getElementById("preferredRole") as HTMLInputElement | null;
        const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement | null;
        const successMessage = document.getElementById("successMessage") as HTMLElement | null;
        const errorMessage = document.getElementById("errorMessage") as HTMLElement | null;

        if (!fullNameInput || !emailInput || !preferredRoleInput || !signUpButton || !successMessage || !errorMessage) {
            console.error("One or more required elements are missing.");
            return;
        }

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const preferredRole = preferredRoleInput.value.trim();

        if (!fullName || !email || !preferredRole) {
            alert("All fields are required.");
            return;
        }

        // Verify email - show success message if success, else error message.
        if (Opportunity.signUp("1", fullName, email, preferredRole)) {
            signUpButton.hidden = true;
            signUpButton.disabled = true;
            successMessage.hidden = false;
            errorMessage.hidden = true;
        } else {
            errorMessage.hidden = false;
            successMessage.hidden = true;
        }
    }


    /**
     * Resets opportunity form such that no messages are visible, and buttons are enabled.
     */
    static resetOpportunityForm(): void {
        const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement | null;
        const successMessage = document.getElementById("successMessage") as HTMLElement | null;
        const errorMessage = document.getElementById("errorMessage") as HTMLElement | null;

        if (signUpButton) {
            signUpButton.hidden = false;
            signUpButton.disabled = false;
        } else {
            console.warn("Element 'signUpButton' not found.");
        }

        if (successMessage) {
            successMessage.hidden = true;
        } else {
            console.warn("Element 'successMessage' not found.");
        }

        if (errorMessage) {
            errorMessage.hidden = true;
        } else {
            console.warn("Element 'errorMessage' not found.");
        }
    }


    /**
     * Creates an opportunity card in html with the provided json.
     * @param opportunity The opportunity data to create from.
     */
    static createOpportunityCard(opportunity: {
        opportunityID: string;
        title: string;
        organization: string;
        date: string;
        time: string;
        description: string;
    }): void {
        // Define the div from which the card data should be added.
        const opportunityCard = document.createElement("div");
        opportunityCard.className = "opportunity-card";

        // The HTML created directly for the opportunity.
        opportunityCard.innerHTML = `
            <h5>${opportunity.title}</h5>
            <p class="p-0 m-0"><strong>Organization:</strong> ${opportunity.organization}</p>
            <p class="p-0 m-0"><strong>Date:</strong> ${opportunity.date}</p>
            <p class="p-0 m-0"><strong>Time:</strong> ${opportunity.time}</p>
            <p class="p-0 m-0 opportunity-description"><strong>Description:</strong> ${opportunity.description}</p>
            <div class="d-flex justify-content-end align-items-end">
                <button id="_${opportunity.opportunityID}signUpButton" type="button" class="opportunity-card-button" data-bs-toggle="modal" data-bs-target="#signUpForm">
                    Sign up
                </button>
            </div>
        `;

        // Append the new opportunity.
        const opportunityCardsContainer = document.getElementById("opportunityCards");
        if (!opportunityCardsContainer) {
            console.error("Element with ID 'opportunityCards' not found.");
            return;
        }

        opportunityCardsContainer.appendChild(opportunityCard);
    }


    /**
     * Function to handle the login for the user.
     * @returns
     */
    static setupLogin(router: Router): void {
        const messageArea = document.getElementById("messageArea") as HTMLElement | null;
        const loginButton = document.getElementById("submitButton") as HTMLButtonElement | null;
        const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement | null;
        const usernameInput = document.getElementById("username") as HTMLInputElement | null;
        const passwordInput = document.getElementById("password") as HTMLInputElement | null;
        const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;

        if (!messageArea || !loginButton || !cancelButton || !usernameInput || !passwordInput || !loginForm) {
            console.error("One or more login elements are missing.");
            return;
        }

        messageArea.style.display = "none";

        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                const response = await fetch("site-data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP response failed. ${response.status}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;
                console.log(users);

                if (!Array.isArray(users)) {
                    throw new Error("JSON data doesn't contain an array");
                }

                let authenticatedUser = users.find(user => user.username === username && user.password === password);

                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        displayName: authenticatedUser.displayName,
                        emailAddress: authenticatedUser.emailAddress,
                        username: authenticatedUser.username,
                    }));

                    messageArea.style.display = "block";
                    messageArea.classList.remove("alert-danger");
                    messageArea.classList.add("alert", "alert-success");
                    messageArea.textContent = `Welcome ${authenticatedUser.displayName}!`;

                    setTimeout(() => {
                        router.navigate("/events-planning");
                    }, 500);
                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.remove("alert-success");
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid Username or Password";

                    usernameInput.focus();
                    usernameInput.select();
                }
            } catch (error) {
                console.error("Login failed", error);
            }
        });

        cancelButton.addEventListener("click", (e) => {
            loginForm.reset();
            router.navigate("/");
        });
    }


    /**
     * Dynamically sets up Terms of Service/Privacy Policy page.
     */
    static setupLegal() {
        console.log("Nothing to dynamically add to this page yet...");
    }

    /**
     * Dynamically loads in JSON image of past events for gallery.
     */
    static async setupGallery(): Promise<void> {
        let images: { src: { medium: string; large: string }; photographer: string }[] = [];
        const gallery = document.getElementById("gallery") as HTMLElement | null;

        if (!gallery) {
            console.error("Gallery element not found.");
            return;
        }

        // Grab images JSON from Pexels API
        try {
            const response = await fetch("https://api.pexels.com/v1/search?query=Oshawa+TorontoCommunity+DurhamRegion+Community+Events&per_page=50", {
                headers: {
                    Authorization: "kbRolbolX6JUARqCwDAQZUIzKS3tG33sw6QFYVQ9BMiNeW8kGY4qcwp7"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            images = data.photos || [];

        } catch (error) {
            console.error("Error fetching gallery images:", error);
            return;
        }

        if (images.length === 0) {
            console.warn("No images found in the API response.");
            return;
        }

        // Add each photo to gallery
        for (const image of images) {
            // Define this image to be added, add Bootstrap classes
            const col: HTMLDivElement = document.createElement("div");
            col.className = "gallery-img-container col-md-3";
            col.innerHTML = `
                <img src="${image.src.medium}" class="img-fluid rounded gallery-img" 
                     data-bs-toggle="modal" data-bs-target="#lightboxModal" 
                     data-src="${image.src.large}" alt="${image.photographer}">
            `;

            // Handle click event with lightbox
            col.addEventListener("click", () => {
                const lightboxImage = document.getElementById("lightboxImage") as HTMLImageElement | null;
                if (lightboxImage) {
                    lightboxImage.src = image.src.large;
                } else {
                    console.error("Lightbox image element not found.");
                }
            });

            gallery.appendChild(col);
        }
    }

    /**
     * Sets up statistics chart.
     */
    static async setupStatistics(): Promise<void> {
        StatisticsPageSetup.showStats();
    }

    /**
     * Sets up events planning.
     */
    static async setupEventsPlanning(): Promise<void> {
        EventsPlanningPageSetup.initialize();
    }

}    