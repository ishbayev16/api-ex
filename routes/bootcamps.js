  
const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

//Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');


const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher','admin') ,bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher','admin') ,createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect,authorize('publisher','admin') , updateBootcamp)
  .delete(protect,authorize('publisher','admin') , deleteBootcamp);

module.exports = router;

/* 
router.get('/',(req, res)=>{
    res.status(200).json({succes: true, msg: "show all bootcamps"});
});

router.get('/:id',(req, res)=>{
    res.status(200).json({succes: true, msg: `get bootcamp ${req.params.id}`});
});

router.post('/',(req, res)=>{
    res.status(200).json({succes: true, msg: "create new bootcamp"});
});

router.put('/:id',(req, res)=>{
    res.status(200).json({succes: true, msg: `update bootcamp ${req.params.id}`});
});

router.delete('/:id',(req, res)=>{
    res.status(200).json({succes: true, msg: `delete bootcamp ${req.params.id}`});
}); */
