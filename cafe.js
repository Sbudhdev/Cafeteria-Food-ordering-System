 // Change this when deploying

// async function fetchOrders() {
//     try {
//         const response = await fetch(`${flaskURL}/get_orders`);
//         const orders = await response.json();

//         const orderList = document.getElementById("orderList");
//         orderList.innerHTML = "";

//         orders.forEach(order => {
//             const listItem = document.createElement("li");
//             listItem.textContent = `${order.name} - ${order.sandwich}`;
//             orderList.appendChild(listItem);
//         });

//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }
// async function fetchOrders() {
//     try {
//         const response = await fetch(`${flaskURL}/get_orders`);
//         if (response.ok) {
//             const orders = await response.json();
//             console.log("Fetched orders:", orders);  // Log orders to inspect the data

//             const orderList = document.getElementById("orderList");
//             orderList.innerHTML = "";  // Clear the current list

//             orders.forEach(order => {
//                 console.log(order.name, order.ingredient);  // Log individual order
//                 const listItem = document.createElement("li");
//                 listItem.textContent = `${order.name} - ${order.ingredient}`;
//                 orderList.appendChild(listItem);
//             });
//         } else {
//             console.error("Failed to fetch orders");
//         }
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }
// async function fetchOrders() {
//     try {
//         const response = await fetch(`${flaskURL}/get_orders`);
//         if (response.ok) {
//             const orders = await response.json();
//             console.log("Fetched orders:", orders);  // Log orders to inspect the data

//             const orderList = document.getElementById("orderList");
//             orderList.innerHTML = "";  // Clear the current list

//             orders.forEach(order => {
//                 console.log(order.name, order.ingredients);  // Log individual order

//                 const listItem = document.createElement("li");
                
//                 // Check if the ingredients array exists
//                 const ingredients = Array.isArray(order.ingredients) ? order.ingredients.join(", ") : "No ingredients"; // Join ingredients if array
//                 listItem.textContent = `${order.name} - ${ingredients}`; // Display name and ingredients
//                 orderList.appendChild(listItem);
//             });
//         } else {
//             console.error("Failed to fetch orders");
//         }
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }
// async function fetchOrders() {
//     try {
//         const response = await fetch(`${flaskURL}/get_orders`);
//         if (response.ok) {
//             const data = await response.json(); // Get the data object
//             console.log("Fetched orders:", data);  // Log the whole response to inspect it

//             const orders = data.orders || [];  // Get the orders array, or use an empty array if not found

//             const orderList = document.getElementById("orderList");
//             orderList.innerHTML = "";  // Clear the current list

//             orders.forEach(order => {
//                 console.log(order.name, order.ingredients);  // Log individual order

//                 const listItem = document.createElement("li");

//                 // Join ingredients if it's an array, otherwise show fallback message
//                 const ingredients = Array.isArray(order.ingredients) ? order.ingredients.join(", ") : "No ingredients"; 
//                 listItem.textContent = `${order.name} - ${ingredients}`;
//                 orderList.appendChild(listItem);
//             });
//         } else {
//             console.error("Failed to fetch orders");
//         }
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }

// async function fetchOrders() {
//     try {
//         const response = await fetch(`${flaskURL}/get_orders`);
//         if (response.ok) {
//             const data = await response.json();
//             const orders = data.orders;  // Extract orders from JSON

//             console.log("Fetched orders:", orders);  // Debugging log

//             const orderList = document.getElementById("orderList");
//             orderList.innerHTML = "";  // Clear the current list

//             orders.forEach(order => {
//                 console.log(order.name, order.ingredients);  // Debugging log

//                 // Create order bubble (card)
//                 const orderBubble = document.createElement("div");
//                 orderBubble.classList.add("order-bubble");

//                 orderBubble.innerHTML = `
//                     <strong>${order.name}</strong>
//                     <p>${order.ingredients.join(", ")}</p>
//                 `;

//                 orderList.appendChild(orderBubble);
//             });
//         } else {
//             console.error("Failed to fetch orders");
//         }
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }
const flaskURL = "http://127.0.0.1:5000"; 

