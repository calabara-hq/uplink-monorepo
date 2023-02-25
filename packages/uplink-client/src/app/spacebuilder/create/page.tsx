"use client";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useReducer, useEffect } from "react";

interface FormElements extends HTMLFormControlsCollection {
  spaceName: HTMLInputElement;
  idHyphen: HTMLInputElement;
  idSmoosh: HTMLInputElement;
}

interface SpaceFormData extends HTMLFormElement {
  readonly elements: FormElements;
}

type ValidatedFormData = {
  spaceName: string;
  identifier: string | null;
};

type Admin = {
  id: number;
  address: string | null;
};

type SpaceBuilderProps = {
  spaceName: string;
  spaceNameError: string | null;
  spaceIdentifier: string;
  admins: Admin[];
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setSpaceName":
      return { ...state, spaceName: action.payload };
    case "setSpaceNameError":
      return { ...state, spaceNameError: action.payload };
    case "addAdmin":
      return {
        ...state,
        admins: [
          ...state.admins,
          { id: state.admins.length, address: null }, // add unique ID to new admin object
        ],
      };
    case "removeAdmin":
        console.log('deleteing', action.payload)
      return {
        ...state,
        admins: state.admins.filter(
          (admin: Admin) => admin.id !== action.payload
        ),
      };
    case "setAdmin":
      return {
        ...state,
        admins: state.admins.map((admin: Admin) =>
          admin.id === action.payload.id
            ? { ...admin, address: action.payload.address }
            : admin
        ),
      };

    default:
      return state;
  }
};

export default function Page() {
  const [state, dispatch] = useReducer(reducer, {
    spaceName: "",
    spaceIdentifier: "",
    spaceNameError: null,
    admins: [{ id: 0, address: null }],
  } as SpaceBuilderProps);

  const [spaceIdentifier, setSpaceIdentifier] = useState<string[] | null>(null);
  const [admins, setAdmins] = useState<string[]>([""]);

  const handleSubmit = () => {
    console.log(state);
  };

  useEffect(() => {}, [state.admins]);

  const updateSpaceIdentifier = (spaceName: string) => {
    setSpaceIdentifier([
      spaceName.replace(/ +/g, "-").toLowerCase(),
      spaceName.replace(/ +/g, "").toLowerCase(),
    ]);
  };

  return (
    <div className="flex w-6/12 bbackdrop-blur-md bg-black/30 text-white px-2 py-2 rounded-lg justify-center items-center ml-auto mr-auto">
      <div className=" flex flex-col gap-2 w-full max-w-xs">
        <div>
          <label className="label">
            <span className="label-text">Space Name</span>
          </label>
          <input
            type="text"
            autoComplete="off"
            onChange={(e) => {
              dispatch({
                type: "setSpaceName",
                payload: e.target.value,
              });
            }} // clear the error when the user starts typing
            placeholder="Nouns"
            className={`input input-bordered w-full max-w-xs ${
              state.spaceNameError ? "input-error" : "input-primary"
            }`}
          />
          {state.spaceNameError && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.spaceNameError}
              </span>
            </label>
          )}
        </div>
        {/*spaceIdentifier && (
            <div>
              <label htmlFor="identifier" className="label">
                <span className="label-text">Identifier</span>
              </label>

              <div className="bg-base">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    uplink.wtf / {spaceIdentifier[0]}
                  </span>
                  <input
                    id="idHyphen"
                    type="radio"
                    name="identifier"
                    className="radio checked:bg-red-500"
                    defaultChecked
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text">
                    uplink.wtf / {spaceIdentifier[1]}
                  </span>
                  <input
                    id="idSmoosh"
                    type="radio"
                    name="identifier"
                    className="radio checked:bg-blue-500"
                  />
                </label>
              </div>
            </div>
          )
          */}

        <label htmlFor="admins" className="label">
          <span className="label-text">Admins</span>
        </label>
        {state.admins.map((admin: Admin) => {
          return (
            <div key={admin.id} className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="nickdodson.eth"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) =>
                  dispatch({
                    type: "setAdmin",
                    payload: { id: admin.id, address: e.target.value },
                  })
                }
              />{" "}
              <button
                onClick={() => {
                  dispatch({ type: "removeAdmin", payload: admin.id });
                }}
                className="btn bg-transparent border-none"
              >
                <XCircleIcon className="w-8" />
              </button>
            </div>
          );
        })}
        <button
          className="btn"
          onClick={() => {
            dispatch({
              type: "addAdmin",
            });
          }}
        >
          add
        </button>

        <button className="btn" onClick={handleSubmit}>
          submit
        </button>
      </div>
    </div>
  );
}
