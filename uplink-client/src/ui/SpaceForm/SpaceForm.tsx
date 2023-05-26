"use client";
import { useRef, useState } from "react";
import { XCircleIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import {
  CreateSpaceDocument,
  EditSpaceDocument,
  IsEnsValidDocument,
} from "@/lib/graphql/spaces.gql";
import graphqlClient, { stripTypenames } from "@/lib/graphql/initUrql";
import handleMediaUpload from "@/lib/mediaUpload";
import {
  reducer,
  SpaceBuilderProps,
  validateSpaceBuilderProps,
} from "@/app/spacebuilder/spaceHandler";
import ConnectWithCallback from "../ConnectWithCallback/ConnectWithCallback";
import { useRouter } from "next/navigation";
import useHandleMutation from "@/hooks/useHandleMutation";
import toast from "react-hot-toast";

export default function SpaceForm({
  initialState,
  isNewSpace,
  spaceId,
}: {
  initialState: SpaceBuilderProps;
  isNewSpace: boolean;
  spaceId?: string;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleMutation = useHandleMutation(
    isNewSpace ? CreateSpaceDocument : EditSpaceDocument
  );

  const validate = async () => {
    const result = await validateSpaceBuilderProps(state);

    if (!result.isValid) {
      dispatch({
        type: "setTotalState",
        payload: { spaceBuilderData: result.values, errors: result.errors },
      });
    }

    return result;
  };

  const onFormSubmit = async (state: SpaceBuilderProps) => {
    const { isValid, values } = await validate();
    if (!isValid) return;

    const result = await handleMutation({
      spaceData: values,
      spaceId,
    });

    if (!result) return;

    const { errors, success, spaceName } = isNewSpace
      ? result.data.createSpace
      : result.data.editSpace;

    if (!success) {
      toast.error(
        "Oops, something went wrong. Please check the fields and try again."
      );
      // set any errors that came from the server

      dispatch({
        type: "setErrors",
        payload: {
          ...(errors?.name && { name: errors.name }),
          ...(errors?.website && { website: errors.website }),
          ...(errors?.twitter && { twitter: errors.twitter }),
          ...(errors?.logoUrl && { logoUrl: errors.logoUrl }),
        },
      });
    }

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
      router.push(`/space/${spaceName}`);
    }
  };

  return (
    <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
      <div className="flex flex-col gap-2  w-full lg:w-2/5">
        <h2 className="text-3xl text-center">Space Builder</h2>
        <SpaceLogo state={state} dispatch={dispatch} />
        <SpaceName state={state} dispatch={dispatch} />
        <SpaceWebsite state={state} dispatch={dispatch} />
        <SpaceTwitter state={state} dispatch={dispatch} />
        <SpaceAdmins state={state} dispatch={dispatch} />
        <div className="p-2" />
        <ConnectWithCallback
          callback={() => {
            onFormSubmit(state);
          }}
          buttonLabel="submit"
        />
      </div>
    </div>
  );
}

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
        spellCheck="false"
        value={state.name}
        onChange={(e) => {
          dispatch({
            type: "setSpaceName",
            payload: e.target.value,
          });
        }}
        placeholder="Nouns"
        className={`input w-full max-w-xs ${
          state.errors?.name ? "input-error" : "input focus:shadow-box"
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
  const imageUploader = useRef<HTMLInputElement>(null);
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
          className="w-28 h-28 rounded-full cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all"
          onClick={() => imageUploader.current?.click()}
        >
          {state.logoBlob && <img src={state.logoBlob} />}
          {!state.logoBlob && (
            <div className="flex justify-center items-center w-full h-full">
              <UserIcon className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
      {state.errors?.logoUrl && (
        <label className="label">
          <span className="label-text-alt text-error">
            {state.errors.logoUrl}
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
        spellCheck="false"
        value={state.website || ""}
        onChange={(e) => {
          dispatch({
            type: "setWebsite",
            payload: e.target.value,
          });
        }}
        placeholder="nouns.wtf"
        className={`input w-full max-w-xs ${
          state.errors?.website ? "input-error" : "input focus:shadow-box"
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
        spellCheck="false"
        value={state.twitter || ""}
        onChange={(e) => {
          dispatch({
            type: "setTwitter",
            payload: e.target.value,
          });
        }}
        placeholder="@nounsdao"
        className={`input w-full max-w-xs ${
          state.errors?.twitter ? "input-error" : "input focus:shadow-box"
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
    <div className="">
      <label className="label">
        <span className="label-text">Admins</span>
      </label>
      <div className="flex flex-col gap-4">
        {state.admins.map((admin: string, index: number) => {
          const isError = state.errors?.admins?.[index];
          return (
            <div key={index}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="vitalik.eth"
                  spellCheck="false"
                  className={`input w-full disabled:text-gray-400
                ${isError ? "input-error" : "input focus:shadow-box"}`}
                  disabled={index < 1}
                  value={admin}
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
                    className="btn btn-square btn-ghost"
                  >
                    <TrashIcon className="w-6" />
                  </button>
                )}
              </div>
              {isError && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    invalid address
                  </span>
                </label>
              )}
            </div>
          );
        })}
        <button
          className="btn btn-accent btn-outline w-fit"
          onClick={() => {
            dispatch({
              type: "addAdmin",
            });
          }}
        >
          add
        </button>
      </div>
    </div>
  );
};

const AdminInput = ({
  state,
  dispatch,
  index,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
  index: number;
}) => {};
