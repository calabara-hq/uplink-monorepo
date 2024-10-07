"use client";;
import { useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { useReducer, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
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
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { mutateSpaces } from "../mutate";
import { AvatarUpload } from "@/ui/MediaUpload/AvatarUpload";
import { Label } from "@/ui/DesignKit/Label";
import { Input } from "@/ui/DesignKit/Input";
import { Button } from "@/ui/DesignKit/Button";
import { Info } from "@/ui/DesignKit/Info";

export default function SpaceForm({
  initialState,
  isNewSpace,
  referral,
  spaceId,
}: {
  initialState: SpaceBuilderProps;
  isNewSpace: boolean;
  referral?: string;
  spaceId?: string;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const [isUploading, setIsUploading] = useState(false);
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
      <div className="flex flex-col gap-4  w-full border-2 border-border bg-base-100 p-6 rounded-xl">
        <h2 className="text-3xl font-bold">Space Builder</h2>
        {referral === 'home' && (
          <Info className="text-sm">
            Spaces are like profiles for your organization, project, community, or yourself! After creating a space, you can create contests and mintboards inside of it.
          </Info>
        )}


        <AvatarUpload
          fieldLabel={"Logo"}
          initialData={state.logoBlob || ""}
          acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
          uploadStatusCallback={(status) => setIsUploading(status)}
          ipfsImageCallback={(url) => {
            if (url) {
              dispatch({
                type: "setLogoUrl",
                payload: url,
              })
            }
          }}
          error={state.errors.logoUrl}
        />
        <SpaceName state={state} dispatch={dispatch} />
        <SpaceWebsite state={state} dispatch={dispatch} />
        {/* <SpaceTwitter state={state} dispatch={dispatch} /> */}
        <SpaceAdmins
          state={state}
          dispatch={dispatch}
          isNewSpace={isNewSpace}
        />
        <div className="p-2" />
        <WalletConnectButton>
          <Button
            onClick={onFormSubmit}
            disabled={isMutating || isUploading}
          >
            <div className="flex w-full items-center justify-center">
              Save
              {isMutating || isUploading && (
                <div
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 ml-auto border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </div>
          </Button>
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
    <div className="flex flex-col gap-2">
      <Label>Space Name</Label>
      <Input
        variant={state.errors?.name ? "error" : "outline"}
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
        className="max-w-xs"
      />
      {state.errors?.name && (
        <Label>
          <p className="text-error">{state.errors.name}</p>
        </Label>
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
    <div className="flex flex-col gap-2">
      <Label>
        {`Website (optional)`}
      </Label>
      <Input
        type="text"
        variant={state.errors?.website ? "error" : "outline"}
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
        className="max-w-xs"
      />
      {state.errors?.website && (
        <Label>
          <p className="text-error">
            {state.errors.website}
          </p>
        </Label>
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
    <div className="flex flex-col gap-2">
      <Label>
        Twitter
      </Label>
      <Input
        type="text"
        variant={state.errors?.twitter ? "error" : "outline"}
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
        className="max-w-xs"
      />
      {state.errors?.twitter && (
        <Label>
          <p className="text-error">
            {state.errors.twitter}
          </p>
        </Label>
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
    <div className="flex flex-col gap-2">
      <Label>
        Admins
      </Label>
      <div className="flex flex-col gap-2">
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
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => {
            dispatch({
              type: "addAdmin",
            });
          }}
        >
          + Add
        </Button>
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
        <Input
          type="text"
          variant={error ? "error" : "outline"}
          placeholder="vitalik.eth"
          spellCheck="false"
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
          <Button
            variant="destructive"
            onClick={() => {
              dispatch({ type: "removeAdmin", payload: index });
            }}

          >
            <HiTrash className="w-6" />
          </Button>
        )}
      </div>
      {error && (
        <Label>
          <span className="text-error">invalid address</span>
        </Label>
      )}
    </div>
  );
};
