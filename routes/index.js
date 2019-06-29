var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://testuser:7Boagkn4Og0pPKM5@mycluster0-pra64.mongodb.net/cambium?retryWrites=true&w=majority', {useNewUrlParser: true})

let schema = new mongoose.Schema({
    member_id: Number, 
    loan_amnt: Number,
    funded_amnt_inv: Number,
    term: String,
    int_rate: Number,
    installment: Number,
    grade: String,
    emp_title: String,
    emp_length: String,
    home_ownership: String,
    annual_inc: Number,
    verification_status: String, 
    issue_d: Date,
    loan_status: String,
    desc: String,
    purpose: String,
    title: String,
    addr_state: String,
    last_pymnt_d: String,
    last_pymnt_amnt: Number
});

let loan_details = mongoose.model('loan_details', schema);

router.get('/getLoanDetails', (req, res, next) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');

  req.query.limit = Number(req.query.limit) || 10;
  
  req.query.member_id = req.query.member_id || ''
  
  let _find = loan_details.find({});

  //if member_id is available in query param, then add in find query
  if (req.query.member_id) {
    _find = loan_details.find({member_id: req.query.member_id});
  }

  //loan_details.countDocuments({}) - used to get documentCounts, it will be used to implement server side pagination
  Promise.all([
    _find.limit(req.query.limit).exec(),
    loan_details.countDocuments({})
  ]).then((resultset) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send({
      'countDocuments': resultset[1],
      'data': resultset[0]
    });
  }).catch((err) => {
    if (err) next(err);
  });
});

module.exports = router;
