// public/client.js
function showRandomFoods() {
    axios.get('/random-food')
        .then(response => {
            const randomFoodsList = document.getElementById('randomFoodsList');
            randomFoodsList.innerHTML = '';
            response.data.foods.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.className = 'random';
                foodItem.textContent = food.name;
                foodItem.onclick = function() { showFoodIngredients(food); };
                randomFoodsList.appendChild(foodItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function cancelAddFood() {
    document.getElementById('addFoodPopup').style.display = 'none';
    document.getElementById('foodName').value = '';
    document.getElementById('ingredientsList').innerHTML = '';
}

function deleteFoodFromEdit() {
    const selectedFoodIndex = document.getElementById('foodSelect').value;
    const foodName = document.getElementById('foodSelect').options[selectedFoodIndex].text;
    axios.post('/delete-food', { name: foodName })
        .then(response => {
            console.log(response.data.message);
            document.getElementById('editFoodPopup').style.display = 'none';
            openEditFoodPopup(); // Refresh the food list
        })
        .catch(error => {
            console.error(error);
        });
}

function openAddFoodPopup() {
    
     // รีเซ็ตฟอร์มก่อนเปิดฟอร์มการเพิ่มเมนูอาหาร
    const elements = document.getElementsByClassName('ingredient');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    console.log(elements)
    document.getElementById('addFoodPopup').style.display = 'block';
    resetAddFoodForm();
}

function addIngredient() {
    const ingredientsList = document.getElementById('ingredientsList');
    const ingredientContainer = document.createElement('div');
    ingredientContainer.className = 'ingredient-container';
    const newIngredient = document.createElement('input');
    newIngredient.type = 'text';
    newIngredient.className = 'ingredient';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'ลบ';
    removeButton.onclick = function() { removeIngredient(removeButton); };
    ingredientContainer.appendChild(newIngredient);
    ingredientContainer.appendChild(removeButton);
    ingredientsList.appendChild(ingredientContainer);
}

function removeIngredient(button) {
    button.parentElement.remove();
}

function resetAddFoodForm() {
    document.getElementById('foodName').value = '';
    document.getElementById('ingredientsList').innerHTML = '';
}

function submitFood() {
    const foodName = document.getElementById('foodName').value;
    const ingredients = Array.from(document.getElementsByClassName('ingredient')).map(input => input.value);
    axios.post('/add-food', { name: foodName, ingredients })
        .then(response => {
            console.log(response.data.message);
            document.getElementById('addFoodPopup').style.display = 'none';
            resetAddFoodForm(); // รีเซ็ตฟอร์มหลังจากเพิ่มเมนูอาหาร
        })
        .catch(error => {
            console.error(error);
        });
}

function closeEditFoodPopup() {
    document.getElementById('editFoodPopup').style.display = 'none';
}


function resetEditFoodForm() {
    document.getElementById('editFoodName').value = '';
    document.getElementById('editIngredientsList').innerHTML = '';
}

function openEditFoodPopup() {
    const foodSelect = document.getElementById('foodSelect');
    foodSelect.innerHTML = '';
    
    axios.get('/food-menu')
        .then(response => {
            response.data.foodMenu.forEach((food, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = food.name;
                foodSelect.appendChild(option);
            });
            document.getElementById('editFoodPopup').style.display = 'block';
        })
        .catch(error => {
            console.error(error);
        });
}



function loadFoodDetails() {
    const selectedFoodIndex = document.getElementById('foodSelect').value;
    const foodName = document.getElementById('foodSelect').options[selectedFoodIndex].text;
    
    axios.get(`/get-food-details?name=${foodName}`)
        .then(response => {
            const foodDetails = response.data;
            document.getElementById('editFoodName').value = foodDetails.name;
            const ingredientsList = document.getElementById('editIngredientsList');
            ingredientsList.innerHTML = ''; // Clear previous ingredients
            foodDetails.ingredients.forEach(ingredient => {
                const ingredientContainer = document.createElement('div');
                ingredientContainer.className = 'ingredient-container';
                const ingredientInput = document.createElement('input');
                ingredientInput.type = 'text';
                ingredientInput.className = 'ingredient';
                ingredientInput.value = ingredient;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'ลบ';
                removeButton.onclick = () => ingredientContainer.remove();
                ingredientContainer.appendChild(ingredientInput);
                ingredientContainer.appendChild(removeButton);
                ingredientsList.appendChild(ingredientContainer);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function addEditIngredient() {
    const editIngredientsList = document.getElementById('editIngredientsList');
    const ingredientContainer = document.createElement('div');
    ingredientContainer.className = 'ingredient-container';
    const newIngredient = document.createElement('input');
    newIngredient.type = 'text';
    newIngredient.className = 'ingredient';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'ลบ';
    removeButton.onclick = function() { removeIngredient(removeButton); };
    ingredientContainer.appendChild(newIngredient);
    ingredientContainer.appendChild(removeButton);
    editIngredientsList.appendChild(ingredientContainer);
}

// public/client.js
function submitEditFood() {
    const selectedFoodIndex = document.getElementById('foodSelect').value;
    const foodName = document.getElementById('editFoodName').value;
    const ingredients = Array.from(document.getElementsByClassName('ingredient')).map(input => input.value);
    axios.put(`/edit-food/${selectedFoodIndex}`, { name: foodName, ingredients })
        .then(response => {
            console.log(response.data.message);
            document.getElementById('editFoodPopup').style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}

function addAvailableIngredient() {
    const availableIngredientsList = document.getElementById('availableIngredientsList');
    const ingredientContainer = document.createElement('div');
    ingredientContainer.className = 'ingredient-container';
    const newIngredient = document.createElement('input');
    newIngredient.type = 'text';
    newIngredient.className = 'availableIngredient';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'ลบ';
    removeButton.onclick = function() { removeIngredient(removeButton); };
    ingredientContainer.appendChild(newIngredient);
    ingredientContainer.appendChild(removeButton);
    availableIngredientsList.appendChild(ingredientContainer);
}

// public/client.js
function showAvailableFoods() {
    const availableIngredients = Array.from(document.getElementsByClassName('availableIngredient')).map(input => input.value);
    axios.post('/available-foods', { availableIngredients })
        .then(response => {
            const availableFoodsList = document.getElementById('availableFoodsList');
            availableFoodsList.innerHTML = '';
            const uniqueFoods = new Set(response.data.foods.map(food => food.name));
            uniqueFoods.forEach(foodName => {
                const foodItem = document.createElement('div');
                foodItem.textContent = foodName;
                foodItem.onclick = function() { showFoodIngredients(foodName); };
                availableFoodsList.appendChild(foodItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function showFoodIngredients(foodName) {
    axios.get('/food-menu')
        .then(response => {
            const food = response.data.foodMenu.find(f => f.name === foodName);
            alert(`วัตถุดิบสำหรับ ${food.name}: ${food.ingredients.join(', ')}`);
        })
        .catch(error => {
            console.error(error);
        });
}

