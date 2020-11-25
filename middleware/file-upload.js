const multer = require ('multer');
const {v1: uuidv1} = require('uuid');

const MIME_TYPE_MAP = { // is a standard that indicates the nature and format of a document, file, or assortment of bytes.
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({
    limits: 500000, // maximum weight of an image
    storage: multer.diskStorage({ // how data to get stored. Generates a disk storage how the data
        destination: (req, file, cb) => { // destination and filename arefunctions that get a request object, a file and callback
            cb(null, 'uploads/images'); // the firs arg of the cb is an error, the second is a PATH TO THE STORAGE
        },
        filename: (req, file, cb) => {
            const extention = MIME_TYPE_MAP[file.mimetype]; // find a mimetype with the mimetype of a file
            cb(null, `${uuidv1()}.${extention}`); // the firs arg of the cb is an error, the second is a FILENAME
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Your image must be in jpeg, jpg or png.');
        cb(error, isValid); // the first argument is an error, and the second argument is a bollean to inform whethear we accept file or not
    }
});

module.exports = fileUpload;
