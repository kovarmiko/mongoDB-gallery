'use strict';
var express = require('express');
var router = express.Router();
var crudOps = require('../../crudOps');

var multer = require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage }).single('picture');

/* Send Upload Form */
router.get('/create', function(req, res, next) {
  res.render('uploader', {message : "Picture Form"});
});

/* Process uploded Picture */
router.post('/create', function(req, res, next) {

	upload(req,res,function(err) {
        if(err) {
        	console.dir(err);
            return res.render('uploader', {message : "Upload failed!"});
        }
        //console.log(req.body);
        //prepare values from the form
        let title = req.body.Title;
		let gallery = req.body.Gallery;
		let owner  = req.body.Owner;
        let url = req.file.filename;
        let uploaded = Date.now();
        
        //create picture
        let picture = crudOps.picture.create(title, gallery, owner, url, uploaded, (err, picture) => console.dir(picture));

        
        //send response of the server
        res.render('uploader', {message : "Upload Successfull!"});
    });
});

router.get('/allPics', (req,res,next) => {
	crudOps.picture.all((err, pictures) =>{
		if(err){
			console.log(err);
			res.status(500);
			res.send('server encountered an unexpected error');
			return;	
		}
		res.render('gallery', {pictures});
	});
});

router.get('/edit/:id', (req,res,next) => {
	let id = req.params.id;
	
	
	crudOps.picture.findById(id, (err, picture) =>{
		if(err){
			console.log(err);
			res.status(500);
			res.send('server encountered an unexpected error');
			return;	
		}
		//console.dir(picture);
		res.render('edit-picture', {picture});
	});
});

router.post('/edit', (req,res,next) => {
	console.dir(req.body);
	crudOps.picture.update(req.body.id, req.body, ()=> res.redirect('edit/' + req.body.id))
});

router.post('/changePic', (req,res,next) => {
	upload(req,res,function(err) {
        if(err) {
        	console.dir(err);
            return res.render('uploader', {message : "Upload failed!"});
        }
        const update = {
        	id: req.body.id,
        	url: req.file.filename
        }

        crudOps.picture.update(update.id, update, ()=> res.redirect('edit/' + req.body.id));
    });
});

module.exports = router;