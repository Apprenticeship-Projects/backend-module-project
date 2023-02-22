import Role from "../constants/roles.json" assert { type: "json" };
import User from "../models/User.model";

// Specify required permission level for a route, set to User level (0) as default.
export function permissionLevel(requiredPermissionLevel=Role.USER){
    // Function to check permission level.
    return async function checkPermissionLevel(req, res, next){
        // Extract the User from the request (attached to req by token verification middleware).
        const foundUser = req.user;
        
        if(foundUser){
            // If the permission level is OK, go to next function.
            if(foundUser.role >= requiredPermissionLevel){
                next();
            }else{
                // Else, send 401 status (Unauthorised).
                res.sendStatus(401);
            }
        }else{
            // User not found.
            res.sendStatus(404);
        }
    }
}


