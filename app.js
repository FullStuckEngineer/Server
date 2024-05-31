require("dotenv").config()
const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const port = process.env.PORT || 8000

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})