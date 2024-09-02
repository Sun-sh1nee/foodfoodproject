const BASE_URL = 'http://localhost:3000'

const showRandomFoods = async () => {
    try {
        const randomFoodsList = document.getElementById('randomFoodsList');
        randomFoodsList.innerHTML = '';
        const response = await axios.get(`${BASE_URL}/random-food`)

        response.data.foods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'random';
            foodItem.textContent = food.name;
            foodItem.onclick = function() { showFoodIngredients(food); };
            randomFoodsList.appendChild(foodItem);
        })

    } catch (error) {
        console.log("ERROR ", error.message);
    }
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
    document.getElementById('editFoodPopup').style.display = 'none';
}

const loadFoodDetails = async () => {
    try {

        const FoodSelect = document.getElementById('foodSelect')
        const selectedFoodIndex = FoodSelect.selectedIndex
        const foodName = FoodSelect.options[selectedFoodIndex].text

        const response = await axios.get(`${BASE_URL}/get-food-details?name=${foodName}`)
        const foodDetails = response.data.foods[0]

        if (!foodDetails || !foodDetails.ingredients) {
            throw new Error("ไม่พบข้อมูลส่วนผสม");
        }

        document.getElementById('editFoodName').value = foodDetails.name
        const ingredientList = document.getElementById('editIngredientsList')
        ingredientList.innerHTML = ''

        const Arrayingredient = foodDetails.ingredients.split(", ");
        Arrayingredient.forEach(ingredient => {
            const ingredientContainer = document.createElement('div');
            ingredientContainer.className = 'ingredient-container';

            const ingredientInput = document.createElement('input')
            ingredientInput.type = 'text'
            ingredientInput.className = 'ingredient'
            ingredientInput.value = ingredient

            const removeButton = document.createElement('button')
            removeButton.textContent = 'ลบ'
            removeButton.onclick = () => ingredientContainer.remove()

            ingredientContainer.appendChild(ingredientInput)
            ingredientContainer.appendChild(removeButton)
            ingredientList.appendChild(ingredientContainer)
        })

    } catch (error) {
        console.log(error.message)
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
        const FoodSelect = document.getElementById('foodSelect')
        const selectedFoodIndex = FoodSelect.selectedIndex
        const foodName = FoodSelect.options[selectedFoodIndex].text
        //const ingredients = Array.from(document.getElementsByClassName('ingredient')).map(input => input.value);

        const ingredientElement = document.querySelectorAll('.ingredient')
        //const ingredients = Array.from(ingredientElement).map(input => input.value);

        let ingredients = ''
        for(let i=0; i<ingredientElement.length; i++){
            if(ingredientElement[i].value === '') continue
            ingredients += ingredientElement[i].value
            if(i != ingredientElement.length - 1) ingredients += ", "
        }

        let menus = {
            name: foodName,
            ingredients: ingredients
        }


        const response = await axios.put(`${BASE_URL}/edit-food/${foodName}`,  menus)
        console.log(response.data)
        if (response.data.message === "OK") {
            document.getElementById('editFoodPopup').style.display = 'none';
        } else {
            console.error('Error updating food details');
        }

    } catch (error) {
        console.log(error.message)
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
    let available = document.getElementsByClassName('availableIngredient');
    const availableIngredient = Array.from(available).map(input => input.value);

    try {
        const response = await axios.post('/available-foods', { availableIngredients: availableIngredient });
        const availableFoodsList = document.getElementById('availableFoodsList');
        availableFoodsList.innerHTML = '';

        const uniqueFoods = new Set(response.data.foodMenu.map(food => food.name));
        uniqueFoods.forEach(foodName => {
            const foodItem = document.createElement('div');
            foodItem.textContent = foodName;
            foodItem.onclick = function() { showFoodIngredients(foodName); };
            availableFoodsList.appendChild(foodItem);
        });
    } catch (error) {
        console.error('Error fetching available foods:', error);
    }
}


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

// function showFoodIngredients(foodName) {
//     axios.get('/food-menu')
//         .then(response => {
//             const food = response.data.foodMenu.find(f => f.name === foodName);
//             alert(`วัตถุดิบสำหรับ ${food.name}: ${food.ingredients.join(', ')}`);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }

