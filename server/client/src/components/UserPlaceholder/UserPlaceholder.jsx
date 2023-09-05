import axios from "axios";
import React, { useState, useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";

const UserPlaceholder = ({ setUserData, userData }) => {
  const { id } = useParams();
  const location = useLocation().pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await axios.get(
          `/api/users/find/${id}`
        );
        setUserData(userProfile.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  return <div>{userData?.username}</div>;
};

export default UserPlaceholder;
