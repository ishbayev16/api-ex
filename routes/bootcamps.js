  
const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require('../controllers/bootcamps');

const router = express.Router();

router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

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
