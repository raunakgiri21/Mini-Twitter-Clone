import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Tweet from "../Tweet/Tweet";

const ExploreTweets = () => {
  const [explore, setExplore] = useState();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exploreTweets = await axios.get(
          `http://localhost:8000/api/tweets/explore`
        );
        setExplore(exploreTweets?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentUser]);
  return (
    <div className="mt-6">
      {explore &&
        explore.map((tweet) => {
          return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setExplore} />
            </div>
          );
        })}
    </div>
  );
};

export default ExploreTweets;
