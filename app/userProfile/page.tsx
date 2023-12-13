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

const UserProfile = () => {
  const { data: session, status } = useSession();
  const userImage = session?.user?.imageUrl || "/no-user.jpg";
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "";
  const userProvince = "Ontario";

  const [loading, setLoading] = useState(true);

  // State variables for user address
  const [streetAddress, setStreetAddress] = useState("");
  const [aptNo, setAptNo] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Initial values for comparison
  const [initialAddress, setInitialAddress] = useState({
    streetAddress: "",
    aptNo: "",
    city: "",
    zipCode: "",
  });

  // State variables for form validation
  const [streetAddressError, setStreetAddressError] = useState("");
  const [aptNoError, setAptNoError] = useState("");
  const [cityError, setCityError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");

  const isFormValid = !streetAddressError && !aptNoError && !cityError && !zipCodeError
  
  const isAddressChanged = streetAddress !== initialAddress.streetAddress ||
  aptNo !== initialAddress.aptNo ||
  city !== initialAddress.city ||
  zipCode !== initialAddress.zipCode;

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await fetchUserAddress();
        setStreetAddress(address.streetAddress);
        setAptNo(address.aptNo);
        setCity(address.city);
        setZipCode(address.zipCode);

        setInitialAddress({
          streetAddress: address.streetAddress,
          aptNo: address.aptNo,
          city: address.city,
          zipCode: address.zipCode,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user address:", error);
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);


  const handleInputChange = (field: string, value: string) => {
    // Update the corresponding state and reset the error for the field
    switch (field) {
      case "streetAddress":
        setStreetAddress(value);
        break;
      case "aptNo":
        setAptNo(value);
        break;
      case "city":
        setCity(value);
        break;
      case "zipCode":
        setZipCode(value);
        break;
      default:
        break;
    }
  };

  const validateField = (field: string, value: string): Boolean => {
    // Validation logic for each field
    let result = true
    switch (field) {
      case "streetAddress":
        // Validation logic for streetAddress
        if (!value.trim()) {
          setStreetAddressError("Street Address can't be empty");
          result = false;
        } else if (value.trim().length < 5) {
          setStreetAddressError("Must be at least 5 characters!");
          result = false;
        } else {
          setStreetAddressError("");
        }
        break;
      case "aptNo":
        // Validation logic for aptNo
        if (value.trim().length > 0) {
          const apartmentNumberRegex = /^[a-zA-Z0-9\s.'-]+$/;
          if (!apartmentNumberRegex.test(value.trim())) {
            setAptNoError("Enter a valid apt number");
            result = false;
          } else {
            setAptNoError("");
          }
        } else {
          setAptNoError("");
        }
        break;
      case "city":
        // Validation logic for city
        if (!value.trim()) {
          setCityError("Select a city");
          result = false;
        } else {
          setCityError("");
        }
        break;
      case "zipCode":
        // Validation logic for zipCode
        const regx = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
        if (!value.trim()) {
          setZipCodeError("ZipCode can't be empty");
          result = false;
        } else if (!regx.test(value.trim())) {
          setZipCodeError(`Enter a valid zipCode, e.g., (A1A A1A)`);
          result = false;
        } else {
          setZipCodeError("");
        }
        break;
      default:
        break;
    }
    return result
  };

  const handleInputBlur = (field: string, value: string) => {
    // Validate the field on blur
    validateField(field, value);
  };

  const handleCancel = () => {
    // Reset the fields to initial values and clear error messages
    setStreetAddress(initialAddress.streetAddress);
    setAptNo(initialAddress.aptNo);
    setCity(initialAddress.city);
    setZipCode(initialAddress.zipCode);

    setStreetAddressError("");
    setAptNoError("");
    setCityError("");
    setZipCodeError("");
  };

  function convertZipCode(zipCode:string) {
    const regex = /^([A-Z]\d[A-Z])(\d[A-Z]\d)$/;
    const match = zipCode.match(regex);
  
    if (match) {
      const newZipCode = `${match[1]} ${match[2]}`;
      return newZipCode;
    } else {
      return zipCode;
    }
  }

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before attempting to save
    const val_sa =  validateField("streetAddress", streetAddress);
    const val_an = validateField("aptNo", aptNo);
    const val_ct = validateField("city", city);
    const val_zc = validateField("zipCode", zipCode);
    
    // Check if the form is valid before proceeding to save
    if (val_sa && val_an && val_ct && val_zc) {
      const newStreetAddress = streetAddress.trim();
        const newAptNo = aptNo.trim();
        const newCity = city.trim();
        const newZipCode = convertZipCode(zipCode.trim());
        
      try {
        const updatedAddress = {
          streetAddress: newStreetAddress,
          aptNo: newAptNo,
          city: newCity,
          zipCode: newZipCode,
        };

        // Call the update function
        await updateUserAddress(updatedAddress);

        // Update the initialAddress for future comparisons
        setInitialAddress(updatedAddress);

        toast.success("Address saved successfully!");
      } catch (error) {
        toast.error("Error saving address. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center p-[100px]">
        <ClipLoader color="#ff2f00" size={50} speedMultiplier={2} />
      </div>
    );
  }

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
            <h1 className="text-2xl text-dark font-semibold">{userName}</h1>
            <p className="text-sm text-gray">{userEmail}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-left px-5 md:px-14 w-full">
          <h4 className="text-lg text-dark px-2 font-semibold">User Address</h4>
          <form
            onSubmit={handleSaveAddress}
            className="flex flex-col gap-4 w-full"
          >
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
                placeholder="Enter your Street Address"
                value={streetAddress}
                onChange={(e) =>
                  handleInputChange("streetAddress", e.target.value)
                }
                onBlur={() => handleInputBlur("streetAddress", streetAddress)}
                className={`${
                  streetAddressError ? "border border-red-500" : "border-none"
                } placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-[95%] max-w-[95%] rounded-xl`}
              />
              {streetAddressError && (
                <span className="text-red-500 px-2 text-sm mt-1 w-[95%] max-w-[95%]">
                  {streetAddressError}
                </span>
              )}
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="aptNo" className="font-medium px-2 text-dark">
                  Apartment Number
                </label>
                <input
                  type="text"
                  name="aptNo"
                  id="aptNo"
                  placeholder="Enter your AptNo"
                  value={aptNo}
                  onChange={(e) => handleInputChange("aptNo", e.target.value)}
                  onBlur={() => handleInputBlur("aptNo", aptNo)}
                  className={`${
                    aptNoError ? "border border-red-500" : "border-none"
                  } placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
                {aptNoError && (
                  <span className="text-red-500 px-2 text-sm mt-1 w-[95%] max-w-[95%]">
                    {aptNoError}
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
                    handleInputChange("city", value);
                    handleInputBlur("city", city);
                  }}
                  cityBorder={`${
                    cityError ? "border border-red-500" : "border-none"
                  }`}
                />
                {cityError && (
                  <span className="text-red-500 px-2 text-sm mt-1 w-[95%] max-w-[95%]">
                    {cityError}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-[95%] max-w-[95%]">
              <div className="w-full flex flex-col">
                <label htmlFor="zipCode" className="font-medium px-2 text-dark">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  placeholder="Enter your Zip Code"
                  value={zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  onBlur={() => handleInputBlur("zipCode", zipCode)}
                  className={`${
                    zipCodeError ? "border border-red-500" : "border-none"
                  } placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] font-medium text-gray outline-none px-5 py-2 w-full rounded-xl`}
                />
                {zipCodeError && (
                  <span className="text-red-500 px-2 text-sm mt-1 w-[95%] max-w-[95%]">
                    {zipCodeError}
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
                type="submit"
                disabled={!isAddressChanged || !isFormValid}
                className={`${
                  isAddressChanged ? "bg-dark" : "bg-gray"
                } ml-[-4px] px-8 py-4 text-sm w-fit   shadow-xl text-[#f1f1f1] rounded-3xl font-semibold`}
              >
                Save Changes
              </button>

              {isAddressChanged && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ml-[-4px] px-8 py-4 text-sm w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-3xl font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
