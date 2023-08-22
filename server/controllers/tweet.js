import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

export const createTweet = async (req, res, next) => {
  try {
    const newTweet = new Tweet(req.body);
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (error) {
    next(error);
  }
};

export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet && tweet.userId === req.user.id) {
      await Tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      next(handleError(500, "tweet error"));
    }
  } catch (error) {
    next(error);
  }
};

export const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet) {
      if (!tweet.likes.includes(req.user.id)) {
        await Tweet.updateOne({
          $push: { likes: req.user.id },
        });
        res.status(200).json("tweet has been liked");
      } else {
        await tweet.updateOne({
          $pull: { likes: req.user.id },
        });
        res.status(200).json("tweet has been disliked");
      }
    } else {
      next(handleError(500, "tweet error"));
    }
  } catch (error) {
    next(error);
  }
};

export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return Tweet.find({ userId: followerId });
      })
    );
    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (error) {
    next(error);
  }
};

export const getUserTweets = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(userTweets);
  } catch (error) {
    next(error);
  }
};

export const getExploreTweets = async (req, res, next) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });

    res.status(200).json(getExploreTweets);
  } catch (error) {
    next(error);
  }
};
