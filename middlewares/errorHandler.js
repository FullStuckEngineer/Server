const errorHandler = (err, req, res, next) => {
    console.log(err)
    if(err.name === "InvalidCourier"){
        res.status(404).json({message: "Courier Not Found"})
    }else if(err.name === "InvalidCredentials" ){
        res.status(500).json({ message: "WRONG EMAIL OR PASSWORD"})
    }else if(err.name === "CourierNotFound"){
        res.status(404).json({message: "Invalid ID"})
    }

    else{
    res.status(500).json({ message: "Internal Server Error"})
    }
}

module.exports = errorHandler
