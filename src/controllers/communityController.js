const Community = require('../models/Community');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');
const { getPaginationParams, paginatedResponse } = require('../utils/pagination');
const { buildSearchFilter, buildLocationFilter, buildSortOption } = require('../utils/searchFilter');

const createCommunity = asyncHandler(async (req, res, next) => {
  const { name, description, location } = req.body;

  const communityExists = await Community.findOne({ name });
  if (communityExists) {
    return next(errors.conflict('A community with this name already exists'));
  }

  const community = await Community.create({
    name,
    description,
    location,
    members: [{
      user: req.user._id,
      role: 'admin'
    }]
  });

  const user = await User.findById(req.user._id);
  user.communityMemberships.push(community._id);
  await user.save();

  res.status(201).json(community);
});

const getAllCommunities = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { q, location, sort } = req.query;

  const filter = {};
  Object.assign(filter, buildSearchFilter(q, ['name', 'description']));
  Object.assign(filter, buildLocationFilter(location));

  const sortOption = buildSortOption(sort);

  const [communities, total] = await Promise.all([
    Community.find(filter)
      .populate('members.user', 'username profile.firstName profile.lastName')
      .populate('posts')
      .skip(skip)
      .limit(limit)
      .sort(sortOption),
    Community.countDocuments(filter)
  ]);

  res.json(paginatedResponse(communities, page, limit, total));
});

const getCommunityById = asyncHandler(async (req, res, next) => {
  const community = await Community.findById(req.params.id)
    .populate('members.user', 'username profile.firstName profile.lastName')
    .populate('posts');

  if (!community) {
    return next(errors.notFound('Community'));
  }

  res.json(community);
});

const joinCommunity = asyncHandler(async (req, res, next) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    return next(errors.notFound('Community'));
  }

  const isMember = community.members.some(
    member => member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    return next(errors.conflict('You are already a member of this community'));
  }

  community.members.push({
    user: req.user._id,
    role: 'member'
  });

  const updatedCommunity = await community.save();

  const user = await User.findById(req.user._id);
  user.communityMemberships.push(community._id);
  await user.save();

  res.json(updatedCommunity);
});

const leaveCommunity = asyncHandler(async (req, res, next) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    return next(errors.notFound('Community'));
  }

  const memberIndex = community.members.findIndex(
    member => member.user.toString() === req.user._id.toString()
  );

  if (memberIndex === -1) {
    return next(errors.conflict('You are not a member of this community'));
  }

  community.members.splice(memberIndex, 1);
  const updatedCommunity = await community.save();

  const user = await User.findById(req.user._id);
  user.communityMemberships = user.communityMemberships.filter(
    communityId => communityId.toString() !== req.params.id
  );
  await user.save();

  res.json(updatedCommunity);
});

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
};