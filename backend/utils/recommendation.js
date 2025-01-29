import User from "../models/Users.js";

export const getMutualFriends = async (userId) => {
  const user = await User.findById(userId).populate("friends");
  if (!user) {
    console.error(`User with ID ${userId} not found`);
    return [];
  }

  const userFriends = user.friends.map((f) => f.toString());

  return await User.aggregate([
    { $match: { _id: { $ne: user._id }, friends: { $in: userFriends } } },
    {
      $addFields: {
        mutualFriends: {
          $size: { $setIntersection: [userFriends, "$friends"] },
        },
      },
    },
    { $sort: { mutualFriends: -1 } },
    { $limit: 10 },
    { $project: { username: 1, mutualFriends: 1 } },
  ]);
};

export const getIntrestBasedFriends = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User with ID ${userId} not found`);
    return [];
  }
  const userInterests = user.interests;

  return await User.find({
    _id: { $ne: userId },
    interests: { $in: userInterests },
    friends: { $ne: userId },
  })
    .select("username interests")
    .limit(10);
};
