const { launchShellCommand } = require('./scriptLauncher');

function createNewResource(resource, fields) {
    launchShellCommand(`./scripts/newResource.sh ${resource} ${fields}`)
}

module.exports = { createNewResource }