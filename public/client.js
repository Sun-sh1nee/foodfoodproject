const BASE_URL = ''


function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}


function validateForm() {
    const foodName = document.getElementById('foodName').value;
    if (!foodName) {
        alert('กรุณากรอกชื่อเมนูอาหาร');
        return false;
    }
    return true;
}


const showRandomFoods = async () => {
    try {
        document.getElementById('randomFoodsPopup').style.display = 'block';
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('randomFoodsList').style.display = 'none';

        const response = await axios.get(`${BASE_URL}/random-food`)
        setTimeout(() => {
            // Your logic to fetch and display random foods
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('randomFoodsList').style.display = 'block';

            const randomFoodsList = document.getElementById('randomFoodsList');
            randomFoodsList.innerHTML = '';
            
            response.data.foods.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.className = 'random';
                foodItem.textContent = food.name;
                foodItem.onclick = () => showIngredientsPopup(food.name);
                randomFoodsList.appendChild(foodItem);
                console.log(food.name)
            })
            document.getElementById('randomFoodsPopup').style.display = 'block';
            }, 500);
        
    } catch (error) {
        console.log("ERROR ", error.message);
    }
}

const showIngredientsPopup = async (name) => {
    
    const foodIngredientsPopup = document.getElementById('foodIngredientsPopup');
    const foodNamePopup = document.getElementById('foodName');
    const foodIngredientsList = document.getElementById('foodIngredientsList');
    foodIngredientsList.innerHTML = '';
    foodNamePopup.innerHTML = `ส่วนประกอบของ <U>${name}</U>`
    const response = await axios.get(`${BASE_URL}/get-food-details?name=${name}`);
    const foodDetails = response.data.food;
    const Arrayingredient = foodDetails.ingredients.split(", ");

    Arrayingredient.forEach(ingredient => {
        const ingredientItem = document.createElement('p');
        ingredientItem.textContent = ingredient;
        foodIngredientsList.appendChild(ingredientItem);
    });

    foodIngredientsPopup.style.display = 'block';

}

function closeFoodIngredientsPopup() {
    document.getElementById('foodIngredientsPopup').style.display = 'none';
}

function closeRandomFoodsPopup() {
    document.getElementById('randomFoodsPopup').style.display = 'none';
}

function closeAddFoodPopup() {
    document.getElementById('addFoodPopup').style.display = 'none';
}

function closeEditFoodPopup() {
    document.getElementById('editFoodPopup').style.display = 'none';
}



function openAddFoodPopup() {
    // รีเซ็ตฟอร์มก่อนเปิดฟอร์มการเพิ่มเมนูอาหาร
   const elements = document.getElementsByClassName('ingredient');
   while(elements.length > 0){
       elements[0].parentNode.removeChild(elements[0]);
   }
   document.getElementById('addFoodPopup').style.display = 'block';
   resetAddFoodForm();
}

