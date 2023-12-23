import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function UserDisplay({ userImage }: { userImage: string }) {
  return (
    <div className="flex relative z-[100] items-center md:gap-8 gap-4 mr-2 md:mr-6">
      <Link href={`/cart`} className="hidden md:block">
        <Image
          src={`/cartIcon-Dark.svg`}
          alt="profile"
          width={28}
          height={28}
          className="aspect-square"
        />
      </Link>
      <div className="flex relative z-[100] items-center gap-4">
        <Image
          src={`${userImage}`}
          alt="name"
          width={50}
          height={50}
          className="rounded-full aspect-square shrink-0"
        />
        <Menu as="div" className="relative inline-block">
          <Menu.Button>
            <Image
              src={`/chevron-down.svg`}
              alt="name"
              width={16}
              height={16}
              className="mt-2"
            />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-[240px] origin-top-right rounded-3xl bg-white shadow-lg ring-1 ring-dark/5 focus:outline-none">
              <div className="px-3 py-3">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/userProfile`}
                      className={`${
                        active ? "bg-secondary text-white" : "text-secondary"
                      } group flex w-full items-center justify-start gap-3 rounded-3xl my-1 px-5 py-3 text-base font-semibold tracking-wide`}
                    >
                      {active ? (
                        <Image
                          src={`/userIcon-Light.svg`}
                          alt="profile"
                          width={16}
                          height={16}
                          className="aspect-square"
                        />
                      ) : (
                        <Image
                          src={`/userIcon-Dark.svg`}
                          alt="profile"
                          width={16}
                          height={16}
                          className="aspect-square"
                        />
                      )}
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/cart`}
                      className={`${
                        active ? "bg-secondary text-white" : "text-secondary"
                      } group flex w-full items-center justify-start gap-3 rounded-3xl my-1 px-5 py-3 md:hidden text-base font-semibold tracking-wide`}
                    >
                      {active ? (
                        <Image
                          src={`/cartIcon-Light.svg`}
                          alt="profile"
                          width={20}
                          height={20}
                          className="aspect-square"
                        />
                      ) : (
                        <Image
                          src={`/cartIcon-Dark.svg`}
                          alt="profile"
                          width={20}
                          height={20}
                          className="aspect-square"
                        />
                      )}
                      Cart
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        signOut();
                      }}
                      className={`${
                        active ? "bg-secondary text-white" : "text-secondary"
                      } group flex w-full items-center justify-start gap-3 rounded-3xl my-1 px-5 py-3 text-base font-semibold tracking-wide`}
                    >
                      {active ? (
                        <Image
                          src={`/logoutIcon-Light.svg`}
                          alt="profile"
                          width={20}
                          height={20}
                          className="aspect-square"
                        />
                      ) : (
                        <Image
                          src={`/logoutIcon-Dark.svg`}
                          alt="profile"
                          width={20}
                          height={20}
                          className="aspect-square"
                        />
                      )}
                      SignOut
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
