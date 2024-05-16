import express from "express"

const app = express()
const port = 3000

app.use(express.static('public', {index: "./client/index.html"}))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})