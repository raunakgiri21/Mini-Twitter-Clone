import React, { useState, useEffect } from "react";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { changeProfile, logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ setOpen }) => {
  const [img, setImg] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    img && uploadImg(img);
  }, [img]);

  const uploadImg = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const updatedProfile = await axios.put(
              `${process.env.REACT_APP_API}/users/${currentUser._id}`,
              {
                profile: downloadURL,
              },
              { withCredentials: true }
            );
          } catch (error) {
            console.log(error);
          }
          dispatch(changeProfile(downloadURL));
        });
      }
    );
  };

  const handleDelete = async () => {
    try {
      const deleteProfile = await axios.delete(
        `${process.env.REACT_APP_API}/users/${currentUser._id}`,
        { withCredentials: true }
      );
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
      <div className="w-[600px] h-[600px] bg-slate-200 rounder-lg p-8 flex flex-col gap-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          X
        </button>
        <h2 className="font-bold text-xl">Edit Profile</h2>
        <p> Choose a new profile picture</p>
        {imgUploadProgress > 0 ? (
          "Uploading " + imgUploadProgress + "%"
        ) : (
          <input
            type="file"
            accept="image/*"
            className="bg-transparent border border-slate-500 rounded p-2"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <p>Delete Account</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 rounded-full"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EditProfile;