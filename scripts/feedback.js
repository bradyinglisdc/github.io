"use strict";
/*
* Authors: Brady Inglis, Nick Coffin
* Brady Inglis Student ID: 100926284
* Nick Coffin Student ID: 100555045
* Date of Completion: Feb 22, 2025
*/
/**
 * Function to handle the AJAX event for the submission of the feedback form.
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Feedback script loaded");
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackModalEl = document.getElementById("feedbackModal");
    if (!feedbackForm || !feedbackModalEl) {
        console.error("Missing required elements.");
        return;
    }
    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload
        // Get form values
        const feedbackNameInput = document.getElementById("feedbackName");
        const feedbackMessageInput = document.getElementById("feedbackMessage");
        if (!feedbackNameInput || !feedbackMessageInput) {
            console.warn("One or more form elements are missing.");
            return;
        }
        const feedbackName = feedbackNameInput.value.trim();
        const feedbackMessage = feedbackMessageInput.value.trim();
        if (!feedbackName || !feedbackMessage) {
            alert("Please fill out all fields.");
            return;
        }
        // Simulate AJAX request
        setTimeout(() => {
            // Get modal elements
            const modalName = document.getElementById("modalName");
            const modalMessage = document.getElementById("modalMessage");
            if (!modalName || !modalMessage) {
                console.error("Modal elements not found.");
                return;
            }
            modalName.textContent = feedbackName;
            modalMessage.textContent = feedbackMessage;
            // Show Bootstrap Modal
            const feedbackModal = new window.bootstrap.Modal(feedbackModalEl);
            feedbackModal.show();
            // Ensure proper focus when modal is opened
            feedbackModalEl.addEventListener("shown.bs.modal", function () {
                const closeButton = document.querySelector("#feedbackModal .btn-close");
                if (closeButton)
                    closeButton.focus();
            });
            // When modal is fully hidden, force remove the backdrop
            feedbackModalEl.addEventListener("hidden.bs.modal", function () {
                console.log("Modal closed, ensuring backdrop is removed.");
                // Force remove the modal backdrop
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
                // Remove `modal-open` class from body
                document.body.classList.remove("modal-open");
                // Remove `overflow: hidden;` style on body
                document.body.style.overflow = "";
                // Ensure modal is properly hidden
                feedbackModalEl.style.display = "none";
                feedbackModalEl.setAttribute("aria-hidden", "true");
                // Ensure focus returns to the page
                document.body.focus();
            });
        }, 500);
    });
});
//# sourceMappingURL=feedback.js.map