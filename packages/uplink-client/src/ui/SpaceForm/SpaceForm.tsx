"use client";
import { useRef, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import {
  CreateSpaceDocument,
  EditSpaceDocument,
  IsEnsValidDocument,
} from "@/lib/graphql/spaces.gql";
import graphqlClient, { stripTypenames } from "@/lib/graphql/initUrql";
import handleMediaUpload from "@/lib/mediaUpload";
import { reducer, SpaceBuilderProps } from "@/app/spacebuilder/spaceHandler";
import ConnectWithCallback from "../ConnectWithCallback/ConnectWithCallback";
import { useRouter } from "next/navigation";
import useHandleMutation from "@/hooks/useHandleMutation";
import toast from "react-hot-toast";
const postData = async ({
  state,
  isNewSpace,
}: {
  state: SpaceBuilderProps;
  isNewSpace: boolean;
}) => {
  const result = await graphqlClient
    .mutation(isNewSpace ? CreateSpaceDocument : EditSpaceDocument, {
      spaceData: {
        ens: state.ens,
        name: state.name,
        website: state.website,
        logo_url: state.logo_url,
        twitter: state.twitter,
        admins: state.admins,
      },
    })
    .toPromise();
  if (result.error) {
    throw new Error(result.error.message);
  }
  const { success, errors, spaceResponse } = stripTypenames(
    isNewSpace ? result.data.createSpace : result.data.editSpace
  );
  return {
    success,
    errors,
    spaceResponse,
  };
};

export default function SpaceForm({
  initialState,
  isNewSpace,
}: {
  initialState: SpaceBuilderProps;
  isNewSpace: boolean;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [progress, setProgress] = useState(isNewSpace ? 0 : 1);
  const router = useRouter();

  const handleMutation = useHandleMutation(
    isNewSpace ? CreateSpaceDocument : EditSpaceDocument
  );

  const onFormSubmit = async (state: SpaceBuilderProps) => {
    console.log(state);
    const result = await handleMutation({
      spaceData: {
        ens: state.ens,
        name: state.name,
        website: state.website,
        logo_url: state.logo_url,
        twitter: state.twitter,
        admins: state.admins,
      },
    });

    if (!result) return;

    const { errors, success, spaceResponse } = isNewSpace
      ? result.data.createSpace
      : result.data.editSpace;

    if (!success)
      toast.error(
        "Oops, something went wrong. Please check your inputs and try again."
      );

    // set the parsed data and errors

    dispatch({
      type: "setTotalState",
      payload: { ...spaceResponse, errors: errors },
    });

    if (success) {
      toast.success(
        isNewSpace
          ? "Space created successfully!"
          : "Successfully saved your changes",
        {
          icon: "🚀",
        }
      );
      router.refresh();
      router.push(`/space/${spaceResponse.id}`);
    }
  };

  const onEnsSubmit = async () => {
    const { ens } = state;
    const result = await graphqlClient
      .query(IsEnsValidDocument, { ens })
      .toPromise();
    if (result.error) throw new Error(result.error.message);
    const {
      success,
      errors,
      ens: ensResult,
    } = stripTypenames(result.data.isEnsValid);

    dispatch({
      type: "setTotalState",
      payload: { ens: ensResult, errors: { ...state.errors, ens: errors.ens } },
    });

    if (success) {
      dispatch({
        type: "setAdmin",
        payload: {
          index: 1,
          value: ensResult,
        }
      })
      setProgress(1);
    }
  };

  useEffect(() => {
    if (state.errors.ens) {
      setProgress(0);
    }
  }, [state.errors.ens]);

  if (progress === 0) {
    return (
      <div className="flex w-6/12 bbackdrop-blur-md bg-black/30 text-white px-2 py-2 rounded-lg justify-center items-center ml-auto mr-auto">
        <div className=" flex flex-col gap-2 w-full max-w-xs">
          <SpaceEns state={state} dispatch={dispatch} />
          <button
            className="btn"
            disabled={state.errors.ens}
            onClick={onEnsSubmit}
          >
            next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-6/12 bbackdrop-blur-md bg-black/30 text-white px-2 py-2 rounded-lg justify-center items-center ml-auto mr-auto">
      <div className=" flex flex-col gap-2 w-full max-w-xs">
        <SpaceName state={state} dispatch={dispatch} />
        <SpaceLogo state={state} dispatch={dispatch} />
        <SpaceWebsite state={state} dispatch={dispatch} />
        <SpaceTwitter state={state} dispatch={dispatch} />
        <SpaceAdmins state={state} dispatch={dispatch} />
        <ConnectWithCallback
          callback={() => {
            onFormSubmit(state);
          }}
          buttonLabel="submit"
        />
        <button
          onClick={() => {
            onFormSubmit(state);
          }}
        >
          test
        </button>
      </div>
    </div>
  );
}

const SpaceEns = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text">Ens</span>
      </label>
      <input
        type="text"
        autoComplete="off"
        value={state.ens}
        onChange={(e) => {
          dispatch({
            type: "setSpaceEns",
            payload: e.target.value,
          });
        }}
        placeholder="Nouns"
        className={`input input-bordered w-full max-w-xs ${
          state.errors.ens ? "input-error" : "input-primary"
        }`}
      />
      {state.errors.ens && (
        <label className="label">
          <span className="label-text-alt text-error">{state.errors.ens}</span>
        </label>
      )}
    </div>
  );
};

const SpaceName = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text">Space Name</span>
      </label>
      <input
        type="text"
        autoComplete="off"
        value={state.name}
        onChange={(e) => {
          dispatch({
            type: "setSpaceName",
            payload: e.target.value,
          });
        }}
        placeholder="Nouns"
        className={`input input-bordered w-full max-w-xs ${
          state.errors?.name ? "input-error" : "input-primary"
        }`}
      />
      {state.errors?.name && (
        <label className="label">
          <span className="label-text-alt text-error">{state.errors.name}</span>
        </label>
      )}
    </div>
  );
};

