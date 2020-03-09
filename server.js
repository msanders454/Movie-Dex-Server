// Moviedex API server
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');

const app = express();
const movies = require('./movies-data-small');

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet()); 

function validateBearerToken(req, res, next) {
  
    const apiToken = process.env.API_TOKEN
    console.log(apiToken)
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  }

app.get('/movie', [validateBearerToken], function (req, res) {
    let response = movies;
    console.log(req.query);


    if (req.query.genre) {
      response = response.filter(movie =>
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        );
      }
     
    if (req.query.country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        );
    } 
  
    if (req.query.avg_vote) {
      response = response.filter(movie =>
        Number(movie.avg_vote) >= Number(req.query.avg_vote)
        );
      }
      
    res.json(response)
})

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
