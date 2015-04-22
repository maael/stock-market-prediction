var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');
/**
 * Mongo schema for User model
 * @class userSchema
 */
var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	linkedin: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});
/**
 * Generate a salted hash of a string using bcrypt
 * @function generateHash
 * @memberof module:models~userSchema
 * @this userSchema
 * @param {string} password - password to hash
 * @returns {string} salted hash of password
 * @see {@link https://www.npmjs.com/package/bcrypt-nodejs}
 */
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
/**
 * @function validPassword
 * @memberof module:models~userSchema
 * @this userSchema
 * @param {string} password - password to hash
 * @returns {boolean} whether the password is valid against the local password
 * @see {@link https://www.npmjs.com/package/bcrypt-nodejs}
 */
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};
/**
 * @module User
 */
module.exports = mongoose.model('User', userSchema);