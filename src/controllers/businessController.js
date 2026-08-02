const Business = require('../models/Business');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');
const { getPaginationParams, paginatedResponse } = require('../utils/pagination');

const createBusiness = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    address,
    contact,
    ecoCertifications,
    sustainabilityPractices
  } = req.body;

  const business = await Business.create({
    name,
    description,
    category,
    address,
    contact,
    ecoCertifications,
    sustainabilityPractices,
    createdBy: req.user._id
  });

  res.status(201).json(business);
});

const getAllBusinesses = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req);

  const [businesses, total] = await Promise.all([
    Business.find({})
      .skip(skip)
      .limit(limit)
      .sort({ averageRating: -1 }),
    Business.countDocuments({})
  ]);

  res.json(paginatedResponse(businesses, page, limit, total));
});

const getBusinessById = asyncHandler(async (req, res, next) => {
  const business = await Business.findById(req.params.id);

  if (!business) {
    return next(errors.notFound('Business'));
  }

  res.json(business);
});

const updateBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.findById(req.params.id);

  if (!business) {
    return next(errors.notFound('Business'));
  }

  if (business.createdBy.toString() !== req.user._id.toString()) {
    return next(errors.unauthorized('You can only update your own businesses'));
  }

  const {
    name,
    description,
    category,
    address,
    contact,
    ecoCertifications,
    sustainabilityPractices
  } = req.body;

  business.name = name || business.name;
  business.description = description || business.description;
  business.category = category || business.category;
  business.address = address || business.address;
  business.contact = contact || business.contact;
  business.ecoCertifications = ecoCertifications || business.ecoCertifications;
  business.sustainabilityPractices = sustainabilityPractices || business.sustainabilityPractices;

  const updatedBusiness = await business.save();
  res.json(updatedBusiness);
});

const deleteBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.findById(req.params.id);

  if (!business) {
    return next(errors.notFound('Business'));
  }

  if (business.createdBy.toString() !== req.user._id.toString()) {
    return next(errors.unauthorized('You can only delete your own businesses'));
  }

  await business.deleteOne();
  res.json({ message: 'Business removed successfully' });
});

const addBusinessReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const business = await Business.findById(req.params.id);

  if (!business) {
    return next(errors.notFound('Business'));
  }

  const alreadyReviewed = business.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return next(errors.conflict('You have already reviewed this business'));
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment
  };

  business.reviews.push(review);

  const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
  business.averageRating = totalRating / business.reviews.length;
  business.totalReviews = business.reviews.length;

  await business.save();
  res.status(201).json({ message: 'Review added successfully' });
});

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addBusinessReview,
};