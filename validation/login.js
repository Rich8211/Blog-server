const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validatorLoginInput = data => {

    let errors = {};

    let {email, password} = data;

    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';

    if (Validator.isEmpty(email)) {
        errors.email = "Email is required";

    } else if (!Validator.isEmpty(email)) {
        errors.email = "Please enter a valid email."
    } 

    if (Validator.isEmpty(password)) {
        errors.password = "Password is required";
         
    } else if (!Validator.isLength(password, {min: 6, max: 30})) {
        errors.password = "Password must be between 6 and 30 characters long"
    }

    return  {
        errors,
        isValid: isEmpty(errors)
    };
};