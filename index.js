process.title = "WP AUTOPEDIDOS";

const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js')
var http = require('https');

const watsonResponse = require('./controllers/watsonApiController.js')

//const client = new Client();
const SESSION_FILE_PATH = 'session.json';
// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    let rawdata = fs.readFileSync('session.json');
    let wTcODE = JSON.parse(rawdata);
    sessionData = wTcODE;
}
// Use the saved values
const client = new Client({
    session: sessionData
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client is ready!' + '***' + client.info.me._serialized + '****');
	console.log('API WhatsApp');
});
    
client.on('message', message => {
    console.log(message)
    if (message.id.remote=='status@broadcast'){
    }else{
        if (message.type =='chat'){
            
            var mensajeInput = {
                textMsg: message.body,
                idChat: message.id.remote,
                idCanal: 1 //s1 = WHATSAPP => REVISAR TABLA DE BD "CanalMensajeria"
            }
            var instancIaInput = message.id.id

            var paramsPetition = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mensajeInput)
            }
            
            const otrafuncion = async () => {
                watsonResponse.EnviaWatson(paramsPetition,message.id.remote)
            }  

            otrafuncion()
            
        }else if (message.type =='location'){
            var location= {
                from: message.from,
                location: message.location
            }
            //aqui escribimos si necesitan usar funcion de localizacion.               
                
        }
        
        }
    
});

client.initialize();

function enviamensaje(idchat, mensaje){
    console.log(mensaje,'llegada')
    let cadena = mensaje.text
    let img = 'image'
    let posicion = -1
    try {
        posicion = cadena.indexOf(img)
    } catch (error) {
        posicion = -1
    }
    

    if (posicion == 0){
        let cadena_nueva = cadena.split('^')
        mensaje.text = cadena_nueva[1]
        let url = cadena_nueva[0]
    
        url = url.split(':')
        let urlNueva = url[1] + ':' + url[2]
        //console.log(urlNueva,'aaaa')
        let imgBase =ImgUrl(urlNueva,idchat,mensaje.title)
        
        //imgBase = imgBase.split(',')
        //console.log(imgBase[0])
        //const media = new MessageMedia('image/png',base64data)
        //client.sendMessage(idchat,media,{caption: mensaje.title})
    }


    if (mensaje.response_type == 'text'){
        client.sendMessage(idchat, mensaje.text)
    }
    else{
        if (mensaje.response_type == 'option'){
            let respuesta = mensaje.title + '\n'
            mensaje.options.forEach(element => {
            respuesta = respuesta + element.label + '\n'
            });
            client.sendMessage(idchat, respuesta)
        }else{
            if (mensaje.response_type == 'image'){
                
                ImgUrl(mensaje.source,idchat,mensaje.title)
        }


        }
    
    }

}

async function ImgUrl(urlPic,wsID,descrip){

    http.get(urlPic, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            let respuesta1 = body.split(',')
            let imgb64 = respuesta1[1]
            let datas = respuesta1[0]
            datas = datas.split(';')
            datas = datas[0]
            datas = datas.split(':')
            datas = datas[1]
            
            const media = new MessageMedia(datas,imgb64)
            client.sendMessage(wsID,media, { caption: descrip })
            //return res.json({result: body, status: 'success'});
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

}
exports.enviamensaje=enviamensaje