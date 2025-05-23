import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Email, FullName } from "../components/Inputs";
import toast from "react-hot-toast";
import avatar from "../../public/pngwing.com.png";
import { FaCamera } from "../components/Icons";

const Profile = () => {
  const { isUpdatingProfile, authUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "",
    email: "",
  });

  const uploadImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));

        toast.promise(
          updateProfile({ profilePic: reader.result }).then((res) => {
            if (res?.status === 200) {
              // console.log(res.data);
              return;
            } else {
              throw new Error(res.message || "Uploading failed");
            }
          }),
          {
            loading: "Uploading...",
            success: "Uploading successfully",
            error: (err) => {
              return err.message;
            },
          }
        );
      };
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData(authUser);
    }
  }, [authUser]);

  return (
    <div className="flex justify-center items-center py-4 sm:py-10">
      <div className="flex gap-8 flex-col py-8 px-4 rounded-md bg-base-300 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <div className="flex gap-2 flex-col items-center justify-center">
          <h3 className="text-xl font-bold">Profile</h3>
          <p className="text-sm">Your Profile Information</p>
        </div>

        <div className="flex gap-4 flex-col">
          <ProfileImage
            image={formData?.profilePic}
            uploadImage={uploadImage}
            isLoading={isUpdatingProfile}
          />
          <FullName disabled={true} value={formData?.fullName} />
          <Email disabled={true} value={formData?.email} />
        </div>

        <div className="flex gap-4 flex-col">
          <h4 className="pb-2 text-md">Account Information</h4>
          <div className="flex items-center justify-between text-sm">
            <p>Member Since</p>
            <p>{new Date(authUser?.createdAt).toLocaleDateString()}</p>
          </div>

          <hr className="border border-base-200" />

          <div className="flex items-center justify-between text-sm">
            <p className="">Account Status</p>
            <p className="text-primary">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileImage = ({ image, uploadImage, isLoading }) => {
  return (
    <div className="flex justify-center flex-col items-center gap-4">
      <label className="avatar cursor-pointer hover:outline-offset-2 hover:outline-primary hover:outline rounded-full">
        <div className="w-40 rounded-full relative">
          <img
            src={image ? image : avatar}
            alt="Profile"
            className="size-full object-cover"
          />

          <input
            type="file"
            accept="image/*"
            disabled={isLoading}
            onChange={(e) => {
              uploadImage(e);
            }}
            className="hidden"
          />

          {isLoading && (
            <div className="absolute w-full h-full text-sm flex items-center justify-center z-10 top-0 left-0 bg-[rgba(0,0,0,0.5)]">
              Loading...
            </div>
          )}
        </div>

        <span className="p-2 bg-base-100 rounded-full absolute bottom-0 right-0">
          <FaCamera className="size-5 text-primary" />
        </span>
      </label>

      <p className="text-xs flex items-center gap-2 text-primary text-center">
        {isLoading && <span className="loading loading-spinner"></span>}
        {isLoading
          ? "Updating Profile ..."
          : "Click on the image to update your profile picture"}
      </p>
    </div>
  );
};

export default Profile;
