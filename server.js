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

    if (!Object.keys(req.query).length) {
      console.log('wait');
      res.json(response);
      return 
    }

    if (req.query.genre) {
      responseGenre = response.filter(movie =>
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        );
      }
      else {
        return res.status(400).json({ error: 'bad genre' });
      }
  

    if (req.query.country) {
      responseCountry = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        );
    } else {
      return res.status(400).json({ error: 'bad country' });
    }

  
    if (req.query.avg_vote) {
      responseAvg = response.filter(movie =>
        Number(movie.avg_vote) >= Number(req.query.avg_vote)
        );
      }
      else {
        return res.status(400).json({ error: 'bad avg_Vote' });
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
