const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const port = 3000

// 中间件
app.use(cors())
app.use(express.json())

// 创建数据库连接
const db = new sqlite3.Database('contacts.db', (err) => {
  if (err) {
    console.error('数据库连接失败:', err)
  } else {
    console.log('成功连接到数据库')
  }
})

// 创建联系人表
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
  )
`)

// 获取所有联系人
app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// 添加联系人
app.post('/contacts', (req, res) => {
  const { name, phone } = req.body
  db.run('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id: this.lastID })
  })
})

// 更新联系人
app.put('/contacts/:id', (req, res) => {
  const { name, phone } = req.body
  db.run(
    'UPDATE contacts SET name = ?, phone = ? WHERE id = ?',
    [name, phone, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json({ message: '联系人已更新' })
    }
  )
})

// 删除联系人
app.delete('/contacts/:id', (req, res) => {
  db.run('DELETE FROM contacts WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: '联系人已删除' })
  })
})

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
}) 