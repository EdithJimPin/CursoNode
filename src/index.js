const http = require('http');
//se pide el archivo bodyParser
const { bodyParser } = require('./lib/bodyParser')
let baseDeDatos = [];

//getTaskHandler
function obtenerTareas(requisicion, respuesta){
    respuesta.writeHead(200, {'Content-Type': 'application/json'});
    respuesta.write(JSON.stringify(baseDeDatos)); //es un objeto JSON, se convierte a string
    respuesta.end();
}

async function crearTareas(requisicion, respuesta){  //para que funcione el await debe tener l apalabra clave
    try {
        await bodyParser(requisicion)  //await para indicarle que llevará algo de tiempo
        baseDeDatos.push(requisicion.cuerpoDePeticion);
        respuesta.writeHead(200, {'Content-Type': 'application/json'});
        respuesta.write(JSON.stringify(baseDeDatos)); //es un objeto JSON, se convierte a string
        respuesta.end();
    } catch (error) {
        respuesta.writeHead(200, {'Content-Type': 'text/plain'});
        respuesta.write('Datos inválidos'); //es un objeto JSON, se convierte a string
        respuesta.end();
    }
}

//necesitaremos el id de la tarea que queremos actualizar y los nuevos datos
async function actualizarTarea(requisicion, respuesta){
    try {
        let {url} = requisicion;
    
    let idQuery = url.split("?")[1]; //id=2//divide laurl a partir del signo de interrogación y lo guardamos en un id, ejemplo /task?id=2 el indice 0 es task y el 1 es id=2
    let idKey = idQuery.split("=")[0]; //GUARDA LA LLAVE QUE ES ID
    let idValue = idQuery.split("=")[1]; //Guarda el valor que es el valor del id
    if(idKey === "id"){
        await bodyParser(requisicion);
        baseDeDatos[idValue - 1] = requisicion.cuerpoDePeticion;
        respuesta.writeHead(200, {'Content-Type': 'application/json'});
        respuesta.write(JSON.stringify(baseDeDatos)); //es un objeto JSON, se convierte a string //responde el estado actual de la base de datos
        respuesta.end();
    } else{
        respuesta.writeHead(200, {'Content-Type': 'text/plain'});
        respuesta.write('Respuesta invalida'); //es un objeto JSON, se convierte a string
        respuesta.end();
    }
    } catch (error) {
        respuesta.writeHead(400, {'Content-Type': 'text/plain'});
        respuesta.write('Datos invalidos was provided', error.message); //es un objeto JSON, se convierte a string
        respuesta.end();
    }
    
}

async function eliminarTarea(requisicion, respuesta){
    let { url } = requisicion; 

    let idQuery = url.split("?")[1]; //id=2//divide laurl a partir del signo de interrogación y lo guardamos en un id, ejemplo /task?id=2 el indice 0 es task y el 1 es id=2
    let idKey = idQuery.split("=")[0]; //GUARDA LA LLAVE QUE ES ID
    let idValue = idQuery.split("=")[1]; //Guarda el valor que es el valor del id

    if(idKey === 'id'){
        baseDeDatos.splice(idValue - 1, 1);  //se le resta uno para que coincida con el índice del elemento y el 1 es cuántos elementos voy a quitar
        respuesta.writeHead(200, {'Content-Type': 'text/plain'});
        respuesta.write('Eliminación exitosa'); //es un objeto JSON, se convierte a string //responde el estado actual de la base de datos
        respuesta.end();
    }else{
        respuesta.writeHead(400, {'Content-Type': 'text/plain'});
        respuesta.write('Petición inválida'); //es un objeto JSON, se convierte a string //responde el estado actual de la base de datos
        respuesta.end();
    }
}

const servidor = http.createServer((requisicion, respuesta) => {
    const {url, method} = requisicion;
    console.log(`URL: ${url} - METHOD: ${method}`);
    

    switch(method){
        case "GET" : 
            if(url === "/"){
                //cabecera 
                respuesta.writeHead(200, {'Content-Type': 'application/json'});
                respuesta.write(JSON.stringify({message: 'Hello world'})); //es un objeto JSON, se convierte a string
                respuesta.end();
            }
            if(url === "/tareas"){
                obtenerTareas(requisicion, respuesta)
            }
            break;
        case "POST" :
            if(url === "/task"){
                crearTareas(requisicion, respuesta);
            }
            break;
        case "PUT" :
            actualizarTarea(requisicion, respuesta);
            break;
        case "DELETE" :
            eliminarTarea(requisicion, respuesta);
            break;
        default:
            respuesta.writeHead(200, {'Content-Type': 'text/plain'});
            respuesta.write('404 No encontrado'); //es un objeto JSON, se convierte a string //responde el estado actual de la base de datos
            respuesta.end();
    }
})

servidor.listen(3000);
console.log('Server on port', 3000);
