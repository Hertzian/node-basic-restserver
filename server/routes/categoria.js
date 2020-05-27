const express = require('express');
let {verificaToken, verificaAdminRole} = require('../middleware/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


// Mostrar todas las categorias
app.get('/categoria', verificaToken,(req, res) => {
    Categoria
        .find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        // .populate('usuario','nombre email') // En caso de que haya mas campos por popular
        .exec((err, categorias) =>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
            });
            
        });
});

// Mostrar una sola categoria
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria
        .findById(
            id,
            (err, categoriaDb) =>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                if(!categoriaDb){
                    return res.status(400).json({
                        ok:false,
                        err: {
                            message: 'No se encontró'
                        }
                    })
                }

                res.json({
                    ok:true,
                    categoria: categoriaDb
                });
            });

});

// Crear una sola categoria
app.post('/categoria', verificaToken, (req, res) => {
    // regresa nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDb){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });
    });
});

// Actuazliza categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    // regresa nueva categoria
    let id = req.params.id;
    let body = req.body;
    
    let descripcionCategoria = {
        descripcion: body.descripcion
    }
    console.log(descripcionCategoria)

    Categoria.findByIdAndUpdate(
        id,
        descripcionCategoria,
        {new: true, runValidators: true},
        (err, categoriaDb) => {
            console.log(err)
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!categoriaDb){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                categoria: categoriaDb
            });
        });
    
});

// Actuazliza categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo un admin borra categoria eliminar definitivamente
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    // Categoria.findByIdAndUpdate(
    Categoria.findByIdAndRemove(
        id,
        // cambiaEstado,
        // {new:true},
        (err, categoriaBorrada) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if(!categoriaBorrada){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Categoria no existe'
                    }
                });
            }

            res.json({
                ok:true,
                categoria: categoriaBorrada,
                message: 'Categoria borrada'
            });
        });

});

module.exports = app;