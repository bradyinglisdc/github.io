export class User {
    constructor(displayName = "", emailAddress = "", username = "", password = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }
    get displayName() {
        return this._displayName;
    }
    get emailAddress() {
        return this._emailAddress;
    }
    get username() {
        return this._username;
    }
    set displayName(displayName) {
        this._displayName = displayName;
    }
    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }
    set username(username) {
        this._username = username;
    }
    toString() {
        return `Display Name: ${this.displayName}\nEmail Address: ${this.emailAddress}\nUser Name: ${this.username}`;
    }
    serialize() {
        if (this.displayName !== "" && this.emailAddress !== "" && this.username !== "") {
            return `${this.displayName},${this.emailAddress},${this.username}`;
        }
        console.error("[ERROR] Serialization failed! One of more user properties are missing.");
        return null;
    }
    deserialize(data) {
        let propertyArray = data.split(',');
        this.displayName = propertyArray[0];
        this.emailAddress = propertyArray[1];
        this.username = propertyArray[2];
    }
    toJSON() {
        return {
            displayName: this._password,
            emailAddress: this._password,
            username: this._password,
            password: this._password
        };
    }
    fromJSON(data) {
        this._displayName = data['displayName'];
        this._emailAddress = data['emailAddress'];
        this._username = data['username'];
        this._password = data['password'];
    }
}
//# sourceMappingURL=user.js.map