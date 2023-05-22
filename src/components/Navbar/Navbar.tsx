import { Menu } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "../util/interfaces";

interface NavbarProps {
  user?: User;
  impersonatedUser?: User;
  setImpersonateDialogOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const Navbar = ({
  user,
  impersonatedUser,
  setImpersonateDialogOpen,
  handleLogout,
}: NavbarProps) => {
  const isImpersonating =
    impersonatedUser && user && impersonatedUser.id !== user.id;
  return (
    <div className="fixed left-0 top-0 flex h-14 w-screen flex-row items-center justify-between bg-gray-100">
      <div className="ml-3 text-xl">toDUEList</div>
      <div className="flex items-center">
        {isImpersonating && (
          <span className="mr-5">Impersonating {impersonatedUser.name}</span>
        )}
        <Menu as="div" className="relative">
          <Menu.Button
            className={({ open }) =>
              `${
                open ? "bg-gray-300" : "hover:bg-gray-300"
              } mr-5 flex cursor-pointer rounded-full p-1`
            }
          >
            {user ? (
              <img
                src={user.pictureUrl}
                alt="user"
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 rounded-full" />
            )}
          </Menu.Button>
          <Menu.Items className="absolute right-0 top-12 rounded-md bg-gray-100 p-1 shadow">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-blue-300" : ""
                  } block w-full rounded-md px-4 py-1 text-right text-sm`}
                  onClick={() => {
                    setImpersonateDialogOpen(true);
                  }}
                >
                  Impersonate
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-300" : ""
                  } block w-full rounded-md px-4 py-1 text-right text-sm`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
