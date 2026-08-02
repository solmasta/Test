const Community = require('../models/Community');
const User = require('../models/User');

// Create a new community
const createCommunity = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    // Check if community already exists
    const communityExists = await Community.findOne({ name });
    if (communityExists) {
      return res.status(400).json({ message: 'Community already exists' });
    }

    // Create community
    const community = await Community.create({
      name,
      description,
      location,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    // Add to user's community memberships
    const user = await User.findById(req.user._id);
    user.communityMemberships.push(community._id);
    await user.save();

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find({})
      .populate('members.user', 'username profile.firstName profile.lastName')
      .populate('posts');

    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific community
const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members.user', 'username profile.firstName profile.lastName')
      .populate('posts');

    if (community) {
      res.json(community);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a community
const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (community) {
      // Check if user is already a member
      const isMember = community.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (isMember) {
        return res.status(400).json({ message: 'Already a member' });
      }

      // Add user to community
      community.members.push({
        user: req.user._id,
        role: 'member'
      });

      const updatedCommunity = await community.save();

      // Add to user's community memberships
      const user = await User.findById(req.user._id);
      user.communityMemberships.push(community._id);
      await user.save();

      res.json(updatedCommunity);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a community
const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (community) {
      // Check if user is a member
      const memberIndex = community.members.findIndex(
        member => member.user.toString() === req.user._id.toString()
      );

      if (memberIndex === -1) {
        return res.status(400).json({ message: 'Not a member' });
      }

      // Remove user from community
      community.members.splice(memberIndex, 1);
      const updatedCommunity = await community.save();

      // Remove from user's community memberships
      const user = await User.findById(req.user._id);
      user.communityMemberships = user.communityMemberships.filter(
        communityId => communityId.toString() !== req.params.id
      );
      await user.save();

      res.json(updatedCommunity);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
};