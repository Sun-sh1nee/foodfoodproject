const BASE_URL = ''


// Menu & Search -> success

function togleShowOption() {
    const bt = document.getElementById('show-option')
    const menu = document.getElementById('menu-show')

    
    if(bt.className == 'active'){
        bt.className = 'not-active'
        bt.innerHTML = '<i class="fa-solid fa-angle-down"></i> Show Menus'
        menu.style.display = 'none';
        clearSearch()
    }else{
        bt.className = 'active'
        bt.innerHTML = '<i class="fa-solid fa-angle-up"></i> Hide Menus'
        menu.style.display = 'block';
        searchMenu()
    }
}

function clearSearch() {
    document.getElementById('searchText').value = ''
}

const searchMenu = async () => {
    try{
        const containerMenu = document.getElementById('container-showMenu')
        const searchText = document.getElementById('searchText').value
        const response = await axios.get(`${BASE_URL}/food-menu`)
        const searchList = searchText.split(',').map(s => s.trim())

        const searchFound = (response.data.foodMenu).filter(food => {
            const foundInName = searchList.some(item => food.name.toLowerCase().includes(item.toLowerCase()));
            const foundInIngredients = searchList.some(item => food.ingredients.toLowerCase().includes(item.toLowerCase()));
            
            // Return true to keep the object if a match is found
            return foundInName || foundInIngredients;
        });

        document.getElementById('loadingIndicator').style.display = 'blhock'
        setTimeout(() => {
            containerMenu.innerHTML = ''
            document.getElementById('loadingIndicator').style.display = 'none';
            searchFound.forEach((food) => {


                const divMenu = document.createElement('div')
                divMenu.className = 'div-menu'
        
                const nameMenu = document.createElement('p')
                nameMenu.innerHTML = food.name
                nameMenu.addEventListener('click', () => {
                    if (showIngredients.style.display === 'none') {
                        showIngredients.style.display = 'block';
                    } else {
                        showIngredients.style.display = 'none';
                    }
                })
                
                const showIngredients = document.createElement('ul')
                const ingredientList = food.ingredients.split(',').map(s => s.trim())
                ingredientList.forEach((e) => {
                    const li = document.createElement('li')
                    li.innerHTML = e
                    showIngredients.appendChild(li)
                })
                showIngredients.className = 'not-active'
                showIngredients.style.display = 'none'
    
                
                const divButtons = document.createElement('div')
                divButtons.className = 'button2'
                const buttonEdit = document.createElement('button')
                buttonEdit.addEventListener('click', () => {
                    openEditFoodPopup(food.name, food.ingredients)
                })
                buttonEdit.innerHTML = 'Edit Menu <i class="fa-solid fa-pen-to-square"></i>'
                buttonEdit.className = 'button-edit'
                const buttonDelete = document.createElement('button')
                buttonDelete.addEventListener('click', () => {
                    deleteFood(food.name)
                })
                buttonDelete.innerHTML = 'Delete Menu <i class="fa-solid fa-trash"></i>'
                buttonDelete.className = 'button-delete'
    
                divButtons.append(buttonEdit, buttonDelete)
                divMenu.append(nameMenu, showIngredients, divButtons)
                containerMenu.appendChild(divMenu)
    
            })
        }, 500)
    }catch(error){
        console.error('Error fetching menu:', error);
    }
}

// -> Menu & Search

// Edit Food -> success
let namenow = ''

const validateFormEdit = async () => {
    const foodName = document.getElementById('foodNameEdit').value
    const ingredientElement = document.getElementById('ingredientsListEdit').value
    const textAdd = document.getElementById('text-edit')
    const response = await axios.get(`${BASE_URL}/food-menu`)
    const nameOfFood = response.data.foodMenu.map(menu => menu.name)
    let nameequal = 0
    nameOfFood.forEach(name => {
        if(!(name==namenow) && name==foodName){
            nameequal = 1
            return
        }
    })
    if (!foodName || !ingredientElement || nameequal) {
        if(nameequal) textAdd.innerHTML = '*ชื่อซ้ำกันอะเตง เปลี่ยนใหม่ดีกว่า'
        else if(!foodName && !ingredientElement) textAdd.innerHTML = '*กรุณากรอกชื่อเมนูอาหารและส่วนประกอบด้วยนะจ้ะ'
        else if(!foodName) textAdd.innerHTML = '*กรุณากรอกชื่อเมนูอาหาร'
        else if(!ingredientElement) textAdd.innerHTML = '*กรุณากรอกส่วนประกอบด้วยนะจ้ะ'
        return false;
    }
    textAdd.innerHTML = ''
    return true;
}

