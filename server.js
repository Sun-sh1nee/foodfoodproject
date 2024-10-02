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

        res.json({
            message: 'OK',
            data: updatedMenus
        });
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Error updating food details', errorMessage: err.message });
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
