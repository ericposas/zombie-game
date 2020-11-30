var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Score = mongoose.model('Score', {
  name: {
    unique: true,
    type: String
  },
  score: Number,
  time : { type : Date, default: Date.now }
})

/* Methods */
const getScores = (req, res, next) => {
  Score
  .find()
  .limit(100)
  .catch(err => {
    console.log(err)
  })
  .then((result) => {
    console.log(result)
    res.send(result)
  })
}

const submitNewScore = (req, res, next) => {
  let {
    name,
    score: _score
  } = req.body
  const score = new Score({
    name: name,
    score: _score ? _score : Math.floor( Math.random() * 100 )
  })
  let isErr = false
  let errType = ''
  score
  .save()
  .catch(err => {
    console.log(err)
    isErr = true
  })
  .then(() => {
    if (isErr) {
      submitOverOldScore(req, res, next)
    } else {
      console.log('score saved!')
      res.send('score saved!')
    }
  })
}

const submitOverOldScore = (req, res, next) => {
  let { name, score: _score } = req.body
  // first, make sure that the new score is actually higher than the previous..
  let oldScore, scoreDoc
  Score.find({ name }, (err, doc) => {
    if (!err) {
      scoreDoc = doc[0]
      oldScore = scoreDoc.score
      console.log( oldScore, req.body.score )
    }
    if (req.body.score > oldScore) {
      scoreDoc.score = req.body.score
      scoreDoc
      .save()
      .catch(err => console.log(err))
      .then(() => {
        res.send( 'score doc updated' )
      })
      // Score.findOneAndUpdate({ name }, req.body, { upsert: true })
      // .catch(err => console.log(err))
      // .then(result => {
      //   console.log( result )
      //   res.send( 'entry updated' )
      // })
    } else {
      let msg = 'prev score is higher than current'
      console.log( msg )
      res.send( msg )
    }
  })
}

/* GET */
router.get('/', getScores)
router.post('/', submitNewScore)
router.put('/', submitOverOldScore)

module.exports = router;
