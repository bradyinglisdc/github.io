/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: March 23
*/
// Global
let calendar;
let calendarLink;
let plannerLink;
let planner;
let submitBtn;
let cancelBtn;
let user;
export class EventsPlanningPageSetup {
    /**
     * Configures necessary events.
     */
    static initialize() {
        // Grab user from session storage - ensure user JSON is not null before instantiating
        let userJSONRaw = sessionStorage.getItem("user");
        if (!userJSONRaw) {
            console.error("No user found.");
            return;
        }
        user = JSON.parse(userJSONRaw);
        // Grab elements
        calendar = document.getElementById("calendar");
        calendarLink = document.getElementById("plannedEventsLink");
        plannerLink = document.getElementById("eventPlannerLink");
        planner = document.getElementById("eventPlanner");
        cancelBtn = document.getElementById("cancel");
        submitBtn = document.getElementById("submit");
        // Navigate to sub route, set default if needed
        if (location.hash.split("#").length < 3 || (location.hash.split("#")[2] !== "calender" && location.hash.split("#")[2] !== "event-planner")) {
            location.hash = `#${location.hash.split("#")[1]}#calender`;
        }
        EventsPlanningPageSetup.setTab();
        // Set up submission and cancel
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            EventsPlanningPageSetup.submitEvent();
        });
        cancelBtn.addEventListener("click", (event) => {
            event.preventDefault();
            location.hash = `#${location.hash.split("#")[1]}#calender`;
        });
    }
    /**
     * Sets tab based on sub hash.
     */
    static setTab() {
        // Ensure links
        if (!calendarLink || !plannerLink) {
            console.error("Calendar and planer links not found.");
            return;
        }
        if (location.hash.split("#")[2] === "calender") {
            calendarLink.classList.add("nav-link-tab-active");
            plannerLink.classList.remove("nav-link-tab-active");
            EventsPlanningPageSetup.displayEvents();
            return;
        }
        calendarLink.classList.remove("nav-link-tab-active");
        plannerLink.classList.add("nav-link-tab-active");
        EventsPlanningPageSetup.displayPlanner();
    }
    /**
     * Pulls events from local storage and displays them on screen.
     */
    static displayEvents() {
        // Show events calendar, hide planner
        if (!calendar || !planner) {
            console.error("Error - events calendar or planner element missing.");
            return;
        }
        calendar.style.display = "block";
        planner.style.display = "none";
        const eventsJSON = JSON.parse(sessionStorage.getItem("events") || "[]");
        console.log(eventsJSON);
        const eventsContainer = document.getElementById("eventsContainer");
        if (!eventsContainer) {
            console.warn("Events container not found");
            return;
        }
        // Display all events
        eventsContainer.innerHTML = '';
        let eventCounter = 0;
        for (const event of eventsJSON.events) {
            // Ensure card is associated with user - skip this one if not
            if (event.createdBy !== user.username) {
                continue;
            }
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "me-3 btn btn-danger";
            deleteBtn.innerHTML = `<i class="fa fa-trash"></i> Delete`;
            deleteBtn.id = `DEL|${event.title}`;
            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "btn btn-primary";
            editBtn.innerHTML = `<i class="fa fa-pencil"></i> Edit`;
            editBtn.id = `SUB|${event.title}`;
            const cardContainer = document.createElement("div");
            cardContainer.className = "col event-card";
            cardContainer.innerHTML +=
                `
                <div class="card h-100">
                    <div id="event-${eventCounter}" class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text mb-1"><strong>Date:</strong> ${event.date}</p>
                        <p class="card-text mb-1"><strong>Time:</strong> ${event.time}</p>
                        <p class="card-text mb-1"><strong>Location:</strong> ${event.locationDisplay}</p>
                        <p class="card-text m1-"><strong>Category:</strong> ${event.category}</p>
                        <p class="card-text m1-"><strong>Description:</strong></br> ${event.description}</p>
                    </div>
                </div>
                `;
            eventsContainer.appendChild(cardContainer);
            // Setup buttons
            const cardElement = eventsContainer.querySelector(`#event-${eventCounter}`);
            if (!cardElement) {
                console.error("Could not tie event to unique ID");
                return;
            }
            deleteBtn.addEventListener("click", () => {
                eventsJSON.events.splice(eventsJSON.events.findIndex((e) => e.eventNum === eventCounter), 1);
                sessionStorage.setItem("events", JSON.stringify(eventsJSON));
                EventsPlanningPageSetup.displayEvents();
            });
            editBtn.addEventListener("click", () => {
                // Populate planner with event data
                document.getElementById("eventName").value = event.title;
                document.getElementById("eventCategory").value = event.category;
                document.getElementById("eventLocation").value = event.locationDisplay;
                document.getElementById("eventCity").value = event.city;
                document.getElementById("eventDate").value = event.date;
                document.getElementById("eventDescription").value = event.description;
                document.getElementById("eventTime").value = event.time;
                location.hash = `#${location.hash.split("#")[1]}#event-planner`;
            });
            cardElement.appendChild(deleteBtn);
            cardElement.appendChild(editBtn);
            eventCounter += 1;
        }
    }
    static displayPlanner() {
        // Show events planner, hide calendar
        if (!calendar || !planner) {
            console.error("Error - events calendar or planner element missing.");
            return;
        }
        calendar.style.display = "none";
        planner.style.display = "block";
    }
    static submitEvent() {
        // Grab error area and non input fields
        const errorArea = document.getElementById("errorArea");
        const eventCategory = document.getElementById("eventCategory");
        const eventDescription = document.getElementById("eventDescription");
        if (!errorArea || !eventCategory) {
            console.error("Missing one or more elements.");
            return;
        }
        // Ensure inputs are filled
        const inputs = document.querySelectorAll("input");
        for (let i = 1; i < inputs.length; i++) {
            if (inputs[i].value === "") {
                errorArea.style.display = "block";
                return;
            }
        }
        if (eventCategory.value === "") {
            errorArea.style.display = "block";
            return;
        }
        if (eventDescription.value === "") {
            eventDescription.value = "No Description Provided";
        }
        errorArea.style.display = "none";
        // Add to memory
        const eventsJSON = JSON.parse(sessionStorage.getItem("events") || "[]");
        eventsJSON.events.push({
            createdBy: user.username,
            title: document.getElementById("eventName").value || "",
            category: document.getElementById("eventCategory").value || "",
            locationDisplay: document.getElementById("eventLocation").value || "",
            city: document.getElementById("eventCity").value || "",
            date: document.getElementById("eventDate").value || "",
            description: document.getElementById("eventDescription").value || "",
            time: document.getElementById("eventTime").value || "",
        });
        sessionStorage.setItem("events", JSON.stringify(eventsJSON));
        location.hash = `#${location.hash.split("#")[1]}#calender`;
    }
}
//# sourceMappingURL=eventsPlanningPageSetup.js.map