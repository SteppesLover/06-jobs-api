const express = require('express')
const router = express.Router()

const {getAllCountries, getCountry, createCountry, updateCountry, deleteCountry} = require ('../controllers/countries')

router.route('/').post(createCountry).get(getAllCountries)
router.route('/:id').get(getCountry).delete(deleteCountry).patch(updateCountry)

module.exports = router