"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import {
  fetchUserAddress,
  updateUserAddress,
} from "@/lib/actions/user.actions";
import toast from "react-hot-toast";
import CityCombobox from "@/components/CityCombobox";
import { usePathname } from "next/navigation";

const UserProfile = () => {
  const { data: session, status } = useSession();
  const userImage = session?.user?.imageUrl || "/no-user.jpg";
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "";
  const userProvince = "Ontario";

  const [streetAddressErrors, setStreetAddressErrors] = useState("empty");
  const [aptNoErrors, setAptNoErrors] = useState("empty");
  const [cityErrors, setCityErrors] = useState("empty");
  const [zipCodeErrors, setZipCodeErrors] = useState("empty");

  const [streetAddress, setStreetAddress] = useState("");
  const [aptNo, setAptNo] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [initialStreetAddress, setInitialStreetAddress] = useState("");
  const [initialAptNo, setInitialAptNo] = useState("");
  const [initialCity, setInitialCity] = useState("");
  const [initialZipCode, setInitialZipCode] = useState("");

  const [streetAddressBorder, setStreetAddressBorder] = useState("border-none");
  const [aptNoBorder, setAptNoBorder] = useState("border-none");
  const [cityBorder, setCityBorder] = useState("border-none");
  const [zipCodeBorder, setZipCodeBorder] = useState("border-none");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await fetchUserAddress();
        setStreetAddress(address.streetAddress);
        setAptNo(address.aptNo);
        setCity(address.city);
        setZipCode(address.zipCode);

        setInitialStreetAddress(address.streetAddress);
        setInitialAptNo(address.aptNo);
        setInitialCity(address.city);
        setInitialZipCode(address.zipCode);
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    fetchAddress();
  }, []);

  const isFormValid = !(
    streetAddressErrors ||
    aptNoErrors ||
    cityErrors ||
    zipCodeErrors
  );
  const isAddressChanged = !(
    streetAddress === initialStreetAddress &&
    aptNo === initialAptNo &&
    city === initialCity &&
    zipCode === initialZipCode
  );

  const handleCancel = () => {
    setStreetAddress(initialStreetAddress);
    setAptNo(initialAptNo);
    setCity(initialCity);
    setZipCode(initialZipCode);

    setStreetAddressErrors("empty");
    setAptNoErrors("empty");
    setCityErrors("empty");
    setZipCodeErrors("empty");

    setStreetAddressBorder("border-none");
    setAptNoBorder("border-none");
    setCityBorder("border-none");
    setZipCodeBorder("border-none");
  };

  const handleStreetAddressChange = (e: any) => {
    let allowedCharacters = /^[a-zA-Z0-9\s,.'-]+$/;
    setStreetAddress(e.target.value);
    if (!e.target.value.trim()) {
      setStreetAddressBorder("border border-red-500");
    } else if (e.target.value.length < 5) {
      setStreetAddressBorder("border border-red-500");
    } else if (!allowedCharacters.test(e.target.value.trim())) {
      setStreetAddressBorder("border border-red-500");
    } else {
      setStreetAddressBorder("border border-green-500");
    }
  };

  const handleAptNoChange = (e: any) => {
    const apartmentNumberRegex = /^[a-zA-Z0-9\s.'-]+$/;
    setAptNo(e.target.value);
    if (e.target.value.trim().length > 0) {
      if (!apartmentNumberRegex.test(e.target.value.trim())) {
        setAptNoBorder("border border-red-500");
      } else {
        setAptNoBorder("border border-green-500");
      }
    }
  };

  const handleZipCodeChange = (e: any) => {
    const regx = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    setZipCode(e.target.value);
    if (!e.target.value.trim()) {
      setZipCodeBorder("border border-red-500");
    } else if (!regx.test(e.target.value.trim())) {
      setZipCodeBorder("border border-red-500");
    } else {
      setZipCodeBorder("border border-green-500");
    }
  };

  const handleStreetAddressValidations = () => {
    let allowedCharacters = /^[a-zA-Z0-9\s,.'-]+$/;
    if (!(streetAddress.trim().length > 0)) {
      setStreetAddressErrors("Street Address can't be empty");
      setStreetAddressBorder("border border-red-500");
    } else if (streetAddress.trim().length < 5) {
      setStreetAddressErrors("Must be atleast 5 characters!");
      setStreetAddressBorder("border border-red-500");
    } else if (!allowedCharacters.test(streetAddress.trim())) {
      setStreetAddressErrors("Street address contains invalid characters!");
      setStreetAddressBorder("border border-red-500");
    } else {
      setStreetAddressBorder("border border-green-500");
      setStreetAddressErrors("");
    }
  };
  const handleAptNoValidations = () => {
    const apartmentNumberRegex = /^[a-zA-Z0-9\s.'-]+$/;
    if (aptNo.length > 0) {
      if (!apartmentNumberRegex.test(aptNo.trim())) {
        setAptNoErrors("Enter a valid apt number");
        setAptNoBorder("border border-red-500");
      } else {
        setAptNoErrors("");
        setAptNoBorder("border border-green-500");
      }
    } else {
      setAptNoErrors("");
    }
  };
  const handleCityValidations = () => {
    if (!(city.length > 0)) {
      setCityErrors("Select a city");
      setCityBorder("border border-red-500");
    } else {
      setCityErrors("");
      setCityBorder("border-none");
    }
  };
  const handleZipCodeValidations = () => {
    const regx = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    if (!zipCode.trim()) {
      setZipCodeErrors(`ZipCode can't be empty`);
      setZipCodeBorder("border border-red-500");
    } else if (!regx.test(zipCode.trim())) {
      setZipCodeErrors(`Enter a valid zipCode eg:(A1A A1A)`);
      setZipCodeBorder("border border-red-500");
    } else {
      setZipCodeErrors(``);
      setZipCodeBorder("border border-green-500");
    }
  };

  const handleSaveChanges = async () => {
    handleStreetAddressValidations();
    handleAptNoValidations();
    handleCityValidations();
    handleZipCodeValidations();
    
    if (isFormValid) {
      try {
        const finalAdress = {
          streetAddress: streetAddress,
          aptNo: aptNo,
          city: city,
          zipCode: zipCode,
        };
        await updateUserAddress(finalAdress);
        toast.success("Saved!");
        console.log("Changes saved successfully!");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

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
            <h4 className="text-lg text-dark px-2 font-semibold">
              User Address
            </h4>

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
                value={streetAddress}
                onChange={handleStreetAddressChange}
                onBlur={handleStreetAddressValidations}
                className={`${streetAddressBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-[95%] max-w-[95%] rounded-xl`}
              />
              {streetAddressErrors && streetAddressErrors !== "empty" && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {streetAddressErrors}
                </span>
              )}
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="aptNo" className="font-medium px-2 text-dark">
                  AptNo
                </label>
                <input
                  type="text"
                  name="aptNo"
                  id="aptNo"
                  placeholder="Enter your Apt No"
                  value={aptNo}
                  onChange={handleAptNoChange}
                  onBlur={handleAptNoValidations}
                  className={`${aptNoBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
                {aptNoErrors && aptNoErrors !== "empty" && (
                  <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                    {aptNoErrors}
                  </span>
                )}
              </div>

              <div className="w-full flex flex-col">
                <label htmlFor="city" className="font-medium px-2 text-dark">
                  City
                </label>
                <CityCombobox
                  selected={city}
                  onChange={(value) => {
                    setCity(value);
                    setCityBorder("border-none");
                    setCityErrors("");
                  }}
                  cityBorder={cityBorder}
                />
                {cityErrors && cityErrors !== "empty" && (
                  <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                    {cityErrors}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="zipCode" className="font-medium px-2 text-dark">
                  ZipCode
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  value={zipCode}
                  placeholder="Enter your zipcode"
                  onChange={handleZipCodeChange}
                  onBlur={handleZipCodeValidations}
                  className={`${zipCodeBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
                {zipCodeErrors && zipCodeErrors !== "empty" && (
                  <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                    {zipCodeErrors}
                  </span>
                )}
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
                  className={`placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-[#707070] outline-none px-5 py-2 w-full rounded-xl`}
                />
              </div>
            </div>
            <div className="flex gap-4 w-[95%] mt-6 max-w-[95%]">
              <button
                onClick={handleSaveChanges}
                disabled={!isAddressChanged}
                className="ml-[-4px] px-8 py-4 text-sm w-fit bg-dark  shadow-xl text-[#f1f1f1] rounded-3xl font-semibold"
              >
                Save Changes
              </button>

              {isAddressChanged && (
                <button
                  onClick={handleCancel}
                  className="ml-[-4px] px-8 py-4 text-sm w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-3xl font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default UserProfile;
