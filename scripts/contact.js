"use strict";

/**
 * Defines an instantiatable Contact with a name, contact number, and email address
 */
(function (core) {
    class Contact {
        /**
         * Constructs a new contact instance.
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * Gets the full name of the contact.
         * @returns {string}
         */
        get fullName() {
            return this._fullName;
        }

        /**
         * Set the ful name of the contact. Validates to ensure non-empty sting.
         * @param fullName
         */
        set fullName(fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid fullName: must be non-empty string.");
            }
            this._fullName = fullName;
        }

        /**
         * Gets the contact number for the contact.
         * @returns {string}
         */
        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * Sets the contact number for the contact, uses regex to validate.
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid Contact Number: must be 10 digit number.");
            }
            this._contactNumber = contactNumber;
        }

        /**
         * Gets the email address for the contact.
         * @returns {string}
         */
        get emailAddress() {
            return this._emailAddress;
        }

        /**
         * Sets the email address for the contact, uses regex to validate.
         * @param emailAddress
         */
        set emailAddress(emailAddress) {
            const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
            if (!emailRegex.test(emailAddress)) {
                throw new Error("Invalid email address: email must be a valid email address.");
            }
            this._emailAddress = emailAddress;
        }

        /**
         * Converts the contact details into q human-readable string.
         * @returns {string}
         */
        toString() {
            return `Full Name: ${this._fullName}\n
                Contact Number: ${this._contactNumber}\n
                Email Address: ${this._emailAddress}`;
        }

        /**
         * Serializes the contact into a string in CSV format (fullName,contactNumber,emailAddress).
         * @returns {string|null}
         */
        serialize() {
            if (!this._fullName || !this._emailAddress || !this._emailAddress.length) {
                console.error("One or more Contact Properties are missing or invalid.");
                return null;
            }
            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }

        /**
         * Deserialize a CSV formatted string of contact details and updates the contact properties.
         * @param data
         */
        deserialize(data) {
            if (typeof data !== "string" || data.split(",").length < 3) {
                console.error("Invalid data format for deserialization.");
                return;
            }
            const propertyArray = data.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }
    core.Contact = Contact;
})(core || (core = {}))