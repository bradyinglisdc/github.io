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

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload

            // Get form values
            const feedbackName = document.getElementById("feedbackName").value.trim();
            const feedbackMessage = document.getElementById("feedbackMessage").value.trim();

            if (!feedbackName || !feedbackMessage) {
                alert("Please fill out all fields.");
                return;
            }

            // Simulate AJAX request (replace with fetch API if needed)
            setTimeout(() => {
                document.getElementById("modalName").textContent = feedbackName;
                document.getElementById("modalMessage").textContent = feedbackMessage;

                // Show Bootstrap Modal
                const feedbackModal = new bootstrap.Modal(feedbackModalEl);
                feedbackModal.show();

                // Ensure proper focus when modal is opened
                feedbackModalEl.addEventListener("shown.bs.modal", function () {
                    document.querySelector("#feedbackModal .btn-close").focus();
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
                    document.activeElement.blur();
                    document.body.focus();
                });

            }, 500);
        });
    }
});
