
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.name)
  console.log(err.code)
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.name ==='ValidationError'){
    console.log(Object.values(err.errors))
    customError.msg = Object.values(err.errors).map((item)=>{
      return item.message
    }).join(',')
    customError.statusCode = 400
  }

  if(err.name === 'CastError'){
    console.log(err)
    customError.msg = `jobId #${err.value} does not exist`
    customError.statusCode= 404
    return res.json({err})
  }

  if(err.code && err.code === 11000 ){
    console.log(err)
    customError.msg = `Duplicate value enter for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg:customError.msg})

}

module.exports = errorHandlerMiddleware
