import React, { useEffect, useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Tweet from "../../components/Tweet/Tweet";

import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditProfile from "../../components/EditProfile/EditProfile";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [open, setOpen] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTweets = await axios.get(
          `http://localhost:8000/api/tweets/user/all/${id}`
        );
        const userProfile = await axios.get(
          `http://localhost:8000/api/users/find/${id}`
        );
        setUserTweets(userTweets.data);
        setUserProfile(userProfile.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6">
          <LeftSidebar />
        </div>

        <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
          <div className="flex justify-between items-center">
            <img className="w-12 h-12 rounded-full" alt="Profile Picture" src={userProfile?.profile}/>
            {currentUser?._id === id ? (
              <button
                onClick={() => setOpen(true)}
                className="px-4 y-2 bg-blue-500 rounded-full text-white"
              >
                Edit Profile
              </button>
            ) : currentUser?.following.includes(id) ? (
              <button className="px-4 y-2 bg-blue-500 rounded-full text-white">
                Following
              </button>
            ) : (
              <button className="px-4 y-2 bg-blue-500 rounded-full text-white">
                Follow
              </button>
            )}
          </div>
          <div className="mt-6">
            {userTweets &&
              userTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} setData={setUserTweets} />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="px-6">
          <RightSidebar />
        </div>
      </div>
      {open && <EditProfile setOpen={setOpen}/>}
    </>
  );
};

export default Profile;
