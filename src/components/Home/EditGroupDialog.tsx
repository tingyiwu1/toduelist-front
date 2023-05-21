import { useState, useMemo, useEffect } from "react";
import { getTimeZones } from "@vvo/tzdb";

import { Dialog, Combobox } from "@headlessui/react";
import { Group } from "../util/interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export type EditDialogSpec = Group | "new" | "closed";

interface EditGroupDialogProps {
  spec: EditDialogSpec;
  setSpec: (spec: EditDialogSpec) => void;
  createGroup: (name: string, timeZone: string) => Promise<void>;
  editGroup: (groupId: string, name: string, timeZone: string) => Promise<void>;
}

const EditGroupDialog = ({
  spec,
  setSpec,
  createGroup,
  editGroup,
}: EditGroupDialogProps) => {
  const edit = !(spec === "new" || spec === "closed");
  const [name, setName] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("");
  const [timeZoneInput, setTimeZoneInput] = useState<string>("");

  const timeZoneOptions = useMemo(
    () =>
      getTimeZones().map((tz) => ({
        value: tz.name,
        label: `${tz.name} (${tz.currentTimeFormat})`,
        searchStrs: [
          tz.name.toLowerCase(),
          tz.alternativeName.toLowerCase(),
          ...tz.mainCities.map((city) => city.toLowerCase()),
          tz.continentName.toLowerCase(),
          tz.countryName.toLowerCase(),
          tz.abbreviation.toLowerCase(),
        ],
      })),
    [getTimeZones]
  );

  useEffect(() => {
    if (edit) {
      setName(spec.name);
      setTimeZone(spec.timeZone);
    } else {
      setName("");
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
    setTimeZoneInput("");
  }, [spec, timeZoneOptions]);

  const filteredTimeZoneOptions =
    timeZoneInput === ""
      ? timeZoneOptions
      : timeZoneOptions.filter((tz) => {
          const searchStr = timeZoneInput.toLowerCase();
          return tz.searchStrs.some((str) =>
            str.toLowerCase().includes(searchStr)
          );
        });

  const handleSave = () => {
    if (!name || !timeZone) return;
    if (edit) {
      editGroup(spec.id, name, timeZone);
    } else {
      createGroup(name, timeZone);
    }
    setSpec("closed");
  };

  return (
    <Dialog open={spec !== "closed"} onClose={() => setSpec("closed")}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-[40rem] overflow-hidden rounded-lg bg-white p-3 text-left align-middle shadow-xl lg:w-[50rem] xl:w-[65rem]">
            <Dialog.Title className="text-lg font-medium">
              {edit? "Edit": "New"} Group
            </Dialog.Title>
            <Dialog.Description className="mt-1">
              <div className="flex flex-col items-stretch">
                <input
                  className="bg-gray-50 px-2 py-1 focus:outline-none my-2"
                  type="text"
                  value={name}
                  placeholder="Group Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Combobox
                  as="div"
                  className="relative"
                  value={timeZone}
                  onChange={setTimeZone}
                  nullable
                >
                  <Combobox.Input
                    className="w-full bg-gray-50 px-2 py-1 focus:outline-none"
                    displayValue={() => timeZone}
                    onChange={(e) => setTimeZoneInput(e.target.value)}
                    placeholder="Time Zone"
                  />
                  <Combobox.Options
                    className="mb-1 max-h-96 overflow-auto bg-gray-50 py-1 text-sm shadow-lg"
                    static
                  >
                    {filteredTimeZoneOptions.map((tz) => (
                      <Combobox.Option
                        className={({ selected, active }) =>
                          `py2 relative cursor-default select-none overflow-hidden text-ellipsis whitespace-nowrap pl-4 pr-4 ${
                            selected && active
                              ? "bg-red-400"
                              : selected
                              ? "bg-red-300"
                              : active
                              ? "bg-gray-300"
                              : ""
                          }`
                        }
                        key={tz.value}
                        value={tz.value}
                      >
                        {tz.label}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
                <button
                  className="rounded-lg p-1 border hover:bg-gray-300"
                  onClick={handleSave}
                >
                  {edit ? "Save" : "Create"}
                </button>
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default EditGroupDialog;
