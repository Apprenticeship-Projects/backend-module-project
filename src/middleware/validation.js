import {validationResult} from 'express-validator';


//Function checks if validation has passed
function checkErrors(req, res, next){
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()});
    }
    else next();
}

export {checkErrors};