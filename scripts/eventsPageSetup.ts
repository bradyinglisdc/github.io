/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 23, 2025
*/

// Imports
import { Algorithms } from "./algorithms.js";

export class EventsPageSetup {
    /**
     * Pulls events from local storage and displays them on screen.
     */
    static displayEvents() {

        const eventsJSON = JSON.parse(sessionStorage.getItem("events") || "[]");
        const eventsContainer = document.getElementById("eventsContainer");
        const dateFilter = document.getElementById("dateFilter") as HTMLSelectElement;
        const locationFilter = document.getElementById("locationFilter") as HTMLSelectElement;
        const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement;

        if (!eventsContainer) {
            console.warn("Events container not found")
            return;
        }


        // Display all events
        eventsContainer.innerHTML = ''
        for (const event of eventsJSON.events) {

            // Filter tags added to data-category attribute for simplistic display filtering
            eventsContainer.innerHTML +=
                `<div class="col event-card" data-category='{"date":"${event.date.split(" ")[0]}","location":"${event.city}","category":"${event.category}"}'>
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text mb-1"><strong>Date:</strong> ${event.date}</p>
                            <p class="card-text mb-1"><strong>Time:</strong> ${event.time}</p>
                            <p class="card-text mb-1"><strong>Location:</strong> ${event.locationDisplay}</p>
                            <p class="card-text m1-"><strong>Category:</strong> ${event.category}</p>
                            <p class="card-text m1-"><strong>Description:</strong></br> ${event.description}</p>
                        </div>
                    </div>
                </div>
                `
        }

        // Add event listener to filter dropdown
        dateFilter.addEventListener("change", EventsPageSetup.filterEvents)
        locationFilter.addEventListener("change", EventsPageSetup.filterEvents)
        categoryFilter.addEventListener("change", EventsPageSetup.filterEvents)
    }

    /**
     * Hides or shows cards based on selected category
     */
    static filterEvents() {

        const selectedMonth = (document.getElementById("dateFilter") as HTMLInputElement).value;
        const selectedLocation = (document.getElementById("locationFilter") as HTMLInputElement).value;
        const selectedCategory = (document.getElementById("categoryFilter") as HTMLInputElement).value;
        const eventCards = document.querySelectorAll(".event-card");


        // Show or hide cards based on selected category
        eventCards.forEach((card) => {
            const htmlCard = card as HTMLElement;

            const dataCategory = card.getAttribute("data-category");
            if (!dataCategory) return;

            const cardFilters = JSON.parse(dataCategory);

            if ((selectedMonth === "All" || cardFilters["date"] === selectedMonth) &&
                (selectedLocation === "All" || cardFilters["location"] === selectedLocation) &&
                (selectedCategory === "All" || cardFilters["category"] === selectedCategory)) {
                htmlCard.style.display = "block";
            } else {
                htmlCard.style.display = "none";
            }
        });

    }

    /**
     * Sorts events based on search input.
     */
    static sortEvents() {
        // Ensure events exist in sessionStorage
        let eventsJSON: { events: { title: string }[] } | null = null;

        try {
            const storedData = sessionStorage.getItem("events");

            if (!storedData) {
                console.warn("Events not found in memory.");
                return { events: [] };
            }

            eventsJSON = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing events from memory: ", error);
            return { events: [] };
        }

        // Ensure eventsJSON contains valid data
        if (!eventsJSON || !eventsJSON.events) {
            console.warn("Events data is missing or corrupted.");
            return { events: [] };
        }

        // Get search query
        const searchInput = document.getElementById("globalSearchInput") as HTMLInputElement | null;
        if (!searchInput) {
            console.error("Search input field not found.");
            return eventsJSON;
        }

        const query = searchInput.value.trim();
        if (query === "") return eventsJSON;

        // Convert events into an array of titles
        const stringArray: string[] = eventsJSON.events.map(event => event.title);

        // Get sorted string array
        const sortedArray = Algorithms.bubbleSortString(stringArray, query);

        // Sort by name based on sortedArray
        const sortedEvents = { events: [] as { title: string }[] };

        for (const title of sortedArray) {
            const matchedEvent = eventsJSON.events.find(event => event.title === title);
            if (matchedEvent) {
                sortedEvents.events.push(matchedEvent);
            }
        }

        // Store sorted events back in sessionStorage
        sessionStorage.setItem("events", JSON.stringify(sortedEvents));
        EventsPageSetup.displayEvents();

        return sortedEvents;
    }
}



