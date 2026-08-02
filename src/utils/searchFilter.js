const buildSearchFilter = (query, searchFields) => {
  if (!query) return {};

  const searchRegex = { $regex: query, $options: 'i' };
  return {
    $or: searchFields.map(field => ({
      [field]: searchRegex
    }))
  };
};

const buildCategoryFilter = (category) => {
  if (!category) return {};
  return { category };
};

const buildRatingFilter = (minRating) => {
  if (!minRating) return {};
  return { averageRating: { $gte: parseFloat(minRating) } };
};

const buildDifficultyFilter = (difficulty) => {
  if (!difficulty) return {};
  return { difficulty };
};

const buildLocationFilter = (location) => {
  if (!location) return {};
  return { location: { $regex: location, $options: 'i' } };
};

const buildSortOption = (sortBy) => {
  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'most-rated': { averageRating: -1, totalReviews: -1 },
    'most-members': { 'members': -1 },
    'most-participants': { 'participants': -1 },
    'highest-points': { points: -1 },
    'easiest': { difficulty: 1 },
    'hardest': { difficulty: -1 },
  };

  return sortOptions[sortBy] || { createdAt: -1 };
};

module.exports = {
  buildSearchFilter,
  buildCategoryFilter,
  buildRatingFilter,
  buildDifficultyFilter,
  buildLocationFilter,
  buildSortOption,
};
