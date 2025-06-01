import { Op } from 'sequelize';
import Game from '../models/Game.js';
import User from '../models/User.js'
import Transaction from '../models/Transaction.js';
import Gallery from '../models/Gallery.js';
import { bucket } from '../config/storageGCP.js';
import { v4 as uuidv4 } from 'uuid';


export const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: {
        model: User,
        as: 'User',
        attributes: ['id', 'username', 'email']
      }
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getGameDetail = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'User',
        attributes: ['id', 'username', 'email']
      }
    });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const createGame = async (req, res) => {
  try {
    // Handle image upload first
    if (!req.file) {
      return res.status(400).json({ msg: 'No image uploaded' });
    }

    // Upload to GCP
    const fileId = uuidv4();
    const fileName = `${fileId}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    // Handle upload errors
    stream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ msg: 'Error uploading image' });
    });

    // When upload is complete
    stream.on('finish', async () => {
      try {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // Now create the game with the image URL
        const { nama, harga, tag, deskripsi } = req.body;

        const game = await Game.create({
          uploader_id: req.user.id,
          nama,
          gambar: publicUrl, // Using the uploaded image URL
          harga: parseFloat(harga),
          tag,
          deskripsi
        });

        res.status(201).json(game);
      } catch (error) {
        console.error('Game creation error:', error);
        res.status(500).json({ msg: error.message });
      }
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    let updateData = {
      nama: req.body.nama,
      harga: parseFloat(req.body.harga),
      tag: req.body.tag,
      deskripsi: req.body.deskripsi
    };

    // Handle file upload if exists
    if (req.file) {
      const fileId = uuidv4();
      const fileName = `${fileId}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', resolve);
        stream.end(req.file.buffer);
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      updateData.gambar = publicUrl;
    }

    const updatedGame = await game.update(updateData);
    res.json(updatedGame);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ msg: error.message });
  }
};
export const applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    const game = await Game.findByPk(req.params.id);

    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const updatedGame = await game.update({ discount });
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Transaction.findAll({
      include: [{
        model: Game,
        where: { uploader_id: req.user.id }
      }]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await Promise.all([
      Transaction.destroy({ where: { id_game: game.id } }),
      Gallery.destroy({ where: { game_id: game.id } })
    ]);

    await game.destroy();
    res.json({ msg: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};