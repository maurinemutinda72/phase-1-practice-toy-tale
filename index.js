document.addEventListener("DOMContentLoaded", () => {
    const toyCollection = document.getElementById("toy-collection");
    const addToyForm = document.querySelector(".add-toy-form");
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    let addToy = false;

    const toysURL = "http://localhost:3000/toys";

    // Fetch and Render Toys on Page Load
    function fetchToys() {
        fetch(toysURL)
            .then(response => response.json())
            .then(toys => {
                toys.forEach(toy => renderToy(toy));
            });
    }

    // Render Toy Card
    function renderToy(toy) {
        const toyCard = document.createElement("div");
        toyCard.className = "card";

        toyCard.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;

        const likeButton = toyCard.querySelector(".like-btn");
        likeButton.addEventListener("click", () => increaseLikes(toy));

        toyCollection.appendChild(toyCard);
    }

    // Add a New Toy
    addToyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const image = e.target.image.value;

        const newToy = {
            name: name,
            image: image,
            likes: 0,
        };

        fetch(toysURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(newToy),
        })
            .then(response => response.json())
            .then(toy => {
                renderToy(toy);
                addToyForm.reset();
            });
    });

    // Increase Likes
    function increaseLikes(toy) {
        const newLikes = toy.likes + 1;

        fetch(`${toysURL}/${toy.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ likes: newLikes }),
        })
            .then(response => response.json())
            .then(updatedToy => {
                // Update the DOM
                const toyCard = document.getElementById(updatedToy.id).parentElement;
                const likesParagraph = toyCard.querySelector("p");
                likesParagraph.textContent = `${updatedToy.likes} Likes`;
            });
    }

    // Show/Hide Add Toy Form
    addBtn.addEventListener("click", () => {
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });

    // Initialize Page
    fetchToys();
});
