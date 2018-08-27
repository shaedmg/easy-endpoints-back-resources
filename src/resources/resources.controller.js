const resources = require('./resources.model');
const { createNewResource, updateResourceModel , restartAPI} = require('../yeoman');
const { deleteResource } = require('./../services/utils')

function getFieldsInCommas(params){
    return params.reduce(function (palabraAnterior, palabraActual, index) {
        if (index === 0) {
            return palabraActual.name;
        } else {
            return palabraAnterior + "," + palabraActual.name;
        }
    }, {});
}

function getAllResources(req, res) {
    resources.find()
        .then(response => {
            return res.json(response);
        })
        .catch(response => {
            return res.status(400).send('Resources not found')
        })
}

function getOneResource(req, res) {
    resources.findOne({ name: req.params.name })
        .then(response => {
            if (response) {
                res.json(response)
            } else {
                res.status(400).send("There's no resource with name=" + req.params.name)
            }
        })
}

function postResource(req, res) {
    resources.findOne({ name: req.body.name }, (err, doc) => {
        if (doc) {
            return res.status(400).send("There’s already a resource with the name=" + req.body.name);
        } else {
            const newResource = new resources(req.body);
            if (req.body.params) {

                newResource.save()
                    .then(response => {
                        const fields = getFieldsInCommas(req.body.params)
                        const resource = req.body.name;
                        createNewResource(resource, fields, req.body.params);
                        return res.send("Resource was created succesfully")
                    })
                    .catch(response => {
                        const objErrors = Object.keys(response.errors)
                        let errores = [];
                        for (let i = 0; i < objErrors.length; i++) {
                            console.log(objErrors[i]);
                            switch (objErrors[i]) {
                                case "params":
                                    errores.push("Introduzca los params");
                                    break;
                                case "name":
                                    if (response.errors.name.kind === "unique") {
                                        errores.push("El nombre del recurso ya está en uso.");
                                    } else {
                                        errores.push("Introduzca un nombre del recurso.");
                                    }
                                    break;
                                case "params.0.name":
                                    errores.push("Falta el name de un campo")
                                    break;
                                case "params.0.model":
                                    errores.push("Falta especificar el type de un campo")
                                    break;
                            }
                        }
                        return res.status(400).send(errores);
                    })
            } else {
                res.status(400).send("Introduce los parámetros")
            }
        }
    })

}

function updateResource(req, res) {
    resources.findOne({ name: req.params.name }, (err, doc) => {
        if (doc) {
            doc.name = req.body.name;
            doc.params = req.body.params;
            if (req.body.params) {
                doc.save()
                    .then(response => {
                        const fields = getFieldsInCommas(req.body.params)
                        updateResourceModel(doc.name, fields, req.body.params).then((response)=> res.json(response))
                    })
                    .catch(response => {
                        const objErrors = Object.keys(response.errors)
                        let errores = [];
                        console.log(objErrors);
                        for (let i = 0; i < objErrors.length; i++) {
                            switch (objErrors[i]) {
                                case "name":
                                    if (response.errors.name.kind === "unique") {
                                        errores.push("El nombre del recurso ya está en uso.");
                                    } else {
                                        errores.push("Introduzca un nombre del recurso.");
                                    }
                                    break;
                                case "model":
                                    errores.push("Introduzca un model");
                                    break;
                                case "params.0.name":
                                    errores.push("Falta el name de un campo")
                                    break;
                                case "params.0.model":
                                    errores.push("Falta especificar el type de un campo")
                                    break;
                            }
                        }
                        return res.status(400).send(errores);
                    })
            } else {
                return res.status(400).send("Introduce los parametros.")
            }
        } else {
            return res.status(400).send("There’s no resource with the name=" + req.params.name);
        }
    })
}

function removeResource(req, res) {
    const name = req.params.name
    resources.findOne({ name: req.params.name }, (err, doc) => {
        if (doc) {
            doc.remove();
            deleteResource(name).then(()=>restartAPI())
            return res.json(doc);
        } else {
            return res.status(400).send("There’s no resource with name=" + req.params.name);
        }
    })
}

module.exports = { getAllResources, getOneResource, postResource, updateResource, removeResource }