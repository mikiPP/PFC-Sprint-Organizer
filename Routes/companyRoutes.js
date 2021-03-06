const express = require('express');

const companyController = require('../Controllers/companyController');

const router = express.Router();

router.get('/:companyId', companyController.getCompanyById);

router.post('/', companyController.addCompany);

router.put('/:companyId', companyController.updateCompany);

router.delete('/:companyId', companyController.deleteCompany);

module.exports = router;
