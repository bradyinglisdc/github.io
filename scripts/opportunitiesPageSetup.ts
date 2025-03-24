/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 23, 2025
*/

// Imports
import { Algorithms } from "./algorithms.js";

export class OpportunitiesPageSetup {

    /**
     * Pulls opportunities from local storage and displays them on screen.
     */
    static displayOpportunities() {

        const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement;
        const closeSignUpFormButton = document.getElementById("closeSignUpFormButton");
        const exitSignUpFormButton = document.getElementById("exitSignUpFormButton");

        if (!signUpButton || !closeSignUpFormButton || !exitSignUpFormButton) {
            console.error("[ERROR] One ore more opportunity form buttons not found.");
        }

        // Attach event listeners to sign up form buttons
        signUpButton.addEventListener("click", OpportunitiesPageSetup.signUpOpportunity);
        if (closeSignUpFormButton) {
            closeSignUpFormButton.addEventListener("click", OpportunitiesPageSetup.resetOpportunityForm);
        } else {
            console.warn("closeSignUpFormButton not found.");
        }

        if (exitSignUpFormButton) {
            exitSignUpFormButton.addEventListener("click", OpportunitiesPageSetup.resetOpportunityForm);
        } else {
            console.warn("exitSignUpFormButton not found.");
        }

        // Grab opportunities from memory
        let opportunities;
        try {
            opportunities = JSON.parse(sessionStorage.getItem("opportunities") || "[]");
        } catch (error) {
            console.error("Could not parse opportunities.", error);
            opportunities = []; // Fallback in case of error
        }

        // Clear
        const opportunityCards = document.getElementById("opportunityCards")
        if (!opportunityCards) {
            console.warn("Element not found")
            return;
        }
        opportunityCards.innerHTML = '';

        // Generate an opportunity card for each opportunity in the json.
        for (const opportunity of opportunities["opportunities"]) {
            OpportunitiesPageSetup.createOpportunityCard(opportunity["opportunity"]);
        }
    }

    /**
     * Creates an opportunity card in html with the provided json.
     * @param opportunity The opportunity data to create from.
     */
    static createOpportunityCard(opportunity : any) {

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
        const opportunityCards = document.getElementById("opportunityCards");
        if (!opportunityCards) {
            console.warn("HTML Element opportunityCards missing")
            return;
        }
        opportunityCards.appendChild(opportunityCard);
    }

    /**
     * Simply submits signup using modal form details in opportunities.html.
     */
    static signUpOpportunity() {

        // Verify email - show success message if success, else error message.


        const fullNameInput = document.getElementById("fullName") as HTMLInputElement | null;
        const emailInput = document.getElementById("emailAddress") as HTMLInputElement | null;
        const preferredRoleInput = document.getElementById("preferredRole") as HTMLInputElement | null;
        const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement | null;
        const successMessage = document.getElementById("successMessage") as HTMLElement | null;
        const errorMessage = document.getElementById("errorMessage") as HTMLElement | null;

        // Ensure all elements exist before accessing properties
        if (!fullNameInput || !emailInput || !preferredRoleInput || !signUpButton || !successMessage || !errorMessage) {
            console.error("One or more required elements not found.");
            return;
        }

        // Pass values safely to signUp method
        if (Opportunity.signUp(
            "1",
            fullNameInput.value.trim(),
            emailInput.value.trim(),
            preferredRoleInput.value.trim()
        )) {
            signUpButton.hidden = true;
            signUpButton.disabled = true;
            successMessage.hidden = false;
            errorMessage.hidden = true;
            return;
        }

        // Handle failure case
        errorMessage.hidden = false;
        successMessage.hidden = true;

    }

    /**
     * Resets opportunity form such that no messages are visible, and buttons are enabled.
     */
    static resetOpportunityForm() {

        const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement;
        const successMessage = document.getElementById("successMessage");
        const errorMessage = document.getElementById("errorMessage");

        if (!signUpButton || !successMessage || !errorMessage) {
            console.warn("One or more mising elements")
            return
        }

        signUpButton.hidden = false;
        signUpButton.disabled = false;
        successMessage.hidden = true;
        errorMessage.hidden = true;
    }

    /**
     * Sorts opportunities based on search input.
     */
    static sortOpportunities() {
        // Ensure opportunities exist in sessionStorage
        let opportunitiesJSON: { opportunities: { opportunity: { title: string } }[] } | null = null;

        try {
            const storedData = sessionStorage.getItem("opportunities");

            if (!storedData) {
                console.warn("Opportunities not found in memory.");
                return null;
            }

            opportunitiesJSON = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing opportunities from memory: ", error);
            return null;
        }

        // Ensure opportunitiesJSON contains valid data
        if (!opportunitiesJSON || !opportunitiesJSON.opportunities) {
            console.warn("Opportunities data is missing or corrupted.");
            return null;
        }

        // Get search query
        const searchInput = document.getElementById("globalSearchInput") as HTMLInputElement | null;
        if (!searchInput) {
            console.error("Search input field not found.");
            return opportunitiesJSON;
        }

        const query = searchInput.value.trim();
        if (query === "") {
            return opportunitiesJSON;
        }

        // Convert opportunities into an array of titles
        const stringArray: string[] = opportunitiesJSON.opportunities.map(
            (opportunity) => opportunity.opportunity.title
        );

        // Sort the string array
        const sortedArray = Algorithms.bubbleSortString(stringArray, query);

        // Sort by name based on sortedArray
        const sortedOpportunities = { opportunities: [] as { opportunity: { title: string } }[] };

        for (const title of sortedArray) {
            const matchedOpportunity = opportunitiesJSON.opportunities.find(
                (opp) => opp.opportunity.title === title
            );
            if (matchedOpportunity) {
                sortedOpportunities.opportunities.push(matchedOpportunity);
            }
        }

        // Store sorted opportunities back in sessionStorage
        sessionStorage.setItem("opportunities", JSON.stringify(sortedOpportunities));
        OpportunitiesPageSetup.displayOpportunities();

        return sortedOpportunities;
    }
}

