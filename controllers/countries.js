const Country = require('../models/Country')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllCountries = async (req, res) => {
    const countries = await Country.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({countries, count: countries.length})
}

const getCountry = async (req, res) => {
    const {user:{userId}, params: {id:countryId}} = req
    const country = await Country.findOne({
        _id:countryId, createdBy: userId
    })
    if(!country){
        throw new NotFoundError(`No country with id ${countryId}`)
    }
    res.status(StatusCodes.OK).json({country})
}

const createCountry = async (req, res) => {
    req.body.createdBy = req.user.userId
    const country = await Country.create(req.body)
    res.status(StatusCodes.CREATED).json({country})
}

const updateCountry = async (req, res) => {
    const {body: {name, province, governmentType}, user:{userId}, params: {id:countryId}} = req
    if (name=== '' || province === '' || governmentType===''){
        throw new BadRequestError('name, province or governmentType fields cannot be empty')
    }
    const country = await Country.findByIdAndUpdate({_id:countryId, createdBy:userId}, req.body, {new:true, runValidators:true})
    if(!country){
        throw new NotFoundError(`No country with id ${countryId}`)
    }
    res.status(StatusCodes.OK).json({country})
}

const deleteCountry = async (req, res) => {
    const { user:{userId}, params: {id:countryId}} = req
    const country = await Country.findByIdAndRemove({
        _id: countryId,
        createdBy: userId
    })

    if(!country){
        throw new NotFoundError(`No country with id ${countryId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllCountries,
    getCountry,
    updateCountry,
    deleteCountry,
    createCountry,
}