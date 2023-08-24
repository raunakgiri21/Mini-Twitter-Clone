import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import formatDistance from "date-fns/formatDistance";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useSelector } from "react-redux";

const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [userData, setuserData] = useState();
  const { id } = useParams();
  const location = useLocation().pathname;

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const findUser = await axios.get(
          `http://localhost:8000/api/users/find/${tweet.userId}`
        );
        setuserData(findUser.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [tweet.userId, tweet.likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const like = await axios.put(
        `http://localhost:8000/api/tweets/${tweet?._id}/like`,
        { id: currentUser._id },
        { withCredentials: true }
      );

      if (location.includes("profile")) {
        const newData = await axios.get(
          `http://localhost:8000/api/tweets/user/all/${id}`
        );
        setData(newData.data);
      } else if (location.includes("explore")) {
        const newData = await axios.get(
          `http://localhost:8000/api/tweets/explore`
        );
        setData(newData.data);
      } else {
        const newData = await axios.get(
          `http://localhost:8000/api/tweets/timeline/${currentUser?._id}`
        );
        setData(newData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {userData && (
        <>
          <div className="flex space-x-2">
            <Link to={`/profile/${userData?._id}`}>
              <h3 className="font-bold">{userData?.username}</h3>
            </Link>
            <span className="font-normal">@{userData?.username}</span>
            <p> - {dateStr}</p>
          </div>
          <p>{tweet.description}</p>
          <button onClick={handleLike}>
            {tweet.likes.includes(currentUser?._id) ? (
              <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
            ) : (
              <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
            )}
            {tweet.likes.length}
          </button>
        </>
      )}
    </div>
  );
};

export default Tweet;
