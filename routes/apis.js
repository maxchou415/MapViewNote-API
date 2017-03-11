var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload')
var imgur = require('imgur')
var request = require('request')

var Data = require('../models/data')

router.get('/all', (req, res, next) => {
  Data.find({}, (err, data) => {
    if(err) console.log(err)
    res.status(200).send({data})
  })
})

router.get('/booking/all', (req, res, next) => {
  var options = {
    url: 'https://distribution-xml.booking.com/json/bookings.getHotels?city_ids=-2637882',
    headers: {
      'Authorization': 'Basic ' + new Buffer('hacker234' + ":" + '8hqNW6HtfU').toString("base64")
    }
  };
  request(options, function (error, response, body) {
    if(response.statusCode === 200) {
      res.status(200).send(response.body)
    } else {
      res.status(500).send({'message': 'Fetch Data Error'})
    }
  });
})

router.get('/booking/hotel/:hotelId', (req, res, next) => {
  let hotelId = req.params.hotelId
  var options = {
    url: `https://distribution-xml.booking.com/json/bookings.getHotelDescriptionPhotos?hotel_ids=${hotelId}`,
    headers: {
      'Authorization': 'Basic ' + new Buffer('hacker234' + ":" + '8hqNW6HtfU').toString("base64")
    }
  };
  request(options, function (error, response, body) {
    if(response.statusCode === 200) {
      res.status(200).send(response.body)
    } else {
      res.status(500).send({'message': 'Fetch Data Error'})
    }
  });
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id
  Data.findById({'_id': id}, (err, data) => {
    if(err) console.log(err)
    if (!data) {
      res.status(404).send({'data': 'Not Found'})
    } else {
      res.status(200).send({'data': data})
    }
  })
})

router.post('/create', (req, res, next) => {
  let preImageUpload = req.files.photos.data

  if(!preImageUpload) {
    res.status(500).send({'message': 'Photos is required.'})
  } else {
    let imageUpload = req.files.photos.data.toString('base64')

    let lng = req.body.lng
    let lat = req.body.lat
    let description = req.body.description

    imgur.uploadBase64(imageUpload)
         .then((json) => {
            let dataCreate = {
              lng: lng,
              lat: lat,
              description: description,
              imageURL: json.data.link
            }
            Data.create(dataCreate, (err, data) => {
              if(err) console.log(err)
              res.status(200).send({'message': 'success', 'error': false })
            })
          })
         .catch((err) => {
            console.log(err)
            res.status(500).send({'message': 'failed', 'error': true })
          })
    }
  })


// router.post('/create', (req, res, next) => {
//   let preImageUpload = req.files.photos.data
//   let description = req.body.description
//
//   if(!preImageUpload) {
//     res.status(500).send({'message': 'Photos is required.'})
//
//   } else {
//     let imageUpload = req.files.photos.data.toString('base64')
//
//     imgur.uploadBase64(imageUpload)
//           .then(function (json) {
//               res.status(200).send({'imageURL': json.data.link, 'description': description, 'error': 'false'})
//           })
//           .catch(function (err) {
//               console.error(err.message);
//           })
//   }
// })

module.exports = router;
