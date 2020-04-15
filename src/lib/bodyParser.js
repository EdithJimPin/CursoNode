
//Esta funcion recibe en sus parámetros lo que el cliente manda (datos), si coniene datos los vamos a escuchar con .on y los guardaremos en una variable.
//esta var lo convertiremos en JSON y lo vamos a guardar en una propiedad body(cuerpoDePeticion)
function bodyParser(requisicion){ //para evitar pasar un callback vamos a usar promesas 
    return new Promise((resolve, reject) => { //dependiendo de lo que pase es donde va a terminar
        let datosTotales = '';
        requisicion
            .on('data', chunk => {
                datosTotales += chunk;
            })
            .on('end', () => {
                requisicion.cuerpoDePeticion = JSON.parse(datosTotales); //el string que el cliente envia lo convierte a JSON
                resolve();
            })
            .on('error', err => {
                console.log(err);
                reject();
            })
    })
}
module.exports = { bodyParser }