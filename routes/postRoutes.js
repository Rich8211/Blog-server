const router  = require("express").Router();
const Post = require("../models/postModel");
const { uuid } = require('uuidv4');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuid() + "-" + fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});

router.post("/", upload.single("postImage"),async (req, res) => {
    const {title, createdAt, tags, body, author} = req.body;
    const url = req.protocol + "://" + req.get("host");


    
    try{ 
        if (req.isAuthenticated()) {
            const newPost = new Post({
            postImage: url + "/public/" + req.file.filename,
            title,
            createdAt,
            tags,
            body,
            author
        })
        const savedPost = await newPost.save();
        res.json(savedPost);
        } else res.json("Not Authenticated")
        
    }
    catch (err){
        console.error(err)
    }
    
});

router.get("/", async (req,res) => {

    const {limit, skip} = req.params;

    const posts = await Post.find().skip(skip).limit(limit);
    res.json(posts);
});

router.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json(post);
});



module.exports = router;