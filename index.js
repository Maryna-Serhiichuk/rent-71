const express = require('express')
require('dotenv').config();
const PORT = process.env.PORT || 4040

const mongoose = require('mongoose');
const url = `mongodb+srv://dev:${process.env.DB_PASSWORD}@cluster0.e2o58ot.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const { handler } = require('./controller')

const app = express()
app.use(express.json())
app.post("*", async (req, res) => {
    try {
        res.send(await handler(req))
    } catch (err) {
        res.send('Error')
    }
})

app.get("*", async (req, res) => {
    res.send('Hello get')
})

mongoose
	.connect(url)
	.then(res => console.log('Connect to mongoose'))
	.catch(err => console.log('mongoose error'))

app.listen(PORT, (err) => {
    // if(err) console.log(err)
    console.log('Server listening on PORT ', PORT)
})