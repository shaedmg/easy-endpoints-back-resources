const { launchShellCommand } = require('./scriptLauncher');
const { generateDoc, prepareForDoc } = require('./../services/utils/')
const { prepareModel, modifyModel, deleteResource} = require('../services/utils')


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
        resolve();
    })
}

function updateResourceModel(resource, fields, params) {
    return new Promise ((resolve, reject) => {
        /*console.log("hola")
        //launchShellCommand(`pwd`)
        launchShellCommand(`./src/yeoman/scripts/updateResource.sh ${resource} ${fields}`)
        .then(() => prepareModel(`/Users/joframontesdeocanuez/apii/src/api/${resource}/model.js`, resource)
            .then(()=> modifyModel(`/Users/joframontesdeocanuez/apii/src/api/${resource}/model.js`, resource, params)
                .then(() => restartAPI())
            )
        )
        resolve();*/
        deleteResource(resource).then(()=>createNewResource(resource, fields, params).
        then(() => resolve()))
        

    });
}

module.exports = { initProject, startAPI, restartAPI, createNewResource, updateResourceModel }