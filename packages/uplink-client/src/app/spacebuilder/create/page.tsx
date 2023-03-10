"use client";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import { nanoid } from "nanoid";
import {
  CreateSpaceDocument,
  AllSpacesDocument,
} from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

import {
  reducer,
  sanitizeSpaceData,
  SpaceBuilderProps,
  Admin,
  createSpace,
} from "@/app/spacebuilder/data";



export default function Page() {
  const { data: session, status } = useSession();
  const userAddress = session?.user?.address || "you";

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
    spaceName: { value: "", error: null },
    spaceIdentifier: { value: "", error: null },
    website: { value: "", error: null },
    twitter: { value: "", error: null },
    admins: [
      { id: nanoid(), address: userAddress, error: null },
      { id: nanoid(), address: "", error: null },
    ],
  } as SpaceBuilderProps);

  const handleSubmit = async () => {
    const result = await createSpace(state);

    //sanitizeSpaceData(state);
    //console.log(result.spaceData);
    //dispatch({ type: "setTotalState", payload: result.spaceData });

    // bail early and flag the errors by setting the state
    /*
    if (result.isError) {
      //console.log("failed with errors", result.space);
      return dispatch({ type: "setTotalState", payload: result.spaceData });
    }

    // no errors. data is sanitzed and ready to be sent to the server
    console.log("no errors! here is your sanitized data: ", result.spaceData);
    */
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
            }}
            placeholder="Nouns"
            className={`input input-bordered w-full max-w-xs ${
              state.spaceName.error ? "input-error" : "input-primary"
            }`}
          />
          {state.spaceName.error && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.spaceName.error}
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
            }}
            placeholder="nouns.wtf"
            className={`input input-bordered w-full max-w-xs ${
              state.website.error ? "input-error" : "input-primary"
            }`}
          />
          {state.website.error && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.website.error}
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
            }}
            placeholder="@nounsdao"
            className={`input input-bordered w-full max-w-xs ${
              state.twitter.error ? "input-error" : "input-primary"
            }`}
          />
          {state.twitter.error && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.twitter.error}
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
        {state.admins.map((admin: Admin, index: number) => {
          return (
            <div key={admin.id}>
              <div className="flex justify-center items-center gap-2">
                <input
                  type="text"
                  placeholder={index === 0 ? userAddress : "vitalik.eth"}
                  className="input input-bordered w-full max-w-xs"
                  disabled={index === 0}
                  onChange={(e) =>
                    dispatch({
                      type: "setAdmin",
                      payload: { id: admin.id, address: e.target.value },
                    })
                  }
                />
                {index > 0 && (
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
              {admin.error && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {admin.error}
                  </span>
                </label>
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
