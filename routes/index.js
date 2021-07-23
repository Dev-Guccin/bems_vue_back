var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api', function(req, res, next) {
  console.log("test");
  res.send("okay!");
});

module.exports = router;
