// Imports
const express = require('express');
const productsCtrl = require("./routes/productsCtrl");

// Router
exports.router = (function() {
    var apiRouter = express.Router();

    apiRouter.route("/products/get").get(productsCtrl.get);
    apiRouter.route("/products/create").get(productsCtrl.create);
    apiRouter.route("/products/remove").get(productsCtrl.remove);
    apiRouter.route("/products/modify").get(productsCtrl.modify);

    return apiRouter;
})();