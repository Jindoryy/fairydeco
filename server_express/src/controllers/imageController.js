//imageController.js
const db = require('../config/db');
const imageService = require('../services/imageService');

async function createImage(req, res) {
  const { pageId } = req.body;

  db.query('SELECT page_story FROM page WHERE page_id = ?', [pageId], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error fetching story from database');
    }
    if (results.length === 0) {
      return res.status(404).send('No story found for the given page ID');
    }

    try {
      const pageStory = results[0].page_story;
      const imageUrl = await imageService.generateImage(pageStory, pageId);
      res.status(200).send({ imageUrl });
    } catch (error) {
      console.error('Failed to create or upload image:', error);
      res.status(500).send('Failed to create or upload image');
    }
  });
}

module.exports = {
  createImage
};
