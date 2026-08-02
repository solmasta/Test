const Business = require('../models/Business');

// Create a new business
const createBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      address,
      contact,
      ecoCertifications,
      sustainabilityPractices
    } = req.body;

    // Create business
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all businesses
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({})
      .sort({ averageRating: -1 });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific business
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (business) {
      res.json(business);
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a business
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (business) {
      // Check if user owns this business
      if (business.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
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
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (business) {
      // Check if user owns this business
      if (business.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await business.remove();
      res.json({ message: 'Business removed' });
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a business
const addBusinessReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const business = await Business.findById(req.params.id);

    if (business) {
      // Check if user has already reviewed this business
      const alreadyReviewed = business.reviews.find(
        review => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Business already reviewed' });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment
      };

      business.reviews.push(review);
      
      // Recalculate average rating
      const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
      business.averageRating = totalRating / business.reviews.length;
      business.totalReviews = business.reviews.length;

      await business.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addBusinessReview,
};