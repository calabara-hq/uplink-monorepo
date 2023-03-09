"use client";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";

import {
  reducer,
  sanitizeSpaceData,
  SpaceBuilderProps,
  SpaceBuilderErrors,
  Admin,
} from "@/app/spacebuilder/data";

export default function Page() {
  const { data: session, status } = useSession();

  /*
  const [spaceIdentifier, setSpaceIdentifier] = useState<string[] | null>(null);
  const updateSpaceIdentifier = (spaceName: string) => {
    setSpaceIdentifier([
      spaceName.replace(/ +/g, "-").toLowerCase(),
      spaceName.replace(/ +/g, "").toLowerCase(),
    ]);
  };
  */
 
  const [state, dispatch] = useReducer(reducer, {
    spaceName: "",
    spaceIdentifier: "",
    website: "",
    twitter: "",
    admins: [
      { id: 0, address: session?.user?.address || "me" },
      { id: 1, address: "" },
    ],
    errors: {
      spaceNameError: null,
    },
  } as SpaceBuilderProps);

  const handleSubmit = () => {
    const result = sanitizeSpaceData(state);
    // bail early and flag the errors by setting the state
    if (result.isError)
      return dispatch({ type: "setErrors", payload: result.errors });

    // no errors. data is sanitzed and ready to be sent to the server
    console.log("no errors! here is your sanitized data: ", result.sanitized);
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
              state.errors.spaceNameError ? "input-error" : "input-primary"
            }`}
          />
          {state.errors.spaceNameError && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.errors.spaceNameError}
              </span>
            </label>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Website</span>
          </label>
          <input
            type="text"
            autoComplete="off"
            onChange={(e) => {
              dispatch({
                type: "setWebsite",
                payload: e.target.value,
              });
            }} // clear the error when the user starts typing
            placeholder="nouns.wtf"
            className={`input input-bordered w-full max-w-xs ${
              state.errors.websiteError ? "input-error" : "input-primary"
            }`}
          />
          {state.errors.websiteError && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.errors.websiteError}
              </span>
            </label>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Twitter</span>
          </label>
          <input
            type="text"
            autoComplete="off"
            onChange={(e) => {
              dispatch({
                type: "setTwitter",
                payload: e.target.value,
              });
            }} // clear the error when the user starts typing
            placeholder="@nounsdao"
            className={`input input-bordered w-full max-w-xs ${
              state.errors.twitterError ? "input-error" : "input-primary"
            }`}
          />
          {state.errors.twitterError && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.errors.twitterError}
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

        <label className="label">
          <span className="label-text">Admins</span>
        </label>
        {state.admins.map((admin: Admin) => {
          return (
            <div
              key={admin.id}
              className="flex justify-center items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  admin.id === 0
                    ? session?.user?.address || "me"
                    : "vitalik.eth"
                }
                className="input input-bordered w-full max-w-xs"
                disabled={admin.id === 0}
                onChange={(e) =>
                  dispatch({
                    type: "setAdmin",
                    payload: { id: admin.id, address: e.target.value },
                  })
                }
              />{" "}
              {admin.id > 0 && (
                <button
                  onClick={() => {
                    dispatch({ type: "removeAdmin", payload: admin.id });
                  }}
                  className="btn bg-transparent border-none"
                >
                  <XCircleIcon className="w-8" />
                </button>
              )}
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
