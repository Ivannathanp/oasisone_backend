import express from "express";
const router = express.Router();
import  uuid  from "uuidv4";
import multer from "multer";
import User from "../models/userModel.js";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "../public")
    },

    filename: (req, file, callback) => {
        callback(null, uuid() + '-' + Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, callback) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({storage, fileFilter});

router.get('/', (req,res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', upload.single("profileImg"), (req,res) => {
    const newUser = new User({
        username: req.body.username,
        profileImg: req.file.originalname
    });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error' + err));
});

router.get('/:id', (req,res) => {
    User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:id', upload.single("profileImg"), (req,res) => {
    User.findById(req.params.id)
        .then(users => {
            users.username = req.body.username;
            users.profileImg = req.file.originalname;

            users
                .save()
                .then(() => res.json("User Updated!"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

router.delete('/:id', (req,res) => {
    User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User Deleted!"))
    .catch(err => res.status(400).json('Error: ' + err));
});

export default router;