const express = require('express');
const {verificaToken} = require('../middleware/autenticacion');
const app = express();
let Producto = require('../models/producto')

// obtener todos los productos
app.get('/productos', verificaToken,(req,res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);

    Producto
        .find({disponible:true}, 'nombre precioUni descripcion img disponible categoria usuario')
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({disponible: true}, (err, cuantosHay) =>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    productos: productos,
                    cuantos: cuantosHay
                });
            });
        });
});

// obtener un producto por id
app.get('/producto/:id', verificaToken,(req, res) => {
    let id = req.params.id;

    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDb) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productoDb){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDb
            });
        });
            
});

// Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto
        .find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// Crear un producto
app.post('/producto', verificaToken,(req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        img: body.img,
        categoria: body.categoria,
    });

    producto.save((err, productoDb) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDb){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.status(201).json({
            ok:true,
            producto: productoDb
        });
    });
});

// actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(
        id,
        (err, productoDb) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            if(!productoDb){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'El producto no existe'
                    }
                });
            }

            productoDb.nombre = body.nombre;
            productoDb.precioUni = body.precioUni;
            productoDb.categoria = body.categoria;
            productoDb.disponible = body.disponible;
            productoDb.descripcion = body.descripcion;

            productoDb.save((err, productoGuardado) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    producto: productoGuardado
                });
            });
        });
});

// borrar un producto
app.delete('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDb) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDb){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDb.disponible = false;

        productoDb.save((err, productoBorrado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                producto: productoBorrado,
                message: 'El producto se ha eliminado'
            });
        });

    });
});

module.exports = app;