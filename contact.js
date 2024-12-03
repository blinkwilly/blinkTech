

// Initialize EmailJS
(function () {
    emailjs.init("nulQTrskFgysEdPcw"); // Replace with your Public Key from EmailJS
})();

// Handle form submission
const form = document.getElementById("contactForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceID = "service_iln2kv8"; // Replace with your Service ID
    const templateID = "template_6ppgecy"; // Replace with your Template ID

    emailjs.sendForm(serviceID, templateID, form)
        .then(() => {
            alert("Message sent successfully!");
            form.reset(); // Reset the form after successful submission
        }, (error) => {
            alert("Failed to send message. Please try again.");
            console.error("Error:", error);
        });
});
