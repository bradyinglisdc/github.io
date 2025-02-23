/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 23, 2025
*/

/**
 * Pulls opportunities from local storage and displays them on screen.
 */
function displayOpportunities() {

    // Attach event listeners to sign up form buttons
    document.getElementById("signUpButton").addEventListener("click", signUpOpportunity);
    document.getElementById("closeSignUpFormButton").addEventListener("click", resetOpportunityForm);
    document.getElementById("exitSignUpFormButton").addEventListener("click", resetOpportunityForm);

    // Grab opportunities from memory
    let opportunities
    try {
        opportunities = JSON.parse(sessionStorage.getItem("opportunities"));
    } catch (error) {
        console.error("Could not parse opportunities.", error);
    }

    // Clear
    document.getElementById("opportunityCards").innerHTML = '';

    // Generate an opportunity card for each opportunity in the json.
    for (const opportunity of opportunities["opportunities"]) {
        createOpportunityCard(opportunity["opportunity"]);
    }
}

/**
 * Creates an opportunity card in html with the provided json.
 * @param opportunity The opportunity data to create from.
 */
function createOpportunityCard(opportunity) {

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

/**
 * Simply submits signup using modal form details in opportunities.html.
 */
function signUpOpportunity() {

    // Verify email - show success message if success, else error message.
    if (Opportunity.signUp(1,`${document.getElementById("fullName").value}`,
        `${document.getElementById("emailAddress").value}`,
        `${document.getElementById("preferredRole").value}`)) {
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
function resetOpportunityForm() {
    document.getElementById("signUpButton").hidden = false;
    document.getElementById("signUpButton").disabled = false;
    document.getElementById("successMessage").hidden = true;
    document.getElementById("errorMessage").hidden = true;
}

/**
 * Sorts opportunities based on search input.
 */
function sortOpportunities() {

    // Opportunities to sort
    let opportunitiesJSON;
    try {
        opportunitiesJSON = JSON.parse(sessionStorage.getItem("opportunities"));
    }
    catch(error) {
        console.error("Opportunities not found in memory: " + error);
    }

    // Grab search query, return if empty
    const query = document.getElementById("globalSearchInput").value;
    if (query === "") { return opportunitiesJSON; }

    // Create string array from opportunity array for sorting
    const stringArray = [];
    for (const opportunity of opportunitiesJSON.opportunities) {
        stringArray.push(opportunity.opportunity.title);
    }

    // Get sorted string array
    const sortedArray = Algorithms.bubbleSortString(stringArray, query);

    // Sort by name
    const sortedOpportunities = {"opportunities": []};
    for (let j = 0; j < sortedArray.length; j++) {
        for (let i = 0; i < opportunitiesJSON.opportunities.length; i++) {
            if (opportunitiesJSON.opportunities[i].opportunity.title === sortedArray[j]) {
                sortedOpportunities.opportunities.push(opportunitiesJSON.opportunities[i]);
                break;
            }
        }
    }
    sessionStorage.setItem("opportunities",  JSON.stringify(sortedOpportunities));
    displayOpportunities();
}


