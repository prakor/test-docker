const express = require('express')
const mysql = require('mysql2/promise')
const app = express()

const port = 8000

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'db', // หรือใส่เป็น localhost ก็ได้
    user: 'root',
    password: 'root',
    database: 'tutorials'
  })
}

const waitForDB = async (retries = 5) => {
  while (retries) {
    try {
      await initMySQL();
      console.log('เชื่อมต่อ MySQL สำเร็จ');
      break;
    } catch (err) {
      console.log('กำลังรอ MySQL...');
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    console.error('ไม่สามารถเชื่อมต่อ MySQL ได้');
    process.exit(1);
  }
};

app.get('/hello-world', (req, res) => {
  res.send('hello world')
})

app.get('/users', async (req, res) => {
  const [results] = await conn.query('SELECT * FROM users')
  res.json(results)
})


app.listen(port, async () => {
  await waitForDB();
  console.log(`Server running at http://localhost:${port}/`)
})