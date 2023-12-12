"use client";
import { useEffect, useState } from "react";
import { ontarioCities } from "@/constants";
import { Combobox, Transition } from "@headlessui/react";
import Image from "next/image";

interface CityComboboxProps {
  selected: string;
  onChange: (value: string) => void;
  cityBorder: string;
}
const CityCombobox: React.FC<CityComboboxProps> = ({
  selected,
  onChange,
  cityBorder,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const exactMatch = ontarioCities.find(
      (city) =>
        city.name.toLowerCase().replace(/\s+/g, "") ===
        query.toLowerCase().replace(/\s+/g, "")
    );

    if (exactMatch && query.trim() !== "") {
      onChange(exactMatch.name);
    }
  }, [query, onChange]);

  const filteredontarioCities =
    query === ""
      ? ontarioCities
      : ontarioCities.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative w-full max-w-full">
        <div
          className={`relative w-full cursor-default overflow-hidden px-5 rounded-xl bg-[#f1f1f1] ${cityBorder} text-left outline-none sm:text-sm`}
        >
          <Combobox.Input
            className={`bg-[#f1f1f1] font-medium text-base text-gray outline-none  px-5 py-2 w-full rounded-xl`}
            displayValue={(e: any) => selected}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Image
              src={`/chevron-down.svg`}
              alt="name"
              width={12}
              height={12}
            />
          </Combobox.Button>
        </div>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#f1f1f1] py-1 font-medium text-base text-gray shadow-lg ring-dark/5 focus:outline-none sm:text-sm">
            {filteredontarioCities.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredontarioCities.map(
                (city: { id: number; name: string }) => (
                  <Combobox.Option
                    key={city.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-dark font-medium text-white"
                          : "text-gray font-medium"
                      }`
                    }
                    value={city.name}
                  >
                    {({ selected }) => (
                      <div
                        className={`block truncate ${
                          selected ? "font-medium" : "font-medium"
                        }`}
                      >
                        {city.name}
                      </div>
                    )}
                  </Combobox.Option>
                )
              )
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default CityCombobox;
