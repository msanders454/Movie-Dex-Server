// Moviedex API server
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');

const app = express();
const movies = require('./movies-data-small');

app.use(morgan('dev')); 
app.use(cors())
app.use(helmet()); 

app.use(function validateBearerToken(req, res, next) {
  
    const apiToken = process.env.API_TOKEN
    console.log(apiToken)
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.get('/movie', function handleGetMovie(req, res) {
    let response = movies;

  
    if (req.query.genre) {
        response = response.filter(movie =>
          movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
      }
    else return res.status(400).json({ error: 'bad genre' });
  

    if (req.query.country) {
        response = response.filter(movie =>
          movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
      }
    else return res.status(400).json({ error: 'bad country' });
  
    if (req.query.avg_vote) {
        response = response.filter(movie =>
          Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
      }
    else return res.status(400).json({ error: 'bad avg_vote' });
  

    res.json(response)
})

const PORT = 9000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})