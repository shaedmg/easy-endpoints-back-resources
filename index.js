require('./src/app')()

const config = require('./src/.env')
const options = config['development'];
global.ROUTE = options.ROUTE;

console.log(ROUTE)