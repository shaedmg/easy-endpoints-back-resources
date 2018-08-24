const { launchShellCommand } = require('./../../yeoman/scriptLauncher');
const fs = require('fs')
async function generateDoc() {
    return new Promise((resolve, reject) => {
        launchShellCommand(`cd /Users/joframontesdeocanuez/apii && npm run docs`)
        .then(res => {
            resolve();
        })
    })
}

function prepareForDoc() {
    return new Promise((resolve,reject) => {
        const data = fs.readFileSync('/Users/joframontesdeocanuez/apii/src/app.js', 'utf8', function (err, data) {
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
app.use('/docs', serve('/Users/joframontesdeocanuez/apii/docs'))
    
const server = http`)
    
        datosParaEscribir.push(datosPartidos[1])
        fs.writeFileSync('/Users/joframontesdeocanuez/apii/src/app.js', datosParaEscribir.join(''), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("El archivo fue creado correctamente");
        });
        resolve();
    })
}

module.exports = { generateDoc , prepareForDoc}