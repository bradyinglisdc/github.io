"use strict";
/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Jan 25, 2025
*/
/**
 * Instantiatable opportunity, keeps things modular such that data is easier to ship.
 */
class Opportunity {
    /**
     * Sets up this opportunity with the provided params.
     * @param opportunityID
     * @param title
     * @param organization
     * @param date
     * @param time
     * @param description
     */
    constructor(opportunityID, title, organization, date, time, description) {
        this.opportunityID = opportunityID;
        this.title = title;
        this.organization = organization;
        this.date = date;
        this.time = time;
        this.description = description;
    }
    /**
     * Validates params and signs user up to specified opportunity based on opportunityID.
     * @param opportunityID
     * @param fullName
     * @param emailAddress
     * @param preferredRole
     */
    static signUp(opportunityID, fullName, emailAddress, preferredRole) {
        // Validate name
        if (fullName.length < 1) {
            console.error("Could not sign up to event: Your name must be at least one character long.");
            return false;
        }
        // Ensure user entered valid email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailAddress)) {
            console.error("Could not sign up to opportunity: Your email must be in valid format (e.g. user@example.com).");
            return false;
        }
        // Just return true if details are valid for now.
        // In the future, we could save this information to a database to associate a user to an opportunity.
        return true;
    }
}
//# sourceMappingURL=opportunity.js.map