const { launchShellCommand } = require('./scriptLauncher');
const { generateDoc, prepareForDoc } = require('./../services/utils/')
const { prepareModel, modifyModel} = require('../services/utils')


async function initProject() {
    await launchShellCommand(`mkdir -p /Users/joframontesdeocanuez/apii`)
    await launchShellCommand(`./src/yeoman/scripts/initProject.sh`)
    await launchShellCommand(`cd /Users/joframontesdeocanuez/apii && npm run docs && npm i express-static`)
    await prepareForDoc();
    await startAPI();
}

async function startAPI() {
    await launchShellCommand(`nodemon /Users/joframontesdeocanuez/apii`)
}

function restartAPI() {
    launchShellCommand(`pkill -9 ClientAPIServer`).then(()=>{
        launchShellCommand(`node /Users/joframontesdeocanuez/apii`)
    }) 
}

function createNewResource(resource, fields, params) {
    return new Promise ((resolve, reject) => {
        launchShellCommand(`./src/yeoman/scripts/newResource.sh ${resource} ${fields}`).then(()=>{
            generateDoc().then(res=> {
                prepareModel(`/Users/joframontesdeocanuez/apii/src/api/${resource}/model.js`, resource)
                .then(() => modifyModel(`/Users/joframontesdeocanuez/apii/src/api/${resource}/model.js`, resource, params)
                .then(()=> restartAPI()))
            });
        }) 
    })
}

async function updateResourceModel(resource, fields) {
    await launchShellCommand(`./src/yeoman/scripts/updateResource.sh ${resource} ${fields}`)
}

module.exports = { initProject, startAPI, restartAPI, createNewResource, updateResourceModel }