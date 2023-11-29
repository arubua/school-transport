require("dotenv").config()
let path = require("path")
const express = require("express")

let app = express()

app.get("/*", function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString())
  next()
})

// server static files
app.use(express.static(path.join(__dirname, "build")))

// route all requests to index
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

const port = process.env.PORT || 3401

// start listening
app.listen(port, ()=>{
  console.log("School Transport dashboard running on "+port)
})
