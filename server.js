require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
// Load environment variables

const app = express();
const port = 3000;

// Initialize Supabase client
const supabaseUrl = 'https://chmpoixartmxnygumekm.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to get random food items
app.get('/random-food', async (req, res) => {
    try {
        const { data: menus, error } = await supabase
            .from('menus')
            .select('*');
        
        if (error) throw error;

        const randomFoods = [];
        while (randomFoods.length < 3 && menus.length > 0) {
            const randomIndex = Math.floor(Math.random() * menus.length);
            const food = menus[randomIndex];
            if (!randomFoods.includes(food)) {
                randomFoods.push(food);
            }

            if (menus.length === randomFoods.length) break;
        }
        res.json({ foods: randomFoods });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Function to add a new food item
app.post('/add-food', async (req, res) => {
    try {
        const menus = req.body;

        if (!menus) {
            return res.status(400).json({ message: "Bad Request: No data provided" });
        }

        const { error } = await supabase
            .from('menus')
            .insert(menus);

        if (error) throw error;

        res.status(201).json({ message: 'Food added successfully' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            message: error.message,
            errorMessage: error.message
        });
    }
});

// Function to delete a food item
app.post('/delete-food', async (req, res) => {
    try {
        const { name } = req.body;
        const { error } = await supabase
            .from('menus')
            .delete()
            .eq('name', name);

        if (error) throw error;

        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting food' });
    }
});

// Function to fetch all food items
app.get('/food-menu', async (req, res) => {
    try {
        const { data: foodMenu, error } = await supabase
            .from('menus')
            .select('*');
        
        if (error) throw error;

        res.json({ foodMenu });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food menu' });
    }
});

// Function to get food details
app.get('/get-food-details', async (req, res) => {
    try {
        const { name } = req.query;
        const { data: food, error } = await supabase
            .from('menus')
            .select('*')
            .eq('name', name)
            .single();

        if (error) throw error;

        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json({ food });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food details' });
    }
});

// Function to update a food item
app.put('/edit-food/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const updatedMenus = req.body;

        console.log('Name:', name); // Log the name parameter
        console.log('Updated Menus:', updatedMenus); // Log the update payload

        // Perform the update operation
        const { data, error } = await supabase
            .from('menus')
            .update(updatedMenus)
            .eq('name', name)
            .single(); // Use .single() if you expect a single row to be updated

        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ message: 'Error updating food details', errorMessage: error.message });
        }

        console.log("is data : ", data)
        // if (!data) {
        //     return res.status(404).json({ message: 'ไม่พบเมนูอาหาร' });
        // }

        res.json({
            message: 'OK',
            data: updatedMenus
        });
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Error updating food details', errorMessage: err.message });
    }
})


// Function to get available foods based on ingredients
app.post('/available-foods', async (req, res) => {
    try {
        const { availableIngredients } = req.body;

        // Validate availableIngredients
        if (!availableIngredients || !Array.isArray(availableIngredients)) {
            return res.status(400).json({ message: 'Bad Request: availableIngredients must be an array' });
        }

        // Fetch all foods from the 'menus' table
        const { data: results, error } = await supabase
            .from('menus')
            .select('*');

        if (error) {
            throw error;
        }

        // Filter available foods based on ingredients
        const availableFoods = results.filter(food => {
            // Assuming 'food.ingredients' is a comma-separated string
            const ingredientsArray = food.ingredients.split(', ').map(ingredient => ingredient.trim());
            return availableIngredients.every(ingredient => ingredientsArray.includes(ingredient));
        });

        // Log the available foods for debugging
        console.log('Available Foods:', availableFoods);

        // Respond with available foods
        res.json({ availableFoods });
    } catch (error) {
        console.error('Error fetching available foods:', error.message);
        res.status(500).json({ message: 'Error fetching available foods' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
