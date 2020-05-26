'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multer = require('multer');
 
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/songs');
  },
  filename(req, file = {}, cb) {
    const { originalname } = file;
    
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    // cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + fileExtension);
    });
  },
});
var mul_upload = multer({dest: './uploads/songs',storage});
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/songs/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
//api.post('/upload-image-song/:id', [md_auth.ensureAuth, mul_upload.single('image')], SongController.uploadImage);
api.get('/get-song-file/:songFile', SongController.getSongFile);




module.exports = api;
