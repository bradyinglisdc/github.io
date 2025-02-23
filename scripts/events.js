/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 23, 2025
*/


/**
 * Pulls events from local storage and displays them on screen.
 */
function displayEvents() {

    const eventsJSON = JSON.parse(sessionStorage.getItem("events"));
    const eventsContainer = document.getElementById("eventsContainer");
    const dateFilter = document.getElementById("dateFilter");
    const locationFilter = document.getElementById("locationFilter");
    const categoryFilter = document.getElementById("categoryFilter");


    // Display all events
    eventsContainer.innerHTML = ''
    for (const event of eventsJSON.events) {

        // Filter tags added to data-category attribute for simplistic display filtering
        eventsContainer.innerHTML +=
            `<div class="col event-card" data-category='{"date":"${event.date.split(" ")[0]}","location":"${event.city}","category":"${event.category}"}'>
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text mb-1">Date: ${event.date}</p>
                            <p class="card-text mb-1">Location: ${event.locationDisplay}</p>
                            <p class="card-text m1-">Category: ${event.category}</p>
                        </div>
                    </div>
                </div>
                `
    }

    // Add event listener to filter dropdown
    dateFilter.addEventListener("change", filterEvents)
    locationFilter.addEventListener("change", filterEvents)
    categoryFilter.addEventListener("change", filterEvents)
}

/**
 * Hides or shows cards based on selected category
 */
function filterEvents() {

    const selectedMonth = document.getElementById("dateFilter").value;
    const selectedLocation = document.getElementById("locationFilter").value;
    const selectedCategory = document.getElementById("categoryFilter").value;
    const eventCards = document.querySelectorAll(".event-card");


    // Show or hide cards based on selected category
    eventCards.forEach((card) => {
        const cardFilters = JSON.parse(card.getAttribute("data-category"));

        if ((selectedMonth === "All" || cardFilters["date"] === selectedMonth) &&
            (selectedLocation === "All" || cardFilters["location"] === selectedLocation) &&
            (selectedCategory === "All" || cardFilters["category"] === selectedCategory)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

/**
 * Sorts events based on search input.
 */
function sortEvents() {

    // Events to sort
    let eventsJSON;
    try {
        eventsJSON = JSON.parse(sessionStorage.getItem("events"));
    }
    catch(error) {
        console.error("Events not found in memory: " + error);
    }

    // Grab search query, return if empty
    const query = document.getElementById("globalSearchInput").value;
    if (query === "") { return eventsJSON; }

    // Create string array from event array for sorting
    const stringArray = [];
    for (const event of eventsJSON.events) {
        stringArray.push(event.title);
    }

    // Get sorted string array
    const sortedArray = Algorithms.bubbleSortString(stringArray, query);

    // Sort by name
    const sortedEvents = {"events": []};
    for (let j = 0; j < sortedArray.length; j++) {
        for (let i = 0; i < eventsJSON.events.length; i++) {
            if (eventsJSON.events[i].title === sortedArray[j]) {
                sortedEvents.events.push(eventsJSON.events[i]);
                break;
            }
        }
    }
    sessionStorage.setItem("events",  JSON.stringify(sortedEvents));
    displayEvents();
}
