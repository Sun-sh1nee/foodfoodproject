// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

let foodMenu = [
    { name: "ข้าวผัด", ingredients: ["ข้าว", "ไข่", "ผัก"] },
    { name: "ต้มยำกุ้ง", ingredients: ["กุ้ง", "ตะไคร้", "ใบมะกรูด"] },
    { name: "ผัดไทย", ingredients: ["เส้นผัดไทย", "กุ้ง", "ถั่วงอก"] },
    { name: "แกงเขียวหวาน", ingredients: ["ไก่", "มะเขือ", "พริกแกงเขียวหวาน"] },
    { name: "ส้มตำ", ingredients: ["มะละกอ", "พริก", "น้ำปลา"] }
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ฟังก์ชันสุ่มเมนูอาหาร
// server.js
app.get('/random-food', (req, res) => {
    const randomFoods = [];
    while (randomFoods.length < 3) {
        const randomIndex = Math.floor(Math.random() * foodMenu.length);
        const food = foodMenu[randomIndex];
        if (!randomFoods.includes(food)) {
            randomFoods.push(food);
        }
    }
    res.json({ foods: randomFoods });
});

app.post('/delete-food', (req, res) => {
    const { name } = req.body;
    const index = foodMenu.findIndex(food => food.name === name);
    if (index !== -1) {
        foodMenu.splice(index, 1);
        res.json({ message: 'ลบเมนูอาหารเรียบร้อยแล้ว' });
    } else {
        res.status(404).json({ message: 'ไม่พบเมนูอาหาร' });
    }
});

// ฟังก์ชันเพิ่มเมนูอาหาร
app.post('/add-food', (req, res) => {
    const { name, ingredients } = req.body;

    // ตรวจสอบว่าชื่อเมนูอาหารและวัตถุดิบไม่ว่างเปล่า
    if (!name || !ingredients || ingredients.length === 0) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    const newFood = { name, ingredients };
    foodMenu.push(newFood);
    res.json({ message: ingredients });
});

// ฟังก์ชันเปลี่ยนข้อมูลของเมนูอาหาร
app.put('/edit-food/:index', (req, res) => {
    const { index } = req.params;
    const { name, ingredients } = req.body;
    foodMenu[index] = { name, ingredients };
    res.json({ message: 'Food updated successfully' });
});

// ฟังก์ชันแสดงรายการอาหารที่ทำได้
app.post('/available-foods', (req, res) => {
    const { availableIngredients } = req.body;
    const availableFoods = foodMenu.filter(food => food.ingredients.every(ingredient => availableIngredients.includes(ingredient)));
    res.json({ foods: availableFoods });
});

// ฟังก์ชันดึงข้อมูลเมนูอาหารทั้งหมด
app.get('/food-menu', (req, res) => {
    res.json({ foodMenu });
});

// ฟังก์ชันดึงรายละเอียดของเมนูอาหาร
app.get('/get-food-details', (req, res) => {
    const { name } = req.query;
    const food = foodMenu.find(food => food.name === name);
    if (food) {
        res.json(food);
    } else {
        res.status(404).json({ message: 'ไม่พบเมนูอาหาร' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
