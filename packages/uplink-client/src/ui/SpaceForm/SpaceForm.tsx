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
import graphqlClient, { stripTypenames } from "@/lib/graphql/initUrql";

import {
  reducer,
  SpaceBuilderProps,
  FormField,
} from "@/app/spacebuilder/spaceHandler";

const createSpace = async (state: any) => {
  console.log(state);
  const result = await graphqlClient
    .mutation(CreateSpaceDocument, {
      spaceData: {
        name: state.name.value,
        website: state.website.value,
        twitter: state.twitter.value,
        admins: state.admins.map((admin: FormField) => admin.value),
      },
    })
    .toPromise();
  if (result.error) {
    throw new Error(result.error.message);
  }
  const { success, spaceResponse } = stripTypenames(result.data.createSpace);
  return {
    success,
    spaceResponse,
  };
};

export default function SpaceForm() {
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
    name: { value: "", error: null },
    systemName: { value: "", error: null },
    website: { value: "", error: null },
    twitter: { value: "", error: null },
    admins: [
      { value: userAddress, error: null },
      { value: "", error: null },
    ],
  } as SpaceBuilderProps);

  const handleSubmit = async () => {
    const { success, spaceResponse } = await createSpace(state);
    dispatch({ type: "setTotalState", payload: spaceResponse });
    if (!success) {
      return;
    }

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
            value={state.name.value}
            onChange={(e) => {
              dispatch({
                type: "setSpaceName",
                payload: e.target.value,
              });
            }}
            placeholder="Nouns"
            className={`input input-bordered w-full max-w-xs ${
              state.name.error ? "input-error" : "input-primary"
            }`}
          />
          {state.name.error && (
            <label className="label">
              <span className="label-text-alt text-error">
                {state.name.error}
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
            value={state.website.value}
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
            value={state.twitter.value}
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
        {state.admins.map((admin: FormField, index: number) => {
          return (
            <div key={index}>
              <div className="flex justify-center items-center gap-2">
                <input
                  type="text"
                  placeholder={index === 0 ? userAddress : "vitalik.eth"}
                  className="input input-bordered w-full max-w-xs"
                  disabled={index === 0}
                  value={admin.value}
                  onChange={(e) =>
                    dispatch({
                      type: "setAdmin",
                      payload: { index: index, value: e.target.value },
                    })
                  }
                />
                {index > 0 && (
                  <button
                    onClick={() => {
                      dispatch({ type: "removeAdmin", payload: index });
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
