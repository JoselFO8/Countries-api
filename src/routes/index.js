const { Router } = require('express');
// Importar todos los routers;
const country = require('./country.js')
const touristActivity = require('./touristActivity.js')

const router = Router();

// Configurar los routers
router.use('/', country);
router.use('/', touristActivity);

module.exports = router;
