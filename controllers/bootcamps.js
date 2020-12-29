const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
// exports.getBootcamps = async (req, res, next) => {
//   /* res.status(200).json({ success: true, msg: 'Show all bootcamps' }); */
//   try{
//      const bootcamps = await Bootcamp.find();
//      res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
//   }catch(err){
//     /* res.status(400).json({success: false}); */
//     next(err);
//   }

// };

/* exports.getBootcamps = asyncHandler( async (req, res, next) => {
  let query;

  //copy req.query
  const reqQuery = {...req.query};

  //Fields to execlude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);


  //create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //Select fields 
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  //Sort 
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page -1 ) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  console.log(query);
    //  const bootcamps = await Bootcamp.find();
    //execute query
     const bootcamps = await query;

  //pagination result
  const pagination = {}; 

  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

     res.status(200).json({success: true, 
      count: bootcamps.length, 
      pagination: pagination,
      data: bootcamps});
});
 */

exports.getBootcamps = asyncHandler( async (req, res, next) => {
      res.status(200).json(res.advancedResults);
});



// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      /* return res.status(400).json({success: false}); */
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true ,data: bootcamp});
//  }catch(err){
//     /* res.status(400).json({success: false}); */
//     next(err);
//     /* next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)); */
//  }

  /* res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` }); */
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  /* console.log(req.body);
  res.status(200).json({ success: true, msg: 'Create new bootcamp' }); */

  //add user to req.body
  req.body.user = req.user.id;

  //check for published bootcamp
   const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

   if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  } 
  
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  // }catch (err){
  //   next(err);
  //   /* res.status(400).json({
  //     success: false
  //   }); */
  // }
  
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  /* res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` }); */
    // try{
      let bootcamp = await Bootcamp.findById(req.params.id);

      if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        /* return res.status(400).json({success: false}); */
      }

        // Make sure user is bootcamp owner
      if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this bootcamp`,
            401
          )
        );
      }

      bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  

    res.status(200).json({success: true, data: bootcamp});
    // }catch (err){
    //   next(err);
    //  /*  res.status(400).json({
    //     success: false
    //   }); */
    // }
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
 /*  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` }); */
    // try {
      const bootcamp = await Bootcamp.findById(req.params.id);
      if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        /* return res.status(400).json({success: false}); */
      }

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.user.id} is not authorized to delete this bootcamp`,
              401
            )
          );
        }

      bootcamp.remove();

    res.status(200).json({success: true, data: {}});
  //   }catch (err){
  //     next(err);
  //  /*  res.status(400).json({
  //     success: false
  //   }); */
  // }
});


// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc      upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
       const bootcamp = await Bootcamp.findById(req.params.id);
       if(!bootcamp){
         return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
       }

         // Make sure user is bootcamp owner
      if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this bootcamp`,
            401
          )
        );
      }
 
      if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400));
      }
 
      //const file = req.files['file ']; 
      const file = req.files.file; 
      
      console.log(req.files);


      //make sure the image is a photo
      if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400));
      }

      //CHECK file size
      if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than
        ${process.env.MAX_FILE_UPLOAD}`, 400));
      }

      //create custom file name
      file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
      
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if(err){
          console.error(err);
          return next(
            new ErrorResponse(
              'Problem with file uplaod', 500
            )
          )
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
        res.status(200).json({
          success: true,
          data: file.name
        })
      });
      
      console.log(file.name);

   //   }catch (err){
   //     next(err);
   //  /*  res.status(400).json({
   //     success: false
   //   }); */
   // }
 });
