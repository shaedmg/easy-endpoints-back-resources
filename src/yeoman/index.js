const { launchShellCommand } = require('./scriptLauncher');
const { generateDoc, prepareForDoc, prepareMongo } = require('./../services/utils/')
const { prepareModel, modifyModel, deleteResource} = require('../services/utils')


async function initProject() {
    await launchShellCommand(`mkdir -p ${ROUTE}`)
    await launchShellCommand(`./src/yeoman/scripts/initProject.sh ${ROUTE}`)
    await launchShellCommand(`cd ${ROUTE} && npm run docs && npm i express-static`)
    await prepareForDoc();
    await prepareMongo();
    await startAPI();
}

async function startAPI() {
    await launchShellCommand(`nodemon ${ROUTE}`)
}

function restartAPI() {
    launchShellCommand(`pkill -9 ClientAPIServer`).then(()=>{
        launchShellCommand(`node ${ROUTE}`)
    }) 
}

function createNewResource(resource, fields, params) {
    return new Promise ((resolve, reject) => {
        launchShellCommand(`./src/yeoman/scripts/newResource.sh ${resource} ${fields} ${ROUTE}`).then(()=>{
            generateDoc().then(res=> {
                prepareModel(`${ROUTE}/src/api/${resource}/model.js`, resource)
                .then(() => modifyModel(`${ROUTE}/src/api/${resource}/model.js`, resource, params)
                .then(()=> restartAPI()))
            });
        }) 
        resolve();
    })
}

function updateResourceModel(resource, fields, params) {
    return new Promise ((resolve, reject) => {
        deleteResource(resource).then(()=>createNewResource(resource, fields, params).
        then(() => resolve()))
    });
}

module.exports = { initProject, startAPI, restartAPI, createNewResource, updateResourceModel }