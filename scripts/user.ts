// Imports
import {RouteMap} from "./router.js";

export class User {

    // Instance properties
    private _displayName: string;
    private _emailAddress: string;
    private _username: string;
    private _password: string;

    constructor(displayName: string = "", emailAddress: string = "", username: string = "", password: string = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }

    get displayName(): string {
        return this._displayName;
    }

    get emailAddress(): string {
        return this._emailAddress;
    }

    get username(): string {
        return this._username;
    }

    set displayName(displayName: string) {
        this._displayName = displayName;
    }

    set emailAddress(emailAddress: string) {
        this._emailAddress = emailAddress;
    }

    set username (username: string) {
        this._username = username;
    }

    toString(): string {
        return `Display Name: ${this.displayName}\nEmail Address: ${this.emailAddress}\nUser Name: ${this.username}`;
    }

    serialize(): string|null {
        if (this.displayName !== "" && this.emailAddress !== "" && this.username !== "") {
            return `${this.displayName},${this.emailAddress},${this.username}`;
        }
        console.error("[ERROR] Serialization failed! One of more user properties are missing.");
        return null;
    }

    deserialize(data: string) {
        let propertyArray = data.split(',');
        this.displayName = propertyArray[0];
        this.emailAddress = propertyArray[1];
        this.username = propertyArray[2];
    }

    toJSON(): Record<string, string> {
        return {
            displayName: this._password,
            emailAddress: this._password,
            username: this._password,
            password: this._password
        };
    }

    fromJSON(data: {displayName: string, emailAddress: string, username: string, password: string}){
        this._displayName = data['displayName'];
        this._emailAddress = data['emailAddress'];
        this._username = data['username'];
        this._password = data['password'];
    }
}