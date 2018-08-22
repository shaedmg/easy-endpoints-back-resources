const { launchShellCommand } = require('./scriptLauncher');

async function initProject() {
    await launchShellCommand(`mkdir -p /Users/joframontesdeocanuez/apii`)
    await launchShellCommand(`./src/yeoman/scripts/initProject.sh`)
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
        restartAPI();
    })
    
}

module.exports = { initProject, startAPI, restartAPI, createNewResource }