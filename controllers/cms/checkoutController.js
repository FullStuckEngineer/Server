const checkoutService = require('../../services/checkoutService')

const perPage = 10;

const findAll = async (req, res, next) => {
    try {
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            role: 'Admin',
            searchTerms: req.query.searchTerms,
            userId: req.query.userId,
            courierId: req.query.courierId,
            paymentMethod: req.query.paymentMethod,
            status: req.query.status,
            sortBy: req.query.sortBy
        }

        const findAll = await checkoutService.findAll(params);
        res.status(200).json({message: "Success Get All Checkout", data: findAll})
    }
    catch (error) {
        next(error);
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = {id: req.params.id, loggedUser: req.loggedUser.id, role: "admin"};

        const findOne = await checkoutService.findOne(params);
        res.status(200).json({message: "Success Get A Checkout", data: findOne})
    } catch (error) {
        next(error);
    }
} 

const create = async (req, res, next) => {
    try {
        const obj = { user_id: req.loggedUser.id, body: req.body }
        const createCheckout = await checkoutService.create(obj)
        res.status(200).json({message: "Success Create Checkout", data: createCheckout})
    } catch (error) {
        next (error)
    }
} 

const update = async (req, res, next) => {
    try {
        const params = {id: req.params.id, status: req.body.status, role: "admin", loggedUser: req.loggedUser.id};

        const update = await checkoutService.update(params);
        res.status(200).json({message: "Success Update Checkout", data: update})
    } catch (error) {
        next(error);
    }
} 

const sendEmailNotification = async (req, res, next) => {
    try {
        const { to, subject, html } = req.body;
        await checkoutService.sendEmail({ to, subject, html });
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { findAll, findOne, create, update, sendEmailNotification };