const userController = require('../controllers/userController');

const routes = (app) =>{
    app.post('/signup', userController.signup);
    app.post('/login', userController.login);
    app.get('/user/:userId', userController.verifyLoggedUser, userController.getUser);
    app.get('/users', userController.verifyLoggedUser, userController.authorizeRole('readOwn', 'profile'), userController.getUsers);
    app.put('/user/:userId', userController.verifyLoggedUser, userController.authorizeRole('updateAny', 'profile'), userController.updateUser);
    app.delete('/user/:userId', userController.verifyLoggedUser, userController.authorizeRole('deleteAny', 'profile'), userController.deleteUser);
 

}

module.exports = routes;