const Country = require('../models/Country')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllCountries = async (req, res) => {
    const countries = await Country.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({countries, count: countries.length})
}

const getCountry = async (req, res) => {
    res.send('get country')
}

const createCountry = async (req, res) => {
    req.body.createdBy = req.user.userId
    const country = await Country.create(req.body)
    res.status(StatusCodes.CREATED).json({country})
}

const updateCountry = async (req, res) => {
    res.send('update country')
}

const deleteCountry = async (req, res) => {
    res.send('delete country')
}

module.exports = {
    getAllCountries,
    getCountry,
    updateCountry,
    deleteCountry,
    createCountry,
}