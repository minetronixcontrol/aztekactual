const express = require('express'); //requerimiento de express
const router = express.Router();   // invocacion de la funcion router del modulo express
const DescuentoFamiliar = require('../models/DescuentoFamiliar');
const Descuento = require('../models/DescuentosNuevo');
const Usuario = require('../models/Usuarios');
const Cliente = require('../models/Clientes');

router.get('/', async (req, res) => {
    const descuento = await DescuentoFamiliar.find();
    console.log(descuento);
    res.json(descuento);
});

router.get('/:id', async (req, res) =>{
    const descuento = await DescuentoFamiliar.findById(req.params.id);
    res.json(descuento);
});

router.get('/:value/:field', async (req, res) =>{
    switch (req.params.field) {
        case 'activo':
            try {
                let respuesta = [];
                const descuentos = await DescuentoFamiliar.find({activo: 'true'});
                //res.json(descuentos);
                for (let i = 0; i < descuentos.length; i++) {
                    let usuario = await Usuario.findById(descuentos[i].usuario);
                    let familiaTxt = '';
                    for (let j = 0; j < descuentos[i].familia.length; j++) {
                        let cliente = await Cliente.findById(descuentos[i].familia[j]);
                        familiaTxt+=`${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}, `;
                    }
                    let arrayFecha = descuentos[i].fechaDeCompra;
                    arrayFecha = arrayFecha.split('-',3);
                    let fechaDeCompra = `${arrayFecha[2]}-${arrayFecha[1]}-${arrayFecha[0]}`;
                    respuesta.push({
                        _id: descuentos[i]._id,
                        familia: familiaTxt,
                        usuario: `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`,
                        fechaDeCompra: fechaDeCompra,
                        status: (descuentos[i].status == 'true')? 'Aprobado':'No aprobado'
                    });
                    
                }
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
            break;
        case 'descuentoFamiliar':
            try {
                const descuento = await Descuento.find({nombre: 'Descuento Familiar'});
                res.json(descuento);
            } catch (error) {
                res.json(error);
            }
            break;
    
        default:
            break;
    }
})

router.post('/', async (req, res)=>{
    const {familia,usuario,fechaDeCompra,status,activo} = req.body;
    const descuento = new DescuentoFamiliar({familia,usuario,fechaDeCompra,status,activo});
    await descuento.save(function(err, result){
        if(err) {
          response = { error: true, message: "Error adding data" };
        } else {
          response = { error: false, message: "Data added", id: result._id };
        }
        res.json(response);
    });
    //res.json({status: 'DESCUENTO SOLICITADO!!!!!'});
});

router.put('/:id', async (req, res) => {
    const {familia,usuario,fechaDeCompra,status} = req.body;
    const descuento = {familia,usuario,fechaDeCompra,status};
    await DescuentoFamiliar.findByIdAndUpdate(req.params.id, descuento);
    res.json({status:'ASIENTO ACTUALIZADO!!!'});
});

router.put('/:id/:value/:field', async (req, res) => {
    switch (req.params.field) {
        case 'status':
            try {
                let val = '';
                if(req.params.value == 'Aprobado'){
                    val = 'true';
                }else{
                    val = 'false';
                }
                await DescuentoFamiliar.findOneAndUpdate(
                    { _id: req.params.id },
                    { status: val }
                );
                res.json({status:'SOLICITUD DE DESCUENTO ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
        case 'activo':
            try {
                await DescuentoFamiliar.findOneAndUpdate(
                    { _id: req.params.id },
                    { activo: req.params.value }
                );
                res.json({status:'SOLICITUD DE DESCUENTO ACTUALIZADO!!!'});
            } catch (error) {
                console.log(error);
                res.json(error);
            }
            break;
    
        default:
            break;
    }
})

router.delete('/:id', async (req, res) => {
    await DescuentoFamiliar.findByIdAndRemove(req.params.id);
    res.json({status:'ASIENTO DESAPARTADO!!!'});
})
module.exports = router;