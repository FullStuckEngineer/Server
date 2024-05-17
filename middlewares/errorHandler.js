const errorHandler = (err, req, res, next) => {
    let errorMessage = "";
    console.log(err)
    switch (err.name) {
        // Base Error
        case "ErrorNotFound":
            errorMessage = "Error Not Found";
            res.status(404).json({ name: err.name, message: errorMessage });
            break;
        // login and register Error
        case "Unauthorized":
            errorMessage = "Unauthorized";
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
        case "InvalidCredentials":
            errorMessage = "WRONG EMAIL OR PASSWORD";
            res.status(404).json({ message: errorMessage });
            break;
        // Cart Error
        case "CartNotFound":
            errorMessage = "Cart ID Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        // User Error
        case "UserNotFound":
            errorMessage = "User Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedUpdateUser":
            errorMessage = "Failed To Update User";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToDeleteUser":
            errorMessage = "Failed To Delete User";
            res.status(404).json({ message: errorMessage });
            break;
        // Store Error    
        case "StoreLimitReached":
            errorMessage = "Maximum Store Limit Reached";
            res.status(404).json({ message: errorMessage });
            break;
        case "StoreNotFound":
            errorMessage = "Store Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToDeleteStore":
            errorMessage = "Failed To Delete Store";
            res.status(404).json({ message: errorMessage });
            break;
        // Product Error    
        case "ProductNotFound":
            errorMessage = "Product Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToCreateProduct":
            errorMessage = "Failed to Create Product";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToCreateProductImage":
            errorMessage = "Failed to Create Product Image";
            res.status(404).json({ message: errorMessage });
            break;
        case "FieldCannotBeNegative":
            errorMessage = "Stock, price, and weight cannot be negative";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToUpdateProduct":
            errorMessage = "Failed to Update Product";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToDeleteProduct":
            errorMessage = "Failed to Delete Product";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToDeleteShoppingItems":
            errorMessage = "Failed to Delete Shopping Items";
            res.status(404).json({ message: errorMessage });
            break;
        case "FailedToDeleteImage":
            errorMessage = "Failed to Delete Image";
            res.status(404).json({ message: errorMessage });
            break;
        // Courier Error    
        case "InvalidCourier":
            errorMessage = "Courier Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "CourierNotFound":
            errorMessage = "Invalid ID";
            res.status(404).json({ message: errorMessage });
            break;
        // Category Error    
        case "CategoriesNotFound":
            errorMessage = "Categories Not Found Or Inactive";
            res.status(404).json({ message: errorMessage });
            break;
        case "CreatedCategoryFailed":
            errorMessage = "Failed to Create Category";
            res.status(404).json({ message: errorMessage });
            break;
        case "UpdateCategoryFailed":
            errorMessage = "Failed to Update Category";
            res.status(404).json({ message: errorMessage });
            break;
        case "DeleteCategoryFailed":
            errorMessage = "Failed to Delete Soft Category";
            res.status(404).json({ message: errorMessage });
            break;
        // City Error
        case "CityNotFound":
            errorMessage = "City Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        // Shopping Item Error
        case "ShoppingItemNotFound":
            errorMessage = "Shopping Item Not Found";
            res.status(404).json({ message: errorMessage });
            break;
        case "InvalidStatus":
            errorMessage = "Invalid Status";
            res.status(404).json({ message: errorMessage });
            break;
        case "StockNotEnough":
            errorMessage = "Product Stock is Not Enough";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorFetchingShippingCost":
            errorMessage = "Failed to Fetching Shipping Cost";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorCreate":
            errorMessage = "Failed to Create";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorFetch":
            errorMessage = "Failed to Fetch Data";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorUpdate":
            errorMessage = "Failed to Update Data";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorDelete":
            errorMessage = "Failed to Delete Data";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorRequired":
            errorMessage = "Required Field Cannot Be Empty";
            res.status(404).json({ message: errorMessage });
            break;
        case "PriceMismatch":
            errorMessage = "Product Price Mismatch";
            res.status(404).json({ message: errorMessage });
            break;
        case "MustPositive":
            errorMessage = "Field Must Be Positive Number";
            res.status(404).json({ message: errorMessage });
            break;
        case "ErrorUpload":
            errorMessage = "Failed to Upload";
            res.status(404).json({ message: errorMessage });
            break;
        // Default Error    
        default:
            errorMessage = "Internal Server Error";
            console.log(err)
            res.status(500).json({ message: errorMessage });
            break;
    }
}

module.exports = errorHandler;
