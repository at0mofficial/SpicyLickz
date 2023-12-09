"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

const UserProfile = () => {
  const { data: session, status } = useSession();
  const userImage = session?.user?.imageUrl || "/no-user.jpg";
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const userStreetAddress = session?.user?.address?.streetAddress;
  const userCity = session?.user?.address?.city;
  const userZipCode = session?.user?.address?.zipcode;
  const userProvince = "Ontario";
  const userAptNo = session?.user?.address?.AptNo;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-[100px]">
        <ClipLoader color="#ff2f00" size={50} speedMultiplier={2} />
      </div>
    );
  } else {
    return (
      <main className="flex justify-center mt-[60px] mb-[100px]">
        <div className="flex flex-col gap-[60px] lg:w-[800px] lg:rounded-md lg:shadow-2xl w-full md:px-[40px] lg:px-[100px] md:pt-[60px] md:pb-[100px]">
          
          <div className="flex flex-col items-center gap-3 justify-center">
            <Image
              src={userImage}
              alt="profile picture"
              width={140}
              height={140}
              className="shrink-0 rounded-full"
            />
            <div className="text-center">
              <p className="text-xl text-[#464646] uppercase font-semibold">
                {userName}
              </p>
              <p className="text-sm text-[#707070] uppercase font-semibold">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-left px-5 md:px-14 w-full">
            <h4 className="text-lg text-dark font-semibold">User Address</h4>

            <div className="w-full flex flex-col">
              <label
                htmlFor="streetAddress"
                className="font-medium px-2 text-dark"
              >
                Street Address
              </label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                placeholder="Enter your City"
                value={userStreetAddress}
                // onChange={handleEmailChange}
                className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-[95%] max-w-[95%] rounded-xl`}
              />
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="AptNo" className="font-medium px-2 text-dark">
                  AptNo
                </label>
                <input
                  type="text"
                  name="AptNo"
                  id="AptNo"
                  placeholder="Enter your Apt No"
                  value={userAptNo}
                  // onChange={handleEmailChange}
                  className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
              </div>

              <div className="w-full flex flex-col">
                <label htmlFor="city" className="font-medium px-2 text-dark">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Enter your City"
                  value={userCity}
                  // onChange={handleEmailChange}
                  className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
              </div>
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="zipcode" className="font-medium px-2 text-dark">
                  ZipCode
                </label>
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  placeholder="Enter your zipcode"
                  value={userZipCode}
                  // onChange={handleEmailChange}
                  className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
              </div>

              <div className="w-full flex flex-col">
                <label
                  htmlFor="province"
                  className="font-medium px-2 text-dark"
                >
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  id="province"
                  placeholder="Enter your Province"
                  value={userProvince}
                  disabled
                  // onChange={handleEmailChange}
                  className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-[#707070] outline-none px-5 py-2 w-full rounded-xl`}
                />
              </div>
            </div>
            <div className="flex gap-4 w-[95%] mt-6 max-w-[95%]">
            <button className="ml-[-4px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-3xl font-semibold">
              Save Changes
            </button>
            <button className="ml-[-4px] px-8 py-4 text-sm w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-3xl font-semibold">
              Cancel
            </button>
            </div>
            
          </div>
          
        </div>
      </main>
    );
  }
};

export default UserProfile;