const SpaceLogo = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  const imageUploader = useRef(null);
  return (
    <div>
      <label className="label">
        <span className="label-text">Logo</span>
      </label>
      <input
        placeholder="Logo"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          handleMediaUpload(
            event,
            ["image"],
            (base64) => {
              dispatch({
                type: "setLogoBlob",
                payload: base64,
              });
            },
            (ipfsUrl) => {
              dispatch({
                type: "setLogoUrl",
                payload: ipfsUrl,
              });
            }
          );
        }}
        ref={imageUploader}
      />
      <div className="avatar">
        <div
          className="w-24 rounded-full cursor-pointer flex justify-center items-center"
          onClick={() => imageUploader.current.click()}
        >
          {state.logo_blob && <img src={state.logo_blob} />}
          {!state.logo_blob && (
            <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-500">
              <p>logo</p>
            </div>
          )}
        </div>
      </div>
      {state.errors?.logo_url && (
        <label className="label">
          <span className="label-text-alt text-error">
            {state.errors.logo_url}
          </span>
        </label>
      )}
    </div>
  );
};

const SpaceWebsite = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text">Website</span>
      </label>
      <input
        type="text"
        autoComplete="off"
        value={state.website}
        onChange={(e) => {
          dispatch({
            type: "setWebsite",
            payload: e.target.value,
          });
        }}
        placeholder="nouns.wtf"
        className={`input input-bordered w-full max-w-xs ${
          state.errors?.website ? "input-error" : "input-primary"
        }`}
      />
      {state.errors?.website && (
        <label className="label">
          <span className="label-text-alt text-error">
            {state.errors.website}
          </span>
        </label>
      )}
    </div>
  );
};

const SpaceTwitter = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text">Twitter</span>
      </label>
      <input
        type="text"
        autoComplete="off"
        value={state.twitter}
        onChange={(e) => {
          dispatch({
            type: "setTwitter",
            payload: e.target.value,
          });
        }}
        placeholder="@nounsdao"
        className={`input input-bordered w-full max-w-xs ${
          state.errors?.twitter ? "input-error" : "input-primary"
        }`}
      />
      {state.errors?.twitter && (
        <label className="label">
          <span className="label-text-alt text-error">
            {state.errors.twitter}
          </span>
        </label>
      )}
    </div>
  );
};

const SpaceAdmins = ({
  state,
  dispatch,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
}) => {
  const { data: session, status } = useSession();
  const userAddress = session?.user?.address || "you";
  useEffect(() => {
    if (status === "authenticated") {
      return dispatch({
        type: "setAdmin",
        payload: {
          index: 0,
          value: userAddress,
        },
      });
    }

    return dispatch({
      type: "setAdmin",
      payload: {
        index: 0,
        value: "you",
      },
    });
  }, [status]);
  return (
    <div>
      <label className="label">
        <span className="label-text">Admins</span>
      </label>
      {state.admins.map((admin: string, index: number) => {
        return (
          <div key={index}>
            <div className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="vitalik.eth"
                className="input input-bordered w-full max-w-xs disabled:text-gray-400"
                disabled={index < 2}
                value={admin}
                onChange={(e) =>
                  dispatch({
                    type: "setAdmin",
                    payload: { index: index, value: e.target.value },
                  })
                }
              />
              {index > 1 && (
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
            {state.errors?.admins && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {state.errors.admins[index]}
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
    </div>
  );
};
