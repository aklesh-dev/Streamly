import express from 'express';
import { addAlbum } from './controller.js';
const router = express.Router();
router.post('/albums', addAlbum);
export default router;
