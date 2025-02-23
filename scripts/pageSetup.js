/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Jan 25, 2025
*/

/**
 * A collection of static functions used for the purpose of dynamically setting up pages.
 */
export class PageSetup {

    /**
     * Any default document items that should be dynamically set in .js are set here.
     */
    static setupDefaults() {

        // Subscribe event listener to scroll event such that scroll to top button appears when needed.
        const btnScrollToTop = document.getElementById("btnScrollToTop");
        btnScrollToTop.style.opacity = "none";
        btnScrollToTop.addEventListener("click", function () {
           window.scrollTo(0, 0);
        });
        window.addEventListener("scroll", function() {
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
    static setNavBar(){

        // "Donate" link programmatically created here.
        const donateItem = document.createElement("li");
        const donateLink = document.createElement("a");
        donateItem.appendChild(donateLink);
        donateItem.className = "nav-item";
        donateLink.className = "nav-link";
        donateLink.id = "donateNavItem";
        donateLink.href = "donate.html";
        donateLink.innerHTML = "Donate";

        // Donate link added to nav bar before second last nav item, such that it remains next to login.
        const navbar =  document.getElementById("navbar");
        const lastNavItem = navbar.children[navbar.children.length - 2];
        navbar.insertBefore(donateItem, lastNavItem);

        // Opportunities link text changed to "Volunteer Now".
        document.getElementById("opportunitiesNavItem").innerText = "Volunteer Now";
    }

    /**
     * Dynamically sets up home page (to be called on window load on home page).
     */
    static setupHome() {
        document.getElementById("getInvolvedButton").addEventListener("click", function () {
            location.href="./opportunities.html"
        });
    }

    /**
     * Dynamically loads opportunities JSON into memory.
     * @returns {Promise<void>}
     */
    static async setupOpportunities() {
        await PageSetup.grabLocalJSON("opportunities");

        // Ensure all async methods are complete, then setup search area
        setTimeout(PageSetup.setupSearchArea, 0);
    }

    /**
     * Dynamically loads events JSON into memory.
     * @returns {Promise<void>}
     */
    static async setupEvents() {
        await PageSetup.grabLocalJSON("events");

        // Ensure all async methods are complete, then setup search area
        setTimeout(PageSetup.setupSearchArea, 0);
    }

    /**
     * Dynamically sets up search area based on current page.
     */
    static setupSearchArea() {

        const searchArea = document.getElementById("globalSearchArea");
        const searchInput = document.getElementById("globalSearchInput");
        const btnSearch = document.getElementById("btnGlobalSearch");

        // Swap search input placeholder based on page
        if (document.title === "Opportunities") {
            searchInput.placeholder = "Search opportunities...";
            btnSearch.addEventListener("click", sortOpportunities);
            displayOpportunities();
        }
        else {
            searchInput.placeholder = "Search events...";
            btnSearch.addEventListener("click", sortEvents);
            displayEvents();
        }

        // Make search area visible
        searchArea.classList.remove("d-none");
    }

    /**
     * Grabs specified JSON from site-data and saves to session storage.
     */
    static async grabLocalJSON(fetchItem) {

        // Grab JSON
        let returnJSON;
        try {
            const response = await fetch(`./site-data/${fetchItem}.json`);
            if (!response.ok) { throw new Error("Invalid Response."); }
            returnJSON = await response.json();

        } catch (error) {
            console.error(`Could not fetch: ${fetchItem}:`+ error);
        }

        // Save to session storage
        sessionStorage.setItem(`${fetchItem}`, JSON.stringify(returnJSON));
    }

    /**
     * Dynamically sets up news page.
     */
    static async setupNews() {

        // Indicate load
        const resultsContainer = document.getElementById("newsResults");
        resultsContainer.innerHTML += `<h4 class="h-100 d-flex justify-content-center align-items-center" id="statusDisclaimer">Pulling local news, this may take a few seconds...</h4>`;

        let data;
        try {
            const response = await fetch(localNewsURL);
            if (!response.ok) { throw new Error("Bad Response."); }
            data = await response.json();
        }
        catch (error) {
            console.log("Error fetching local news: " + error);
            document.getElementById("statusDisclaimer").innerText = "Could not fetch local news.";
        }

        // Create JSON array
        const communityNews = {
            articles: []
        }

        // Add necessary data for each article into the array
        for (const article of data.data) {
            communityNews.articles.push({
                org: article.source.split(".")[0],
                name: article.title,
                description: article.description,
                url: article.url
            });
        }

        // Add array to session storage
        sessionStorage.setItem("communityNews", JSON.stringify(communityNews));

        // Initialize and display news
        await initializeNews();
    }

    /**
     * Dynamically sets up contacts page.
     */
    static setupContacts() {
        let sendButton = document.getElementById("sendButton")
        let contactForm = document.getElementById("contactForm");

        sendButton.addEventListener("click", function(){
            event.preventDefault();

            if (contactForm.checkValidity()) {
                alert("Thank you!");
                setTimeout(function(){
                    window.location.href="./index.html";
                },5000);
            }
            else {
                contactForm.classList.add("was-validated");
            }
        });
    }

    /**
     * Dynamically sets up donate page.
     */
    static setupDonate() {

        // Since donate nav link is added programmatically, it is manually set to active here when header is finished
        document.getElementById("donateNavItem").className = "nav-link active";
    }

    /**
     * Function to handle the login for the user.
     * @returns 
     */
    static setupLogin() {
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("submitButton");
        const cancelButton = document.getElementById("cancelButton");

        messageArea.style.display = "none"

        if (!loginButton) {
            console.error("No login button found.")
            return;
        }

        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("site-data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP response failed. ${response.status}`);
                }

                const jsonData = await response.json();
                //console.log(jsonData);

                const users = jsonData.users;
                if(!Array.isArray(users)) {
                    throw new Error("JSON data doesn't contain an array");
                }

                let success = false;
                let authenticatedUser = null;

                for (const user of users) {
                    if (user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName : authenticatedUser.DisplayName,
                        EmailAddress : authenticatedUser.EmailAddress,
                        Username : authenticatedUser.Username,
                    }));

                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-success");
                    messageArea.textContent = `Welcome ${authenticatedUser.DisplayName}!`;
                    setTimeout(() => {
                        location.href = "index.html";
                    }, 2500);
                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid Username or Password";

                    document.getElementById("username").focus()
                    document.getElementById("username").select()
                }

            } catch (error) {
                console.error("Login failed", error);
            }
        });

        cancelButton.addEventListener("click", (e) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
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
    static async setupGallery() {

        let images;
        let gallery = document.getElementById("gallery");

        // Grab images JSON from pexels
        try {
            const response = await fetch("https://api.pexels.com/v1/search?query=Oshawa+TorontoCommunity+DurhamRegion+Community+Events&per_page=50", {
                headers: {Authorization: "kbRolbolX6JUARqCwDAQZUIzKS3tG33sw6QFYVQ9BMiNeW8kGY4qcwp7"}
            });
            const data = await response.json();
            images = data.photos;

        } catch (error) {
            console.error("Error fetching Gallery: ", error);
        }

        // Add each photo to gallery
        for (const image of images) {

            // Define this image to be added, add bootstrap classes
            let col = document.createElement("div");
            col.className = "gallery-img-container col-md-3";
            col.innerHTML = `
                    <img src="${image.src.medium}" class="img-fluid rounded gallery-img" 
                         data-bs-toggle="modal" data-bs-target="#lightboxModal" 
                         data-src="${image.src.large}" alt="${image.photographer}">
                `;

            // Handle click event with lightbox
            col.addEventListener("click", () => {
                document.getElementById("lightboxImage").src = image.src.large;
            })

            gallery.appendChild(col);
        }
    }
}