async function fetchOrders() {
    try {
        const response = await fetch(`${flaskURL}/get_orders`);
        if (response.ok) {
            const data = await response.json();
            const orders = data.orders;

            console.log("Fetched orders:", orders);

            const orderList = document.getElementById("orderList");
            orderList.innerHTML = "";  // Clear the current list

            orders.forEach(order => {
                console.log(order.name, order.ingredients, order.allergens);

                // Create order bubble
                const listItem = document.createElement("div");
                listItem.classList.add("order-bubble");  

                // Name element (bold)
                const nameElement = document.createElement("div");
                nameElement.classList.add("order-name");
                nameElement.textContent = order.name;

                // Ingredients element
                const ingredientsElement = document.createElement("div");
                ingredientsElement.classList.add("order-ingredients");
                ingredientsElement.textContent = order.ingredients.join(", ");

                // Allergens element
                const allergensElement = document.createElement("div");
                allergensElement.classList.add("order-allergens");
                allergensElement.textContent = order.allergens ? `Allergens: ${order.allergens}` : "No allergens";

                // Append elements to the order bubble
                listItem.appendChild(nameElement);
                listItem.appendChild(ingredientsElement);
                listItem.appendChild(allergensElement);

                orderList.appendChild(listItem);
            });
        } else {
            console.error("Failed to fetch orders");
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

document.getElementById("clearOrders").addEventListener("click", async function() {
    if (confirm("Are you sure you want to clear all orders?")) {  // Confirmation prompt
        try {
            const response = await fetch(`${flaskURL}/clear_orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                alert("All orders cleared!");
                fetchOrders();  // Refresh the order list after clearing
            } else {
                alert("Failed to clear orders.");
            }
        } catch (error) {
            console.error("Error clearing orders:", error);
            alert("Error connecting to server.");
        }
    }
});





document.addEventListener("click", function(event) {
    if (event.target.id === "update") {
        console.log("Update button clicked!");
        
        // Get the selected disabled ingredients
        const disabled = Array.from(document.querySelectorAll('input[name="ingredient"]:checked')).map(el => el.value);

        // Send the array to Flask
        fetch("/update_disabled", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ disabled_items: disabled })
        })
        .then(response => response.json())
        .then(data => console.log("Server response:", data))
        .catch(error => console.error("Error updating disabled items:", error));
        alert("Disabled Ingredients updated!");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const unfinishedOrders = document.getElementById("orderList");
    const completedOrders = document.getElementById("orderList1");

    function moveOrder(event) {
        let order = event.target.closest(".order-bubble");
        if (!order) return;

        if (unfinishedOrders.contains(order)) {
            completedOrders.appendChild(order);
        } else {
            unfinishedOrders.appendChild(order);
        }
    }

    unfinishedOrders.addEventListener("click", moveOrder);
    completedOrders.addEventListener("click", moveOrder);
});






// async function fetchFilters() {
//     try {
//         const response = await fetch(`${flaskURL}/get_filters`);
//         const data = await response.json();
//         const disabledIngredients = data.disabled_ingredients || [];

//         document.querySelectorAll(".ingredient-checkbox").forEach(checkbox => {
//             checkbox.checked = disabledIngredients.includes(checkbox.value);
//         });
//     } catch (error) {
//         console.error("Error fetching filters:", error);
//     }
// }

// async function updateFilters() {
//     const disabledIngredients = Array.from(document.querySelectorAll(".ingredient-checkbox:checked"))
//         .map(checkbox => checkbox.value);

//     try {
//         await fetch(`${flaskURL}/update_filters`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ disabled_ingredients: disabledIngredients })
//         });
//     } catch (error) {
//         console.error("Error updating filters:", error);
//     }
// }

// document.querySelectorAll(".ingredient-checkbox").forEach(checkbox => {
//     checkbox.addEventListener("change", updateFilters);
// });





// async function fetchDisabledIngredients() {
//     try {
//         const response = await fetch('/list_disabled_ingredients'); // Fetch from Flask
//         const data = await response.json(); // Parse JSON response
        
//         // Format the output
//         const ingredientText = `Currently disabled ingredients: ${data.disabled_ids.join(', ')}`;

//         // Find or create the <p> element
//         let label = document.getElementById('disabled-ingredients');
//         if (!label) {
//             label = document.createElement('p');
//             label.id = 'disabled-ingredients';
//             label.classList.add('disabled-text'); // Add class
//             document.body.appendChild(label); // Append to the page
//         }

//         label.textContent = ingredientText; // Set text
//     } catch (error) {
//         console.error('Error fetching disabled ingredients:', error);
//     }
// }

// // Run the function when the page loads
// window.onload = fetchDisabledIngredients;







async function fetchDisabledIngredients() {
    try {
        const response = await fetch('/list_disabled_ingredients'); // Fetch from Flask
        const data = await response.json(); // Parse JSON response
        
        // Format the output
        const ingredientText = `Currently disabled ingredients: ${data.disabled_ids.join(', ')}`;

        // Find the existing <p> element
        let label = document.getElementById('disabled');
        if (label) {
            label.textContent = ingredientText; // Set text
        } else {
            console.warn('Element with id "disabled" not found.');
        }
    } catch (error) {
        console.error('Error fetching disabled ingredients:', error);
    }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", fetchDisabledIngredients);



// Refresh orders every minute
setInterval(fetchOrders, 60000);
fetchOrders();



// stuff to do for the site: oppacity, make it using mongo cos it is easier
//on the cafe site, make it so that they can adjust what ingredients are avaliable
//add one more text box 