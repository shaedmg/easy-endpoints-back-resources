const { promisify } = require('../../services/router')
const { getAllResources, getOneResource, postResource, updateResource, removeResource } = require('../resources.controller')

const { initProject, startAPI } = require('../../yeoman')

module.exports.test = promisify(async (req, res) => {
    initProject();
    res.send(200)
})
module.exports.test.verb = 'get'
module.exports.test.path = '/newProject'

module.exports.test1 = promisify(async (req, res) => {
    startAPI();
    res.send(200);
})
module.exports.test1.verb = 'get'
module.exports.test1.path = '/startAPI'

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