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
        // Programmatically add to navbar
        PageSetup.setNavBar();

        // Subscribe event listener to scroll event such that scroll to top button appears when needed.
        const btnScrollToTop = document.getElementById("btnScrollToTop");
        btnScrollToTop.style.opacity = "0";
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

        // Donate link added to nav bar before last nav item, such that More link remains last one.
        const navbar =  document.getElementById("navbar");
        const lastNavItem = navbar.children[navbar.children.length - 1];
        navbar.insertBefore(donateItem, lastNavItem);

        // Opportunities link text changed to "Volunteer Now".
        document.getElementById("opportunitiesNavItem").innerText = "Volunteer Now"
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
     * Dynamically sets up opportunities page.
     */
    static async setupOpportunities() {
        // Firstly, attach event listeners to sign up form buttons
        document.getElementById("signUpButton").addEventListener("click", PageSetup.signUpOpportunity);
        document.getElementById("closeSignUpFormButton").addEventListener("click", PageSetup.resetOpportunityForm);
        document.getElementById("exitSignUpFormButton").addEventListener("click", PageSetup.resetOpportunityForm);

        // Use fetch to grab opportunities json - changed for pages directory
        /*const response = await fetch("../site-data/opportunities.json");*/
        const response = await fetch("https://github.com/bradyinglisdc/github.io/blob/master/site-data/opportunities.json");

        // Log an error and return if json couldn't be retrieved.
        if (!response.ok) {
            console.error("Could not fetch opportunities.");
            return;
        }
        // Get opportunities as a json
        const opportunities = await response.json();

        // Generate an opportunity card for each opportunity in the json.
        for (const opportunity of opportunities["opportunities"]) {
            PageSetup.createOpportunityCard(opportunity["opportunity"]);
        }
    }

    /**
     * Dynamically sets up events page.
     */
    static setupEvents() {
        const categoryFilter = document.getElementById("categoryFilter");
        const eventCards = document.querySelectorAll(".event-card");

        // Add event listener to filter dropdown
        categoryFilter.addEventListener("change", () => {
            const selectedCategory = categoryFilter.value;

            // Show or hide cards based on selected category
            eventCards.forEach((card) => {
                const cardCategory = card.getAttribute("data-category");
                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    /**
     * Dynamically sets up contacts page.
     */
    static setupContacts() {
        let sendButton = document.getElementById("sendButton")
        sendButton.addEventListener("click", function(){
            event.preventDefault();
            alert("Thank you!");
            setTimeout(function(){
                window.location.href="./index.html";
            },5000);
        });
    }

    /**
     * Dynamically sets up donate page.
     */
    static setupDonate() {
        // Since donate nav link is added programmatically, it is manually set to active here.
        document.getElementById("donateNavItem").className = "nav-link active";
    }

    /**
     * Simply submits signup using modal form details in opportunities.html.
     */
    static signUpOpportunity() {
        // Verify email - show success message if success, else error message.
        if (Opportunity.signUp(1,`${document.getElementById("fullName").value}`,`${document.getElementById("emailAddress").value}`,`${document.getElementById("preferredRole").value}`)) {
            document.getElementById("signUpButton").hidden = true;
            document.getElementById("signUpButton").disabled = true;
            document.getElementById("successMessage").hidden = false;
            document.getElementById("errorMessage").hidden = true;
            return;
        }
        document.getElementById("errorMessage").hidden = false;
        document.getElementById("successMessage").hidden = true;
    }

    /**
     * Resets opportunity form such that no messages are visible, and buttons are enabled.
     */
    static resetOpportunityForm() {
        document.getElementById("signUpButton").hidden = false;
        document.getElementById("signUpButton").disabled = false;
        document.getElementById("successMessage").hidden = true;
        document.getElementById("errorMessage").hidden = true;
    }

    /**
     * Creates an opportunity card in html with the provided json.
     * @param opportunity The opportunity data to create from.
     */
    static createOpportunityCard(opportunity) {
        // Define the div from which the card data should be added to.
        const opportunityCard = document.createElement("div");
        opportunityCard.className = "opportunity-card";

        // The html created directly for the opportunity.
        opportunityCard.innerHTML =
            `
                <h5>${opportunity["title"]}</h5>
                <p class="p-0 m-0"><strong>Organization:</strong> ${opportunity["organization"]}</p>
                <p class="p-0 m-0"><strong>Date:</strong> ${opportunity["date"]}</p>
                <p class="p-0 m-0"><strong>Time:</strong> ${opportunity["time"]}</p>
                <p class="p-0 m-0 opportunity-description"><strong>Description:</strong> ${opportunity["description"]}</p>
                <div class="d-flex justify-content-end align-items-end">
                    <button id='_${opportunity["opportunityID"]}signUpButton' type="button" class="opportunity-card-button" data-bs-toggle="modal" data-bs-target="#signUpForm">Sign up</button>
                </div>
            `
        // Append the new opportunity.
        document.getElementById("opportunityCards").appendChild(opportunityCard);
    }

}