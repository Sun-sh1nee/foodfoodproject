const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 3000

const mysql = require('mysql2/promise')


let db = null
// const initMySQL = async () => {
//     db = await mysql.createConnection({
//         host: 'fdb1030.awardspace.net',
//         user: '4513320_foodforrandom',
//         password: 'zKfb!UeD8a(5rNGM',
//         database: '4513320_foodforrandom',
//         port: 3306
//     })
// }
const initMySQL = async () => {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'food_menu'
    })
}
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

// ฟังก์ชันสุ่มเมนูอาหาร
app.get('/random-food', async (req, res) => {
    try {
        const randomFoods = []
        const result = await db.query('SELECT * FROM menus')
        const menus = result[0]
        while (randomFoods.length < 3) {
            const randomIndex = Math.floor(Math.random() * menus.length);
            const food = menus[randomIndex];
            if (!randomFoods.includes(food)) {
                randomFoods.push(food);
            }

            if(menus.length === randomFoods.length) break
        }
        res.json({ foods: randomFoods });
    } catch(error) {
        res.json({ message: error.message });
    }
})

// ฟังก์ชันเพิ่มเมนูอาหาร
app.post('/add-food', async (req, res) => {
    try {
        let menus = req.body;

        if (!menus) {
            throw {
                statusCode: 404,
                message: "NOT FOUND! !"
            };
        }

        const sql = 'INSERT INTO menus SET ?';
        await db.query(sql, menus);

        res.status(201).json({ message: 'Food added successfully' });
    } catch (error) {
        let statusCode = error.statusCode || 500;
        console.log("ERROR!!! : ", error.message);
        res.status(statusCode).json({ 
            message: 'Error adding food',
            errorMessage: error.message
        });
    }
});


//ลบอาหาร
app.post('/delete-food', async (req, res) => {
    try {
        const { name } = req.body;
        const sql = 'DELETE FROM menus WHERE name = ?';
        const [result] = await db.query(sql, [name]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบเมนูอาหาร' });
        }
        res.json({ message: 'ลบเมนูอาหารเรียบร้อยแล้ว' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting food' });
    }
})

// ฟังก์ชันดึงข้อมูลเมนูอาหารทั้งหมด
app.get('/food-menu', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM menus');
        res.json({ foodMenu: results });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching food menu' });
    }
})


// ฟังก์ชันเปลี่ยนข้อมูลของเมนูอาหาร
// ฟังก์ชันแสดงรายการอาหารที่ทำได้


// ฟังก์ชันดึงรายละเอียดของเมนูอาหาร
app.get('/get-food-details', async (req, res) => {
    try {
        const { name } = req.query
        const results = await db.query('SELECT * FROM menus WHERE name = ?', [name])
        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเมนูอาหาร' })
        }
        res.json({foods : results[0]})
    } catch (err) {
        res.status(500).json({ message: 'Error fetching food details' })
    }
})

app.put('/edit-food/:index', async (req, res) => {
    try {
        let name = req.params.index;
        let updatedMenus = req.body;
        const results = await db.query('UPDATE menus SET ? WHERE name = ?', [updatedMenus, name])
        console.log(updatedMenus)
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบเมนูอาหาร' })
        }
        res.json({
            message: "OK",
            data:  updatedMenus
        })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching food details' })
    }
})

app.post('/available-foods', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM menus');
        const { availableIngredients } = req.body;

        const availableFoods = results.filter(food => {
            const ingredients = food.ingredients.split(',').map(ingredient => ingredient.trim());
            return ingredients.some(ingredient => availableIngredients.includes(ingredient));
        })
        console.log(availableFoods)
        res.json({ foodMenu: availableFoods });
    } catch (err) {
        console.error(err) // เพิ่มการบันทึกข้อผิดพลาด
        res.status(500).json({ message: 'Error fetching food menu' })
    }
})



app.listen(port, async (req, res) => {
    await initMySQL()
    console.log(`Server is running on http://localhost:${port}`);
})
