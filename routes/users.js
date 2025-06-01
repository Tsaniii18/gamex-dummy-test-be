import express from 'express';
import { 
  updateProfile,
  buyGame,
  updateGameStatus,
  deleteFromLibrary,
  getPurchaseHistory,
  getMyGames,
  getLibrary,
  deleteAccount,
  getCurrentUser
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(verifyToken);
router.get('/me/:decode', getCurrentUser);
router.put('/profile', verifyToken, upload.single('foto_profil'), updateProfile); 
router.post('/buy', buyGame);
router.get('/library', getLibrary); 
router.patch('/library/:gameId', updateGameStatus);
router.delete('/library/:gameId', deleteFromLibrary);
router.get('/history', getPurchaseHistory);
router.get('/my-games', getMyGames);
router.delete('/account', deleteAccount);

export default router;