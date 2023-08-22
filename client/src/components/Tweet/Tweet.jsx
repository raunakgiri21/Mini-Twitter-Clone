import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useSelector } from "react-redux";

const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [userData, setuserData] = useState()

  useEffect(() => {
    const fetchData = async() => {
      try {
        const findUser = await axios.get(`http://localhost:8000/api/users/find/${tweet.userId}`);
        setuserData(findUser.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  },[tweet.userId,tweet.likes])

  return (
    <div className="flex space-x-2">
      <Link to={``}></Link>
    </div>
  );
};

export default Tweet;
