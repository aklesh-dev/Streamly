import express from 'express';

const router = express.Router();

router.get('/users', (req, res) => {
  res.send('Get all users');
});

export default router;