function removeIngredient(button) {
    button.parentElement.remove();
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

const submitFood = async () => {
    try {
        if (validateForm()) {
            const foodName = document.querySelector('#foodName') || ''
            const ingredientElement = document.querySelectorAll('.ingredient') || {}
            //const ingredients = Array.from(ingredientElement).map(input => input.value);
    
            let ingredients = ''
            for(let i=0; i<ingredientElement.length; i++){
                if(ingredientElement[i].value === '') continue
                ingredients += ingredientElement[i].value
                if(i != ingredientElement.length - 1) ingredients += ", "
            }
    
            let menus = {
                name: foodName.value,
                ingredients: ingredients
            }
            
            const response = await axios.post(`${BASE_URL}/add-food`, menus)
            document.getElementById('addFoodPopup').style.display = 'none';
            resetAddFoodForm()
            console.log(response.data)
        }
    } catch (error) {
        if(error.response) console.log(error.response.data.message)
    }
}

function cancelAddFood() {
    document.getElementById('addFoodPopup').style.display = 'none';
    document.getElementById('foodName').value = '';
    document.getElementById('ingredientsList').innerHTML = '';
}


// EDIT FOOD

const openEditFoodPopup = async () => {
    try {
        const foodSelect = document.getElementById('foodSelect');
        foodSelect.innerHTML = '';
        document.getElementById('editFoodName').value = ''
        const response = await axios.get('/food-menu')
        response.data.foodMenu.forEach((food, index) => {
            const option = document.createElement('option')
            option.value = index
            option.textContent = food.name
            foodSelect.appendChild(option)
        })
        document.getElementById('editFoodPopup').style.display = 'block';

    } catch(error) {
        console.log(error.message)
    }
}

function closeEditFoodPopup() {
    const ingredientList = document.getElementById('editIngredientsList')
    ingredientList.style.display = 'none';
    document.getElementById('editFoodPopup').style.display = 'none';
}

const loadFoodDetails = async () => {
    try {
        
        const FoodSelect = document.getElementById('foodSelect');
        const selectedFoodIndex = FoodSelect.selectedIndex;
        const foodName = FoodSelect.options[selectedFoodIndex].text;

        const response = await axios.get(`${BASE_URL}/get-food-details?name=${foodName}`);
        
        if (!response.data.food || response.data.food.length === 0) {
            throw new Error("ไม่พบข้อมูลเมนูอาหารที่ค้นหา");
        }

        const foodDetails = response.data.food;

        // Check if foodDetails or ingredients are missing
        if (!foodDetails || !foodDetails.ingredients) {
            throw new Error("ไม่พบข้อมูลส่วนผสม");
        }

        // Set the food name in the edit form
        document.getElementById('editFoodName').value = foodDetails.name;

        // Prepare the ingredients list
        const ingredientList = document.getElementById('editIngredientsList');
        ingredientList.style.display = 'block';
        ingredientList.innerHTML = '';

        // Split ingredients string into an array and create input fields
        const Arrayingredient = foodDetails.ingredients.split(", ");
        Arrayingredient.forEach(ingredient => {
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
            ingredientList.appendChild(ingredientContainer);
        });

    } catch (error) {
        console.log(error.message);
    }
}




function resetAddFoodForm() {
    document.getElementById('foodName').value = '';
    document.getElementById('ingredientsList').innerHTML = '';
}



function resetEditFoodForm() {
    document.getElementById('editFoodName').value = '';
    document.getElementById('editIngredientsList').innerHTML = '';
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

const submitEditFood = async () => {
    try {
        const ingredientList = document.getElementById('editIngredientsList')
        ingredientList.style.display = 'none';
        document.getElementById('editFoodPopup').style.display = 'none';
        
        const FoodSelect = document.getElementById('foodSelect');
        const selectedFoodIndex = FoodSelect.selectedIndex;
        const foodName = FoodSelect.options[selectedFoodIndex].text.trim();

        console.log('Selected Food Name:', foodName)

        const foodNameChange = document.querySelector('#editFoodName').value.trim();
        const ingredientElements = document.querySelectorAll('.ingredient');

        let ingredients = [];
        ingredientElements.forEach(element => {
            const ingredientValue = element.value.trim();
            if (ingredientValue) {
                ingredients.push(ingredientValue);
            }
        });

        const menus = {
            name: foodNameChange,
            ingredients: ingredients.join(', ')
        };

        console.log('Sending request with:', { foodName, menus });

        const response = await axios.put(`${BASE_URL}/edit-food/${foodName}`, menus);

        if (response.data.message === "OK") {
            document.getElementById('editFoodPopup').style.display = 'none';
        } else {
            console.error('Error updating food details:', response.data.message);
        }
        

    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }
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

// SHOW AVAILABLE

const showAvailableFoods = async () => {
    try {
        const availableElements = document.getElementsByClassName('availableIngredient');
        const availableIngredients = Array.from(availableElements).map(input => input.value.trim()).filter(value => value);

        const response = await axios.post('/available-foods', { availableIngredients });

        // Log the full response for debugging
        console.log('API Response:', response.data);

        // Verify the response format
        if (!response.data || !Array.isArray(response.data.availableFoods)) {
            throw new Error('Unexpected response format');
        }

        const availableFoodsList = document.getElementById('availableFoodsList');
        availableFoodsList.innerHTML = '';

        const uniqueFoods = new Set(response.data.availableFoods.map(food => food.name));

        uniqueFoods.forEach(foodName => {
            const foodItem = document.createElement('div');
            foodItem.textContent = foodName;
            foodItem.style.cursor = 'pointer';
            foodItem.onclick = () => showFoodIngredients(foodName);
            availableFoodsList.appendChild(foodItem);
        });
    } catch (error) {
        console.error('Error fetching available foods:', error.message || error);
    }
};



const showFoodIngredients = async (foodName) => {
    try {
        const response = await axios.get('/food-menu')
        const foodMenu = response.data.foodMenu
        
        if(!foodMenu) {
            throw new Error('ไม่เจอจ้าา')
        }
        
        const food = foodMenu.find(f => f.name === foodName)

        if(!food) {
            throw new Error(`ไม่เจอ ${foodName} จ้า`)
        }

        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = `วัตถุดิบสำหรับ ${food.name}: ${food.ingredients.join(', ')}`;

    } catch (error) {
        console.log(error.message)
    }
}

