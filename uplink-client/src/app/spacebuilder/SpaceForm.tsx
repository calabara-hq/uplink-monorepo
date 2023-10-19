"use client";
import { startTransition, useRef, useState } from "react";
import { HiTrash, HiUser } from "react-icons/hi2";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import handleMediaUpload from "@/lib/mediaUpload";
import {
  reducer,
  SpaceBuilderProps,
  validateSpaceBuilderProps,
  createSpace,
  editSpace,
} from "@/app/spacebuilder/spaceHandler";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import WalletConnectButton from "../../ui/ConnectButton/WalletConnectButton";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { mutateSpaces } from "../mutate";
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
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating, reset } = useSWRMutation(
    isNewSpace
      ? `/api/createContest/${spaceId}`
      : `/api/editContest/${spaceId}`,
    isNewSpace ? createSpace : editSpace,
    {
      onError: (err) => {
        console.log(err);
        toast.error(
          "Oops, something went wrong. Please check the fields and try again."
        );
        reset();
      },
    }
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

  const onFormSubmit = async () => {
    const { isValid, values } = await validate();
    if (!isValid) return;

    try {
      await trigger({
        ...(!isNewSpace && { spaceId: spaceId }),
        spaceData: values,
        csrfToken: session.csrfToken,
      }).then(({ success, spaceName, errors }) => {
        if (success) {
          mutateSpaces(spaceName);
          toast.success(
            isNewSpace
              ? "Space created successfully!"
              : "Successfully saved your changes",
            {
              icon: "🚀",
            }
          );
          router.refresh();
          router.push(`/${spaceName}`);
        } else {
          // set the errors
          dispatch({
            type: "setErrors",
            payload: {
              ...(errors?.name && { name: errors.name }),
              ...(errors?.website && { website: errors.website }),
              ...(errors?.twitter && { twitter: errors.twitter }),
              ...(errors?.logoUrl && { logoUrl: errors.logoUrl }),
            },
          });
          toast.error(
            "Oops, something went wrong. Please check the fields and try again."
          );
        }
      });
    } catch (e) {
      reset();
    }
  };

  return (
    <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
      <div className="flex flex-col gap-2  w-full border-2 border-border p-6 rounded-xl shadow-box">
        <h2 className="text-3xl font-bold text-center">Space Builder</h2>
        <SpaceLogo state={state} dispatch={dispatch} />
        <SpaceName state={state} dispatch={dispatch} />
        <SpaceWebsite state={state} dispatch={dispatch} />
        <SpaceTwitter state={state} dispatch={dispatch} />
        <SpaceAdmins
          state={state}
          dispatch={dispatch}
          isNewSpace={isNewSpace}
        />
        <div className="p-2" />
        <WalletConnectButton styleOverride="w-full btn-primary">
          <button
            className="btn btn-primary normal-case"
            onClick={onFormSubmit}
            disabled={isMutating}
          >
            <div className="flex w-full items-center justify-center">
              Save
              {isMutating && (
                <div
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 ml-auto border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </div>
          </button>
        </WalletConnectButton>
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
          state.errors?.name ? "input-error" : "input"
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
            ["image", "svg"],
            (mimeType) => {},
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
          ).catch((err) => {
            return toast.error("couldn't upload your image");
          });
        }}
        ref={imageUploader}
      />
      <div className="avatar">
        <div
          className="relative w-28 h-28 rounded-full cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all"
          onClick={() => imageUploader.current?.click()}
        >
          {state.logoBlob && (
            <Image src={state.logoBlob} alt="space avatar" fill />
          )}
          {!state.logoBlob && (
            <div className="flex justify-center items-center w-full h-full">
              <HiUser className="w-8 h-8" />
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
          state.errors?.website ? "input-error" : "input"
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
          state.errors?.twitter ? "input-error" : "input"
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
  isNewSpace,
}: {
  state: SpaceBuilderProps;
  dispatch: any;
  isNewSpace: boolean;
}) => {
  return (
    <div className="">
      <label className="label">
        <span className="label-text">Admins</span>
      </label>
      <div className="flex flex-col gap-4">
        {state.admins.map((admin: string, index: number) => {
          return (
            <AdminRow
              key={index}
              isNewSpace={isNewSpace}
              error={state?.errors?.admins?.[index]}
              {...{ admin, index, dispatch }}
            />
          );
        })}
        <button
          className="btn btn-ghost underline w-fit normal-case"
          onClick={() => {
            dispatch({
              type: "addAdmin",
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

const AdminRow = ({
  error,
  dispatch,
  admin,
  index,
  isNewSpace,
}: {
  error: string;
  dispatch: any;
  admin: string;
  index: number;
  isNewSpace: boolean;
}) => {
  const { data: session, status } = useSession();

  // the user can never remove themself as an admin (if they are one)
  // on session change, check if the user is an admin. if they are, lock the row and set the address
  // if they aren't, unlock the row for editing

  const isLocked = isNewSpace
    ? index === 0
    : status === "authenticated"
    ? session?.user?.address === admin
    : true;

  // set the
  useEffect(() => {
    if (isNewSpace) {
      // set the session / address if the user is signed in and is an admin
      if (status === "authenticated" && admin === "you") {
        dispatch({
          type: "setAdmin",
          payload: {
            index: index,
            value: session?.user?.address,
          },
        });
      }
    }
  }, [status, session?.user?.address]);

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="vitalik.eth"
          spellCheck="false"
          className={`input w-full
        ${error ? "input-error" : "input"}`}
          disabled={isLocked}
          value={admin}
          onChange={(e) =>
            dispatch({
              type: "setAdmin",
              payload: { index: index, value: e.target.value },
            })
          }
        />
        {!isLocked && (
          <button
            onClick={() => {
              dispatch({ type: "removeAdmin", payload: index });
            }}
            className="btn btn-square btn-ghost"
          >
            <HiTrash className="w-6" />
          </button>
        )}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">invalid address</span>
        </label>
      )}
    </div>
  );
};
