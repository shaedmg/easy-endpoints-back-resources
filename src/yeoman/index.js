const { launchShellCommand } = require('./scriptLauncher');
const { generateDoc, prepareForDoc } = require('./../services/utils/')

async function initProject() {
    await launchShellCommand(`mkdir -p /Users/joframontesdeocanuez/apii`)
    await launchShellCommand(`./src/yeoman/scripts/initProject.sh`)
    await launchShellCommand(`cd /Users/joframontesdeocanuez/apii && npm run docs && npm i express-static`)
    await prepareForDoc()
    
}

async function startAPI() {
    await launchShellCommand(`nodemon /Users/joframontesdeocanuez/apii`)
}

function restartAPI() {
    launchShellCommand(`pkill -9 ClientAPIServer`).then(()=>{
        launchShellCommand(`node /Users/joframontesdeocanuez/apii`)
    }) 
}

function createNewResource(resource, fields) {
    launchShellCommand(`./src/yeoman/scripts/newResource.sh ${resource} ${fields}`).then(()=>{
        generateDoc().then(res=> restartAPI());
    })
    
}

module.exports = { initProject, startAPI, restartAPI, createNewResource }