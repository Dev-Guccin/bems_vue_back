const express = require('express')
const router = express.Router()
const movies = require('../data/movie.json')

router.get('/', function(req, res){
    res.send(movies)
})

router.get('/:id', function(req, res){
    const id = parseInt(req.param.id, 10);
    const movie = movie.filter(function(movie){
        return movie.id===id;
    });
    res.send(movie)
})

module.exports = router;