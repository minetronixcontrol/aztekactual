const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const ListaNegra = require('../models/ListaNegra.js');
const Cliente = require('../models/Clientes');


router.get('/', async (req, res) => {
    const listaNegra = await ListaNegra.find();
    res.json(listaNegra);
});

router.get('/:id', async (req, res) =>{
    if(req.params.id == 'ListaNegra'){
        let retorno = [];
        let cliente = null;
        try {
            let listaNegra = await ListaNegra.find();
            if(listaNegra.length > 0){
                for (let i = 0; i < listaNegra.length; i++) {
                    cliente = await Cliente.findById(listaNegra[i].idCliente);
                    retorno[i] = {
                        "_id": listaNegra[i]._id,
                        "idCliente": `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        "motivo": listaNegra[i].motivo
                    }
                }
            }else{
                res.json(retorno);
            }
            res.json(retorno);
        } catch (error) {
            res.json(error);
        }
    }else{
        try {
            let listaNegra = await ListaNegra.findById(req.params.id);
            res.json(listaNegra);
        } catch (error) {
            res.json(error);
        }
    }    
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'idCliente':
            try {
                const listaNegra = await ListaNegra.find({idCliente: req.params.value});
                res.json(listaNegra);
            } catch (error) {
                console.log(error);
            }
            break;
    
        default:
            break;
    }
});

router.post('/', async (req, res)=>{
    let id = req.body.idCliente;    
    try {
        await Cliente.findOneAndUpdate(
            { _id: id},
            { listaNegra: 'true' }
        );
        const {idCliente, motivo} = req.body;
        const listaNegra = new ListaNegra({idCliente, motivo});
        await listaNegra.save();
    } catch (error) {
        console.log(error);
        res.json(error);
    }
    res.json({status: 'listaNegra GUARDADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {idCliente, motivo} = req.body;
    const nuevolistaNegra = {idCliente, motivo};
    await ListaNegra.findByIdAndUpdate(req.params.id, nuevolistaNegra);
    res.json({status:'listaNegra ACTUALIZADO!!!'});
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'motivo':
            try {
                await ListaNegra.findOneAndUpdate(
                    { _id: req.params.id },
                    { motivo: req.params.value }
                );
                res.json({status:'ListaNegra ACTUALIZADO!!!'});
            } catch (error) {
                res.json(error);
            }
            brea
            break;
    
        default:
            break;
    }
});

router.delete('/:id', async (req, res) => {
    let listaNegraCliente = await ListaNegra.findById(req.params.id);
    let idCliente = listaNegraCliente.idCliente;
    await Cliente.findOneAndUpdate(
        { _id: idCliente},
        { listaNegra: 'false' }
    );
    await ListaNegra.findByIdAndRemove(req.params.id);
    res.json({status:'listaNegra ELIMINADO!!!'});
});
module.exports = router;