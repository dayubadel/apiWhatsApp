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

        console.log(resWatson);

        (async () => {
            for (const element of resWatson) {
                let returned
                //console.log(element,'pertilente')

                enviamensajeWs.enviamensaje(idWhatsapp,element)

                // if(element.response_type == "text"){
                //     //console.log(idWhatsapp,'parametros enviados')
                   
                //     //console.log(element,'op1')
                // } else if(element.response_type == "option"){
                //     var texto = element.title + '\n'
                //     element.options.forEach(element2 => {
                //         texto = texto + '  • '+element2.label + '\n'
                //     });
                // } else if(element.response_type == "image"){
                //     //sendFileRequest.caption = element.title
                    
                //     // console.log(returned)
                // }
            }
        })()

        })
        .catch(err => {
            //si sudede erro, enviar a grupo de soporte el mensaje
            console.log(err)
            //res.send("error")
        })

    
}
module.exports = watsonResponse