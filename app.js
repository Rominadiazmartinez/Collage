const express = require("express")
const fs = require("fs/promises")
const path = require("path")
const expressFileUpload = require('express-fileupload');

const app = express()
app.use(express.static(path.resolve("public")))

let ruta = path.resolve(__dirname + "/public/imgs")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use( expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
    })
    );

app.listen(3000, () =>{
    console.log("Servidor escuchando en el puerto 3000")
})

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/formulario.html")
})

app.get("/collage", (req, res) =>{
    res.sendFile(__dirname + "/collage.html")
})

app.post("/imagen", async(req, res) =>{
    try {
        let {target_file} = req.files
        let {posicion} = req.body

        target_file.mv(`${ruta}/imagen-${posicion}.jpg`, (err) => {
            res.status(201).redirect("/collage")
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

app.get("/deleteImg/:posicion", async(req, res) =>{
    try {
        let {posicion} = req.params

        await fs.unlink(`${ruta}/${posicion}`)
        res.status(200).redirect("/collage")
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})
