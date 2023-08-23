import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(handleError(404, "User not found"));
    const { password, ...otherData } = user._doc;
    res.status(200).json(otherData);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      const { password, ...otherData } = updatedUser._doc;
      res.status(200).json(otherData);
    } catch (error) {
      next(error);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Tweet.deleteMany({userId: req.params.id});
      
      res.status(200).json("User deleted successfully");
    } catch (error) {
      next(error);
    }
  } else {
    return next(handleError(403, "You can only delete your own account"));
  }
};

export const followUser = async (req, res, next) => {
  try {
    // friend user
    const user = await User.findById(req.params.id);
    // current user
    const currentUser = await User.findById(req.user.id);

    if (!user?.followers?.includes(req.user.id)) {
      await user.updateOne({
        $push: {
          followers: req.user.id,
        },
      });
      await currentUser.updateOne({
        $push: {
          following: req.params.id,
        },
      });
      res.status(200).json("following");
    } else {
      res.status(403).json("Already Following");
    }
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    // friend user
    const user = await User.findById(req.params.id);
    // current user
    const currentUser = await User.findById(req.user.id);

    if (currentUser?.following?.includes(req.params.id)) {
      await user.updateOne({
        $pull: {
          followers: req.user.id,
        },
      });
      await currentUser.updateOne({
        $pull: {
          following: req.params.id,
        },
      });
      res.status(200).json("unfollowed");
    } else {
      res.status(403).json("you are not following this user!");
    }
  } catch (error) {
    next(error);
  }
};
