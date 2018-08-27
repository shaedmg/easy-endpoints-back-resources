const { launchShellCommand } = require('./../../yeoman/scriptLauncher');
const fs = require('fs')
async function generateDoc() {
    return new Promise((resolve, reject) => {
        launchShellCommand(`cd ${ROUTE} && npm run docs`)
        .then(res => {
            resolve();
        })
    })
}

function prepareForDoc() {
    return new Promise((resolve,reject) => {
        const data = fs.readFileSync(`${ROUTE}/src/app.js`, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            return data;
        });
    
        const datosPartidos = data.split(`const server = http`);
        const datosParaEscribir = [];
    
        datosParaEscribir.push(datosPartidos[0]);
        datosParaEscribir.push(`
process.title = "ClientAPIServer";
const serve = require('express-static')
app.get('/docs', (req,res)=>res.redirect('/docs/index.html'))
app.use('/docs', serve(${ROUTE}/docs'))
    
const server = http`)
    
        datosParaEscribir.push(datosPartidos[1])
        fs.writeFileSync(`${ROUTE}/src/app.js`, datosParaEscribir.join(''), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("El archivo fue creado correctamente");
        });
        resolve();
    })
}

function prepareModel(file, resource) {
    return new Promise ((resolve, reject) => {
        const data = fs.readFileSync(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            return data;
        });
    
        const datosPartidos = data.split(`${resource}Schema.methods`);
        const datosParaEscribir = [];
    
        datosParaEscribir.push(datosPartidos[0]);
        datosParaEscribir.push(`
/* ### PARAMS ### */
    
/* ### PARAMS ### */
        
${resource}Schema.methods`)
    
        datosParaEscribir.push(datosPartidos[1])
        fs.writeFileSync(file, datosParaEscribir.join(''), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("El archivo fue creado correctamente");
        });

        resolve();

    })
}

function modifyModel(file,resource,params) {
    return new Promise ((resolve, reject) => {
        const data = fs.readFileSync(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            
            return data
        });
        
        const datosPartidos = data.split(`/* ### PARAMS ### */`)
        const datosPaEscribir = [];
    
        datosPaEscribir.push(datosPartidos[0]);
        datosPaEscribir.push(`/* ### PARAMS ### */\n`)
        params.forEach((item) => datosPaEscribir.push(`${resource}Schema.add(${item.model})\n`))
        datosPaEscribir.push(`/* ### PARAMS ### */`)
        datosPaEscribir.push(datosPartidos[2]);
        
        fs.writeFileSync(file, datosPaEscribir.join(''), function (err) {
            if (err) {
                return console.log(err);
            }
        
            console.log("El archivo fue creado correctamente");
        });
        console.log("prepare")
        resolve()
    })
}

function deleteResource(resource) {
    return new Promise((resolve, reject) => {
        launchShellCommand(`rm -Rf ${ROUTE}/src/api/${resource}`)
        const data = fs.readFileSync(`${ROUTE}/src/api/index.js`, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            return data
        });
        let datosPartidos = data.split(`import ${resource} from './${resource}'`)
        let datosPaEscribir = datosPartidos.join('');
        datosPartidos = datosPaEscribir.split(`router.use('/${resource}', ${resource})`)
        datosPaEscribir = datosPartidos.join('');

        fs.writeFileSync(`${ROUTE}/src/api/index.js`, datosPaEscribir, function (err) {
            if (err) {
                return console.log(err);
            }
        
            console.log("El archivo fue creado correctamente");
        });
        resolve();
    })

}
module.exports = { generateDoc , prepareForDoc, prepareModel, modifyModel, deleteResource}