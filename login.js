document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const username = form.querySelector("input[type='text']").value;
        const password = form.querySelector("input[type='password']").value;

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.redirect; // Now Flask controls redirect
            } else {
                alert(result.message); // Show invalid login message
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error connecting to server.");
        }
    });
});