function openEditFoodPopup(name, ingredients) {
    document.getElementById('editFoodPopup').style.display = 'block';
    const editFoodName = document.getElementById('foodNameEdit')
    const editIngredients = document.getElementById('ingredientsListEdit')
    document.getElementById('foodNameEdit').value = 'asd'
    editFoodName.value = `${name}`
    editIngredients.value = `${ingredients}`
    namenow = name
}

function resetEditFoodForm() {
    document.getElementById('foodNameEdit').value = '';
    document.getElementById('ingredientsListEdit').value = '';
    document.getElementById('text-edit').innerHTML = ''
}

function closeEditFoodPopup() {
    document.getElementById('text-edit').innerHTML = ''
    document.getElementById('editFoodPopup').style.display = 'none';
}

const submitEditFood = async () => {
    try {
        if (await validateFormEdit(document.getElementById('foodNameEdit').value)) {
            const foodName = document.getElementById('foodNameEdit').value
            const ingredients = document.getElementById('ingredientsListEdit').value
            const loadText = document.getElementById('successEdit')
            loadText.style.display = 'block'

            const newIngredient = (ingredients.split(',').map(s => s.trim())).join(', ')
            let menus = {
                name: foodName,
                ingredients: newIngredient
            }
            
            const response = await axios.put(`${BASE_URL}/edit-food/${namenow}`, menus)
            await searchMenu()
            setTimeout(() => {
                document.getElementById('editFoodPopup').style.display = 'none';
                document.getElementById('successEdit').style.display = 'none';
                
            }, 500)
        }
    } catch (error) {
        console.log(error.message)
    }
}


// -> Edit Food

//Add Food -> success
const validateFormAdd = async () => {
    const foodName = document.getElementById('foodNameAdd').value
    const ingredientElement = document.getElementById('ingredientsListAdd').value
    const textAdd = document.getElementById('text-add')
    const response = await axios.get(`${BASE_URL}/food-menu`)
    const nameOfFood = response.data.foodMenu.map(menu => menu.name)
    let nameequal = 0
    nameOfFood.forEach(name => {
        if(name==foodName){
            nameequal = 1
            return
        }
    })
    if (!foodName || !ingredientElement || nameequal) {
        if(nameequal) textAdd.innerHTML = '*ชื่อซ้ำกันอะเตง เปลี่ยนใหม่ดีกว่า'
        else if(!foodName && !ingredientElement) textAdd.innerHTML = '*กรุณากรอกชื่อเมนูอาหารและส่วนประกอบด้วยนะจ้ะ'
        else if(!foodName) textAdd.innerHTML = '*กรุณากรอกชื่อเมนูอาหาร'
        else if(!ingredientElement) textAdd.innerHTML = '*กรุณากรอกส่วนประกอบด้วยนะจ้ะ'
        return false;
    }
    textAdd.innerHTML = ''
    return true;
}

function openAddFoodPopup() {
    document.getElementById('addFoodPopup').style.display = 'block';
    resetAddFoodForm();
}

function resetAddFoodForm() {
    document.getElementById('foodNameAdd').value = '';
    document.getElementById('ingredientsListAdd').value = '';
    document.getElementById('text-add').innerHTML = ''
}

function closeAddFoodPopup() {
    document.getElementById('text-add').innerHTML = ''
    document.getElementById('addFoodPopup').style.display = 'none';
}

const submitAddFood = async () => {
    try {
        if (await validateFormAdd()) {
            const foodName = document.getElementById('foodNameAdd').value
            const ingredients = document.getElementById('ingredientsListAdd').value.trim()
            const loadText = document.getElementById('successAdd')
            loadText.style.display = 'block'

            const newIngredient = (ingredients.split(',').map(s => s.trim())).join(', ')
            let menus = {
                name: foodName,
                ingredients: newIngredient
            }
            
            const response = await axios.post(`${BASE_URL}/add-food`, menus)
            await searchMenu()
            setTimeout(() => {
                document.getElementById('addFoodPopup').style.display = 'none';
                document.getElementById('successAdd').style.display = 'none';
                resetAddFoodForm()
            }, 200)
        }
    } catch (error) {
        if(error.response) console.log(error.response.data.message)
    }
}

// -> Add Food


// Delete Food

const deleteFood = async (name) => {
    try{
        await axios.post('/delete-food', { name: name })
        await searchMenu()
    }catch (error){
        if(error.response) console.log(error.response.data.message)
    }
}

// -> Delete Food


