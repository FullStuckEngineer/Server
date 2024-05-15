const errorHandler = (err, req, res, next) => {
    let errorMessage = "";
    console.log(err)
    switch (err.name) {
        case "Unauthorized":
            errorMessage = "Unauthorized";
            res.status(404).json({ name: err.name, message: errorMessage });
            break;
        case "ErrorNotFound":
            errorMessage = "Error Not Found";
            res.status(404).json({ name: err.name, message: errorMessage });
            break;
        case "InvalidEmailOrPassword":
            errorMessage = "Invalid Email or Password";
            res.status(404).json({ message: errorMessage });
            break;
        case "EmailAlreadyTaken":
            errorMessage = "Email Already Taken, Try Another";
            res.status(404).json({ message: errorMessage });
            break;
        case "NameAlreadyTaken":
            errorMessage = "Name Already Taken, Try Another";
            res.status(404).json({ message: errorMessage });
            break;
        case "PasswordTooShort":
            errorMessage = "Password Must Contain At least 6 Character";
            res.status(404).json({ message: errorMessage });
            break;
        case "PleaseFillAllRequirement":
            errorMessage = "Please Fill All Requirement";
            res.status(404).json({ message: errorMessage });
            break;
        case "NotPermitted":
            errorMessage = "You Are Not Permitted to Delete This Shopping Item";
            res.status(404).json({ message: errorMessage });
            break;
        case "StoreLimitReached":
            errorMessage = "Maximum Store Limit Reached";
            res.status(404).json({ message: errorMessage });
            break;
        case "InvalidCourier":
            errorMessage = "Courier Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "InvalidCredentials":
            errorMessage = "WRONG EMAIL OR PASSWORD";
            res.status(404).json({ message: errorMessage });
            break;
        case "CourierNotFound":
            errorMessage = "Invalid ID";
            res.status(404).json({ message: errorMessage });
            break;
        default:
            errorMessage = "Internal Server Error";
            console.log(err)
            res.status(500).json({ message: errorMessage });
            break;
    }
}

module.exports = errorHandler;
