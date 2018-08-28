const { launchShellCommand } = require('./../../yeoman/scriptLauncher');
const fs = require('fs')

function prepareMongo() {
    return new Promise((resolve, reject) => {
        const data = `
/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    masterKey: requireProcessEnv('MASTER_KEY'),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: { },
  development: {
    mongo: {
      uri: 'mongodb://mongodb/apii-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://mongodb/apii'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports`;
        fs.writeFileSync(`${ROUTE}/src/config.js`, data, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("El archivo fue creado correctamente");
        });
        resolve();
    })
}

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
app.use('/docs', serve('${ROUTE}/docs'))
    
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
module.exports = { generateDoc , prepareForDoc, prepareModel, modifyModel, deleteResource, prepareMongo}