//storyController.js
const axios = require('axios');

exports.test = (req, res) => {
  res.json({
    success: true,
    message: "서버가 정상적으로 작동하고 있습니다."
  });
}