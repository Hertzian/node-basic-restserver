const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// opciones default
app.use(fileUpload({useTempFiles: true}));// utiliza middleware

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // validacion para parametros en url
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: `Los tipos permitidos son: ${tiposValidos.join(', ')}`,
                param1: tipo
            }
        });
    }

    // el nombre del archivo que se subirá
    let sampleFile = req.files.archivito;
    let fileName = sampleFile.name.split('.');
    let fileExtension = fileName[fileName.length - 1];
    
    // validar extension de archivo
    let validExtensions = ['png', 'jpg','gif','jpeg'];

    if(validExtensions.indexOf(fileExtension) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: `Las extensiones permitidas son: ${validExtensions.join(', ')}`,
                ext: fileExtension
            }
        });
    }

    // cambiar nombre del archivo
    let finalNameFile = `${id}_${Date.now()}.${fileExtension}`;

    // guarda archivo
    sampleFile.mv(`uploads/${tipo}/${finalNameFile}`, (err) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        // a este punto ya esta cargada la imagen
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, finalNameFile);
        }else{
            imagenProducto(id, res, finalNameFile);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDb) => {
        if(err){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDb){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok:false,
                err:{
                    message: `El usuario no existe`
                }
            });
        }

        borraArchivo(usuarioDb.img, 'usuarios');

        usuarioDb.img = nombreArchivo;

        usuarioDb.save((err, usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false, 
                    err:{message: 'Valio berta'}
                });
            }

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDb) => {
        if(err){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDb){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDb.img, 'productos');

        productoDb.img = nombreArchivo;

        productoDb.save((err, productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err:{message: 'Valio berta 2'}
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, nombreCarpeta){
    let pathImagen = path.resolve(__dirname, `../../uploads/${nombreCarpeta}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;