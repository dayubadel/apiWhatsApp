var http = require("http");
var fetch = require('node-fetch');
var enviamensajeWs = require('../index.js')

const watsonResponse = {};

watsonResponse.EnviaWatson = async(paramsPetition,idWhatsapp) =>{
    console.log('enviado de whatsapp**********************************'+idWhatsapp)
    var uriApi = "http://localhost:8000/watson"

    var sendMessageRequest = {
      body: '',
      chatId: ''
    }
    // var sendFileRequest

    fetch(uriApi,paramsPetition)
    .then(res => res.json())
    .then(resWatson => {

        //console.log(resWatson);

        (async () => {
            var i = 0
            for (const element of resWatson) {
                

                await enviamensajeWs.enviamensaje(idWhatsapp,element)
                
            }
        })()

        })
        .catch(err => {
            //si sudede erro, enviar a grupo de soporte el mensaje
            console.log(err)
            let respuestError = {
                response_type: 'text',
                text: 'Hola, Te pido disculpas, en este momento me encuentro con dificultades tecnicas.\nPor favor intentalo mas tarde'
            }
            enviamensajeWs.enviamensaje(idWhatsapp,respuestError)
        })

    
}


watsonResponse.enviarMensajeWhatsapp = async (req, res) => {
    var objMensajeWatson = req.body.objMensajeWatson
    var idWhatsapp = req.body.idWhatsapp
    await (async () => {
        var i = 0
        for (const element of objMensajeWatson) {

            await enviamensajeWs.enviamensaje(idWhatsapp,element)
        }
    })()
    
    res.send({"ok":'ok'})
}
module.exports = watsonResponse