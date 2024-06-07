import pdfMake from "pdfmake/build/pdfmake";

const imgflagEU = require('../js/banderaUS');
const imgflagMex = require('../js/banderaMX');
const imglogo = require('../js/logoSol');

const icons = require('../js/icons');


export default function GenerarBoleto(data) {
    console.log('dataBoleto',data);

let traduccion = {}
 
let flagEU = imgflagEU.imagen;
let flagMex = imgflagMex.imagen;
let logo = imglogo.imagen;

let facebook = icons.facebook;
let instagram = icons.instagram;
let youtube = icons.youtube;
let phone = icons.phone;
let envelope = icons.envelope;
let mapMarker = icons.mapMarker;

if(data.idioma == 'espanol'){
    traduccion = {
        folio: 'Folio',
        asiento: 'Asiento',
        vendedor: 'Vendedor',
        sucursal: 'Sucursal',
        pasajero: 'Pasajero',
        tipo: 'Tipo',
        cambio: 'Tipo de cambio',
        origen: 'Origen',
        fecha: 'Fecha',
        hora: 'Hora',
        destino: 'Destino',
        subtotal: 'Subtotal',
        descuento: 'Descuento',
        total: 'Total',
        matriz: 'Matriz'
    }
}else{
    traduccion = {
        folio: 'Sheet number',
        asiento: 'Seat',
        vendedor: 'Seller',
        sucursal: 'Branch office',
        pasajero: 'Traveler',
        tipo: 'Type',
        cambio: 'Change of rate',
        origen: 'Origin',
        fecha: 'Date',
        hora: 'Hour',
        destino: 'Destination',
        subtotal: 'Total parcial',
        descuento: 'Discount',
        total: 'Total',
        matriz: 'Matriz'
    }
}


var dd = {
    title: 'Boleto Viajes Azteca',
    author: 'Minetronix',
    subject: 'Boleto',
    keywords: 'Boleto',
    pageSize: 'LETTER', //792 x 612 pixeles
    pageOrientation: 'landscape',
    pageMargins: [10, 10, 10, 10],
    
    /****** BACKGROUND ******/
    background: function() {
        return{
            stack: [
                {
                    //IMAGEN PUBLICIDAD
                    absolutePosition: {x:546, y:115},
                    image: data.imagenPublicidad,
                    width: 211, //Estas son las medidas que se usaran reales
                    height: 335,
                },
                {
                    canvas: [
                        
                        //MASCARA PARA LA PUBLICIDAD
                        {
                           type: 'polyline',
                           lineWidth: 1,
                           color: 'white',
                           closePath: true,
                           points: [
                               { x: 521, y: 0}, 
                               { x: 521, y: 612 }, 
                               { x: 782, y: 612 }, 
                               { x: 782, y:0 }, 
                               { x: 757, y:0 }, 
                               { x: 757, y: 360 }, 
                               { x: 651.5, y: 450 }, 
                               { x: 546, y: 360 }, 
                               { x: 546, y: 0 } 
                            ]
                        },
                        //FONDO DE LOGO SECCION 1 PUBLICIDAD
                        {
                           type: 'polyline',
                           lineWidth: 0,
                           color: '#c92037',
                           closePath: true,
                           points: [
                               { x: 10, y: 10 },
                               { x: 782, y: 10 },
                               { x: 782, y: 115 },
                               { x: 10, y: 115 }, 
                            ]
                        },
                        {
                           type: 'polyline',
                           lineWidth: 0,
                           color: 'white',
                           closePath: true,
                           points: [
                               { x: 261, y: 10 },
                               { x: 521, y: 10 },
                               { x: 521, y: 115 },
                               { x: 261, y: 115 }, 
                            ]
                        },
                        {
        					type: 'line',
        					x1: 261, y1: 0,
        					x2: 261, y2: 612,
        					lineWidth: 0.5,
        					dash: { length: 10 },
        			    },
        			    {
        					type: 'line',
        					x1: 521, y1: 0,
        					x2: 521, y2: 612,
        					lineWidth: 1,
        			    },
        			    //Fondo asiento
        			    {
                           type: 'polyline',
                           lineWidth: 0,
                           color: '#c92037',
                           closePath: true,
                           points: [
                               { x: 660, y: 457.25118 },
                               { x: 792, y: 569.85781 },
                               { x: 792, y: 389.85781 },
                               { x: 765.5, y: 367.25118 }, 
                            ]
                        },
                        {
        					type: 'rect',
        					color: 'white',
        					x: 783,
        					y: 0,
        					w: 10,
        					h: 600,
        				},
                        {
        					type: 'ellipse',
        					x: 745, y: 435,
        					color: 'white',
        					r1: 25, r2: 25
        				},
                    ]
                },
                //LOGOTIPO SECCION 1 DATOS DE VIAJE
                {
                    absolutePosition: {
                      x: 15,
                      y: 21
                    },
                    width: 240,
                    image: logo
                },
                //LOGOTIPO SECCION 2 DATOS DE VIAJE
                /*{
                    absolutePosition: {
                      x: 273,
                      y: 21
                    },
                    width: 240,
                    image: logo
                },*/
                //LOGOTIPO SECCION 3 DATOS DE VIAJE
                {
                    absolutePosition: {
                      x: 530,
                      y: 21
                    },
                    width: 240,
                    image: logo
                },
                 //IMAGEN DE FONDO CALENDARIO SOL AZTECA
                /*{
                    absolutePosition: {x:20, y:475},
                    image: imgBack,
                    width: 230
                },*/
                //NO. DE ASIENTO
                {
                    absolutePosition: {x: 726, y: 468},
                    fontSize: 15,
                    bold: true,
                    color: 'orange',
                    text: traduccion.asiento
                }
            ]
        }
    },
    
    content: [
        {
            absolutePosition: {x: 20, y: 130},
            fontSize: 14,
            text: [traduccion.folio+": ", {text: (data.reasignacion)? data.reasignacion: data.folio, bold: true}],
            alignment: 'left',
            color: 'orange',
        },//0
        /****** SECCION 1 ******/
        {
            absolutePosition: {x: 20, y: 155},
            table:{
                widths: [211],
                body: [
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, -2, 0, -4],
                            fontSize: 11,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.vendedor+':'+'\n', {text: data.vendedor, bold: false}
                            ], 
                        },
                        
                    ],//0
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, -4],
                            fontSize: 11,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.sucursal+':'+'\n', {text: data.sucursal, bold: false}
                            ],
                        },    
                    ],//1
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, -4],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.pasajero+': \n', {text: data.pasajero, bold: false}
                            ]
                        },    
                    ],//2
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, 0],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.tipo+': ', {text: data.tipo, bold: false}
                            ]
                        },
                    ],//3
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, 0],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.origen+': ', {text: data.origen+'\n', bold: false},
                            ]
                        },
                    ],//4
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, 0],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.fecha+': ', {text: data.fecha, bold: false},traduccion.hora+': ', {text: data.hora, bold: false}
                            ],
                        },
                    ],//5
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, 0],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: [
                            	traduccion.destino+': ', {text: data.destino+'\n', bold: false},
                            ],
                        },
                    ],//6
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: 'white',
                            margin: [-4, 0, 0, 0],
                            fontSize: 10,
                            bold: true,
                            color: 'black',
                            alignment: 'left',
                            text: traduccion.cambio+': '+data.tipoDeCambio
                        }
                    ],//7
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            table: {
                                widths: [66,66,66],
                                body: [
                                    [
                                        {
                                            border: [false,false,false,false],
                                            alignment: 'left',
                                            fontSize:9,
                                            text: traduccion.subtotal+': \n'+'$'+parseFloat(data.subtotal).toFixed(2),
                                        },
                                        {
                                            border: [false,false,false,false],
                                            alignment: 'left',
                                            fontSize:9,
                                            text: traduccion.descuento+': \n'+'$'+parseFloat(data.descuento).toFixed(2),
                                        },
                                        {
                                            border: [false,false,false,false],
                                            alignment: 'left',
                                            fontSize:9,
                                            text: traduccion.total+': \n'+' $'+parseFloat(data.total).toFixed(2),
                                        }
                                    ]
                                ]
                            }
                        },
                    ],//8
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-15,5,-5,0],
                            table:{
                                widths:[242],
                                body:[
                                    [
                                        {
                                            border: [false,false,false,false],
                                            text: ''
                                        }
                                    ],
                                    [
                                        {
                                            border: [false,true,false,false],
                                            alignment: 'center',
                                            fillColor: '#c92037',
                                            width: 150,
                                            image: logo,
                                        }    
                                    ]
                                ]
                            }, layout: {
                                hLineStyle: function (i, node) {
                                    if (i === 0 || i === node.table.body.length) {
                                        return null;
                                    }
                                    return {dash: {length: 10, space: 4}};
                                },
                            }
                        }
                    ],//9
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            fontSize: 11,
                            text:[
                                {bold: true, text: traduccion.pasajero+': '}, 
                                {text: data.pasajero}    
                            ] 
                        }
                    ],//10
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            fontSize: 11,
                            text:[
                                {bold: true, text: traduccion.destino+': '}, 
                                {text: data.destino}    
                            ] 
                        }
                    ],//11
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            fontSize: 10,
                            text:[
                                {bold: true, text: traduccion.fecha+': '}, 
                                {text:data.fecha}    
                            ] 
                        }
                    ],//12
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            fontSize: 10,
                            text:[
                                {bold: true, text: traduccion.total+': '}, 
                                {text: data.tipoDeCambio+' $'+parseFloat(data.total).toFixed(2)}    
                            ] 
                        }
                    ],//13
                    [
                        {
                            border: [false,false,false,false],
                            margin: [-6,0,0,0],
                            fontSize: 10,
                            text:[
                                {bold: true, text: traduccion.folio+': '}, 
                                {text:data.folio}    
                            ] 
                        }
                    ]//14
                    
                ]
            }
        },//1
        /****** TERMINA SECCION 1 ******/
        /****** SECCION 2 ******/
        {
            absolutePosition: {x: 276, y: 15},
            border:[false, false, true, false],
            table:{
                widths:[100,120],
                body:[
                    [
                        {
                            border:[false, false, false, false],
                            margin: [-5, 15, 0, 0],
                            image: flagMex,
                            width: 100,
                        },
                        {
                            border:[false, false, false, false],
                            alignment: 'center',
                            text:[
                                {
                                    alignment: 'center',
                                    fontSize: 11,
                                    bold: true,
                                    color: 'red',
                                    text: traduccion.matriz+': \n'
                                },
                                data.direccionMatriz+'\n',
                                data.telefonoMatriz
                            ]
                        } 
                    ],
                    [
                        {
                            border:[false, false, false, false],
                            margin: [-5, -5, 0, 0],
                            colSpan: 2,
                            table:{
                                widths:[120,100],
                                body:[
                                    [
                                        {
                                            border:[false, false, false, false],
                                            margin: [0, 5, 0, 0],
                                            alignment: 'center',
                                            fontSize: 9,
                                            text:[
                                                {
                                                    alignment: 'center',
                                                    fontSize: 11,
                                                    bold: true,
                                                    color: 'red',
                                                    text: traduccion.matriz+': \n'
                                                },
                                                data.direccionMatrizEU+'\n',
                                                data.telefonoMatrizEU
                                            ]
                                        },
                                        {
                                            border:[false, false, false, false],
                                            margin: [0, 15, 0, 0],
                                            image: flagEU,
                                            width: 100,
                                        },
                                    ],
                                ]
                            }
                        },
                        {}
                    ],
                    [
                        {
                            margin: [0, 10, 0, 10],
                            border:[false, false, false, false],
                            colSpan: 2,
                            alignment: 'center',
                            bold: true,
                            fontSize: 20,
                            color: '#c92037',
                            text: data.frase
                        },{}    
                    ],
                    [
                        {
                            border:[false, false, false, false],
                            margin: [0, 5, 0, 0],
                            colSpan: 2,
                            stack: [
                                {
                                    alignment:'center',
                                    color: 'red',
                                    bold: true,
                                    fontSize: 10,
                                    text: 'En caso  de que usted solicite permiso para entrar a EU, se le recomienda llevar:\n'  
                                },
                                {
                                    margin: [0, 7, 0, 0],
                                    fontSize: 10,
                                    text: data.permiso
                                }
                            ]
                        },{}    
                    ],
                    [
                        {
                            border:[false, false, false, false],
                            margin: [0, 5, 0, 0],
                            colSpan: 2,
                            stack: [
                                {
                                    alignment:'center',
                                    color: 'red',
                                    bold: true,
                                    fontSize: 8,
                                    text: 'Política:\n\n'  
                                },
                                {
                                    fontSize: 6,
                                    text: data.politicas
                                }
                            ]
                        },{}    
                    ],
                ]
            }
        },//2
       /* {
            absolutePosition: {x:0, y:80},
            image: publicidad,
            width: 334,
            height: 420,
        }//3*/
        /****** TERMINA SECCION 2 ******/
        /****** SECCION 3 ******/
        //No. de asiento (plaza)
        {
            absolutePosition: {x: 734, y: 423},
            fontSize: 20,
            bold: true,
            color: 'orange',
            text: (data.noAsiento > 9) ? data.noAsiento : '0'+data.noAsiento
        },//3
        {
            absolutePosition: {x: 546, y: 420},
            table:{
                widths: [10, 150],
                body: [
                    [
                        {
                            margin: [0,0,0,5],
                            colSpan: 2,
                            table:{
                                widths: [104],
                                body: [
                                    [
                                        {
                                            bold: true,
                                            color: '#c92037',
                                            text: traduccion.folio+':'
                                        }
                                    ],
                                    [
                                        {
                                            text: data.folio
                                        }    
                                    ]
                                ]
                            }, layout: 'noBorders'
                        },{}    
                    ],//0
                    [
                        {
                            //font: 'Icon',
                            //color: 'orange',
                            //alignment: 'center',
                            //fontSize: 13,
                            width: 11,
                            image: phone
                        },
                        {
                            table:{
                                widths: [98],
                                body: [
                                    [
                                        {
                                            fontSize: 10,
                                            color: 'black',
                                            text: data.telSucursal
                                        }    
                                    ]    
                                ]
                            }, layout: 'noBorders'
                        }
                    ],//1
                    [
                        {
                            margin: [0,5,0,0],
                            //font: 'Icon',
                            //color: 'orange',
                            //alignment: 'center',
                            //fontSize: 13,
                            stack: [
                                {
                                    width: 13,
                                    image: envelope
                                }
                            ]
                        },
                        {
                            margin: [0,5,0,0],
                            table:{
                                widths: [132],
                                body: [
                                    [
                                        {
                                            fontSize: 10,
                                            color: 'black',
                                            text: data.correoSucursal
                                        }    
                                    ]    
                                ]
                            }, layout: 'noBorders'
                        }
                    ],//2
                    [
                        {
                            //margin: [0,5,0,0],
                            //font: 'Icon',
                            //color: 'orange',
                            //alignment: 'center',
                            //fontSize: 13,
                            stack: [
                                {
                                    width: 10,
                                    image: mapMarker
                                }
                            ]
                        },
                        {
                            fontSize: 10,
                            color: 'black',
                            margin: [0,5,0,0],
                            text: data.dirSucursal
                        }    
                    ],//3
                    [//Iconos de redes sociales
                        {
                            //font: 'Icon',
                            colSpan:2,
                            margin: [0,15,0,0],
                            //fontSize: 20,
                            //color: '#c92037',
                            //text: ''+'  '+''+'  '+''
                            columns: [
                                {
                                    width: 10,
                                    image: facebook
                                },
                                {
                                    fontSize: 20,
                                    text: '  '
                                },
                                {
                                    width: 20,
                                    image: instagram
                                },
                                {
                                    fontSize: 20,
                                    text: '  '
                                },
                                {
                                    width: 20,
                                    image: youtube
                                },
                            ]
                        },{}    
                    ]//4
                ]
            }, layout: 'noBorders'
            
        }//4
        /****** TERMINA SECCION 3 ******/
    ]
}


    pdfMake.fonts = {
        Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
        }
    };

    pdfMake.createPdf(dd).open();
}