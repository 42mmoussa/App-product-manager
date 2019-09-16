// imports
var productsData = require("../Products.json");

module.exports = {
	// Send all products
	get: function(req, res) {
		return res.status(200).send(productsData);
	},
	// Create a product
	create: function(req, res) {
		// Get all elements
		let id = productsData[productsData.length - 1]._id + 1;
		let name = req.query.name;
		let type = req.query.type;
		let price = req.query.price;
		let rating = req.query.rating;
		let warranty_years = req.query.warranty_years;
		let available = req.query.available;
		let newItem = {
			_id: id,
			name: name,
			type: type,
			price: price,
			rating: rating,
			warranty_years: warranty_years,
			available: available
		}
		// If one parameter is not specified: return error 400
		if (name == null || type == null || price == null || rating == null || warranty_years == null || available == null) {
			return res.status(400).json({"error": "missing parameters"});
		} else if (name == "" || type == "" || price == "" || rating == "" || warranty_years == "" || available == "") {
			return res.status(400).json({"error": "missing parameters"});
		}
		productsData.push(newItem);
		return res.status(200).json({"success": "creation finished"});
	},
	// Remove a product
	remove: function(req, res) {
		// Get element id to delete
		let idToRemove = req.query.id;
		// If one parameter is not specified: return error 400
		if (idToRemove == null || idToRemove == "undefined") {
			return res.status(400).json({"error": "missing parameters"});
		}
		// Delete element from the array
		productsData = productsData.filter(product => product._id != idToRemove);
		return res.status(200).json({"success": "remove finished"});
	},
	// Modify a product
	modify: function(req, res) {
		// Get all elements
		let id = req.query.id;
		let name = req.query.name;
		let type = req.query.type;
		let price = req.query.price;
		let rating = req.query.rating;
		let warranty_years = req.query.warranty_years;
		let available = req.query.available;
		let newItem = {
			_id: id,
			name: name,
			type: type,
			price: price,
			rating: rating,
			warranty_years: warranty_years,
			available: available
		}
		// If one parameter is not specified: return error 400
		if (id == null || name == null || type == null || price == null || rating == null || warranty_years == null || available == null) {
			return res.status(400).json({"error": "missing parameters"});
		} else if (id == "" || name == "" || type == "" || price == "" || rating == "" || warranty_years == "" || available == "") {
			return res.status(400).json({"error": "missing parameters"});
		}
		// modify value of the product
		productsData.forEach(function(product) {
			if (product._id == id) {
				productsData[productsData.indexOf(product)] = newItem;
			}
		});
		return res.status(200).json({"success": "modification finished"});
	}
}