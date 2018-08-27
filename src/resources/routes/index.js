const { promisify } = require('../../services/router')
const { getAllResources, getOneResource, postResource, updateResource, removeResource } = require('../resources.controller')
const { launchShellCommand } = require('./../../yeoman/scriptLauncher')

const { initProject, startAPI } = require('../../yeoman')

module.exports.test = promisify(async (req, res) => {
    initProject();
    setTimeout(()=>res.send(200),10000)
    //res.send(200)
})
module.exports.test.verb = 'get'
module.exports.test.path = '/newProject'

module.exports.test1 = promisify(async (req, res) => {
    startAPI();
    res.send(200);
})
module.exports.test1.verb = 'get'
module.exports.test1.path = '/startAPI'

module.exports.test2 = promisify(async (req, res) => {
    launchShellCommand(`tar -zcvf api.tar.gz ${ROUTE} 2> /dev/null`)
    .then((response) => res.download(__dirname+'/../../../api.tar.gz', 'api.tar.gz'))
})
module.exports.test2.verb = 'get'
module.exports.test2.path = '/downloadAPI'

module.exports.getAll = promisify(async (req, res) => {
    return getAllResources(req, res)
})
module.exports.getAll.verb = 'get'
module.exports.getAll.path = '/'

module.exports.getOne = promisify(async (req, res) => {
    return getOneResource(req, res)
})
module.exports.getOne.verb = 'get'
module.exports.getOne.path = '/:name'

module.exports.postResource = promisify(async (req, res) => {
    return postResource(req, res)
})
module.exports.postResource.verb = 'post'
module.exports.postResource.path = '/'

module.exports.updateResource = promisify(async (req, res) => {
    return updateResource(req, res)
})
module.exports.updateResource.verb = 'put'
module.exports.updateResource.path = '/:name'

module.exports.removeResource = promisify(async (req, res) => {
    return removeResource(req, res)
})
module.exports.removeResource.verb = 'delete'
module.exports.removeResource.path = '/:name'