import express from 'express';
import { addAlbum, addSong, addThumbnail, deleteAlbum, deleteSong } from './controller.js';
import { isAdminAuth } from './middleware/auth.middleware.js';
import uploadFile from './middleware/multer.middleware.js';

const router = express.Router();

router.post('/album/new', isAdminAuth, uploadFile, addAlbum);
router.post('/song/new', isAdminAuth, uploadFile, addSong);
router.post('/song/:id', isAdminAuth, uploadFile, addThumbnail);
router.delete('/album/:id', isAdminAuth, deleteAlbum);
router.delete('/song/:id', isAdminAuth, deleteSong);

export default router;