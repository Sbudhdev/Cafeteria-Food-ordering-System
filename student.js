const flaskURL = "http://127.0.0.1:5000";  // Change this when deploying

// document.getElementById("orderForm").addEventListener("submit", async function(event) {
//     event.preventDefault();

//     // Get the input values
//     const name = document.getElementById("name").value;
    
//     // Ensure a sandwich ingredient is selected
//     const ingredientElement = document.querySelector('input[name="ingredient"]:checked');
//     if (!ingredientElement) {
//         alert("Please select a sandwich ingredient.");
//         return;  // Stop the function if no ingredient is selected
//     }
//     const ingredient = ingredientElement.value;  // This matches the backend key name

//     // Prepare the order data
//     const orderData = { name, ingredient };

//     try {
//         const response = await fetch(`${flaskURL}/submit_order`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(orderData)  // Sending order data as JSON
//         });

//         if (response.ok) {
//             alert("Order placed successfully!");
//             document.getElementById("orderForm").reset();  // Reset form after successful order
//         } else {
//             alert("Failed to place order.");
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         alert("Error connecting to server.");
//     }
// });
document.getElementById("orderForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const allergy = document.getElementById("allergens").value;

    
    // Get selected ingredients (multiple possible)
    const selectedIngredients = Array.from(document.querySelectorAll('input[name="ingredient"]:checked')).map(el => el.value);

    const orderData = { name, ingredients: selectedIngredients, allergy };

    try {
        const response = await fetch(`${flaskURL}/submit_order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("Order placed successfully!");
            document.getElementById("orderForm").reset();
        } else {
            alert("Failed to place order.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server.");
    }
});


async function fetchDisabledIngredients() {
    try {
        const response = await fetch('/get_disabled_ingredients');
        if (!response.ok) {
            throw new Error('Failed to fetch disabled ingredients');
        }
        const data = await response.json();
        const disabledIds = data.disabled_ids; // Get disabled ingredient IDs from API
        const enabledIds = data.enabled_ids;// Returns the list of disabled ingredient IDs
        console.log(disabledIds)
        console.log(enabledIds)
        disabledIds.forEach(id => {
            const ingredientElement = document.getElementById(id);
            const ingredientElement1 = document.getElementById(id+"1");
            if (ingredientElement) {
                ingredientElement.className = "hidden"; // Replace existing class with "hidden"
                ingredientElement1.className = "hidden";
            }
        });
        // Returns the list of disabled ingredient IDs
        enabledIds.forEach(id => {
            const ingredientElement = document.getElementById(id);
            const ingredientElement1 = document.getElementById(id+"1");
            if (ingredientElement) {
                ingredientElement.className = "visible"; // Replace existing class with "hidden"
                ingredientElement1.className = "visible";
            }
        });
    } catch (error) {
        console.error('Error fetching disabled ingredients:', error);
        return [];
    }
}
fetchDisabledIngredients()

// async function fetchOrders() {
//     try {
//         const filtersResponse = await fetch(`${flaskURL}/get_filters`);
//         const filtersData = await filtersResponse.json();
//         const disabledIngredients = filtersData.disabled_ingredients || [];

//         const ordersResponse = await fetch(`${flaskURL}/get_orders`);
//         const ordersData = await ordersResponse.json();
//         const orders = ordersData.orders;

//         const orderList = document.getElementById("orderList");
//         orderList.innerHTML = "";

//         orders.forEach(order => {
//             const filteredIngredients = order.ingredients.filter(ing => !disabledIngredients.includes(ing));

//             if (filteredIngredients.length > 0) {
//                 const listItem = document.createElement("div");
//                 listItem.classList.add("order-bubble");

//                 const nameElement = document.createElement("div");
//                 nameElement.classList.add("order-name");
//                 nameElement.textContent = order.name;

//                 const ingredientsElement = document.createElement("div");
//                 ingredientsElement.classList.add("order-ingredients");
//                 ingredientsElement.textContent = filteredIngredients.join(", ");

//                 listItem.appendChild(nameElement);
//                 listItem.appendChild(ingredientsElement);
//                 orderList.appendChild(listItem);
//             }
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//     }
// }

// fetchOrders();
