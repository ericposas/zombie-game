var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Score = mongoose.model('Score', {
  name: {
    unique: true,
    type: String
  },
  score: Number
})

/* Methods */
const getScores = (req, res, next) => {
  Score.find()
  .catch(err => {
    console.log(err)
  })
  .then((result) => {
    console.log(result)
    res.send(result)
  })
}

const submitNewScore = (req, res, next) => {
  // console.log(req)
  const score = new Score({
    name: req.body.name,
    score: req.body.score //Math.floor( Math.random() * 100 )
  })
  let isErr = false
  let errType = ''
  score
  .save()
  .catch(err => {
    console.log(err)
    isErr = true
    if (err.code === 11000) { errType = 'Duplicate Name'; }
  })
  .then(() => {
    if (isErr) {
      console.log('error occurred')
      res.send(`error occurred: ${errType}`)
    } else {
      console.log('score saved!')
      res.send('score saved!')
    }
  })
}

/* GET */
router.get('/', getScores)
router.post('/', submitNewScore)

module.exports = router;
