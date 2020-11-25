// set up middleware that is responsible for route handeling
const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

/* router allows to configure routes and middleware 
and import them to the app.js to be registered */
const router = express.Router(); 

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth); // not allows to run queries bellow for non-authenticated users

router.post(
    '/',
    fileUpload.single('image'), // expects a filed 'image' to be processed by multer
    [
        check('title')  // check the filed inside the 'title' field
          .not()        
          .isEmpty(),       // check if the field is not empty

        check('description').isLength({ min: 5 }),
        
        check('address')
          .not() 
          .isEmpty()  
    ],
    placesControllers.createPlace
    );

router.patch(     // partially update
    '/:pid',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 })
    ],
    placesControllers.updatePlace
    ); 

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
