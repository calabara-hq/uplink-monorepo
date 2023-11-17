"use client"
import { handleMutationError } from "@/lib/handleMutationError";
import handleMediaUpload from "@/lib/mediaUpload";
import { useSession } from "@/providers/SessionProvider";
import { User } from "@/types/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useReducer, useRef } from "react";
import toast from "react-hot-toast";
import { HiUser } from "react-icons/hi2";
import { TbLoader2 } from "react-icons/tb";
import useSWRMutation from "swr/mutation";
import { z } from "zod";


const configurableUserSettings = z.object({
    profileAvatarUrl: z.string().min(1, { message: "profile picture is required" }),
    profileAvatarBlob: z.string(),
    displayName: z.string().min(3, { message: "display name must contain at least 3 characters" }).max(20, { message: "display name must not exceed 20 characters" }),
    visibleTwitter: z.boolean(),
})

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

type ConfigurableUserSettings = z.infer<typeof configurableUserSettings>;


const PFP = ({
    profileAvatarUrl,
    profileAvatarBlob,
    error,
    dispatch,
}: {
    profileAvatarUrl: string;
    profileAvatarBlob: string;
    error: Array<string>;
    dispatch: any;
}) => {
    const imageUploader = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label className="label">
                <span className="label-text">Profile Picture</span>
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
                        (mimeType) => { },
                        (base64) => {
                            dispatch({
                                type: "SET_FIELD",
                                payload: { field: "profileAvatarBlob", value: base64 },
                            });
                        },
                        (ipfsUrl) => {
                            dispatch({
                                type: "SET_FIELD",
                                payload: { field: "profileAvatarUrl", value: ipfsUrl },
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
                    {profileAvatarBlob && (
                        <Image src={profileAvatarBlob} alt="space avatar" fill />
                    )}
                    {!profileAvatarBlob && (
                        <div className="flex justify-center items-center w-full h-full">
                            <HiUser className="w-8 h-8" />
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <label className="label">
                    <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{error.join(",")}</span>
                </label>
            )}
        </div>
    );
};


const BasicInput = ({ value, label, placeholder, onChange, error, inputType }) => {
    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type={inputType}
                autoComplete="off"
                maxLength={20}
                onWheel={(e) => e.currentTarget.blur()}
                spellCheck="false"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input w-full max-w-xs ${error ? "input-error" : "input"
                    }`}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{error.join(",")}</span>
                </label>
            )}
        </div>
    )
}

const reducer = (
    state: ConfigurableUserSettings & { errors?: ZodSafeParseErrorFormat },
    action: any
) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: undefined }, // Clear error when field is set
            };
        case "SET_ERRORS":
            return { ...state, errors: action.payload };
        default:
            return state;
    }
}

const Toggle = ({
    defaultState,
    onSelectCallback,
}: {
    defaultState: boolean;
    onSelectCallback: (isSelected: boolean) => void;
}) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectCallback(e.target.checked);
    };
    return (
        <input
            type="checkbox"
            className="toggle toggle-success border-2"
            defaultChecked={defaultState}
            onChange={handleToggle}
        />
    );
};

const TwitterDisplayToggle = ({
    state,
    dispatch,
}: {
    state: ConfigurableUserSettings;
    dispatch: any;
}) => {

    return (
        <div className="flex w-full gap-2">
            <div className="flex flex-col w-full ">
                <p className="text-lg font-bold ">Show Twitter Handle</p>
                <p className="text-sm text-t2">
                    Different parts of uplink may collect your twitter handle. Should we display it publicly in your profile?
                </p>
            </div>
            <div className="ml-auto mt-auto mb-auto ">
                <Toggle
                    defaultState={state.visibleTwitter}
                    onSelectCallback={(isSelected) =>
                        dispatch({ type: "setDisplayTwitter", payload: isSelected })
                    }
                />
            </div>
        </div>
    );

}


const postUser = async (url,
    {
        arg,
    }: {
        url: string;
        arg: {
            displayName: string;
            profileAvatar: string;
            visibleTwitter: boolean;
            csrfToken: string;
        }
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation UpdateUser($displayName: String!, $profileAvatar: String!, $visibleTwitter: Boolean!){
                    updateUser(displayName: $displayName, profileAvatar: $profileAvatar, visibleTwitter: $visibleTwitter){
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                displayName: arg.displayName,
                profileAvatar: arg.profileAvatar,
                visibleTwitter: arg.visibleTwitter,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.updateUser);
}

const validateForm = (state: ConfigurableUserSettings, dispatch: any) => {
    const result = configurableUserSettings.safeParse(state);

    if (!result.success) {
        // Formatting errors and dispatching
        const formattedErrors = (result as z.SafeParseError<typeof configurableUserSettings>).error.format();
        console.log(formattedErrors)
        dispatch({
            type: "SET_ERRORS",
            payload: formattedErrors, // Pass the formatted errors directly
        });
    }

    return result;
}


const Settings = ({ user }: { user: User }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [state, dispatch] = useReducer(reducer, {
        profileAvatarUrl: user.profileAvatar || "",
        profileAvatarBlob: user.profileAvatar || "",
        displayName: user.displayName || "",
        visibleTwitter: user.visibleTwitter || true,
        errors: {}
    });

    const { trigger, data, error, isMutating, reset } = useSWRMutation(
        `/api/updateUser/${user.id}}`,
        postUser,
        {
            onError: (err) => {
                console.log(err);
                reset();
            },
        }
    );
    const onSubmit = async () => {
        const result = validateForm(state, dispatch);
        if (result.success) {

            console.log(result.data)

            try {
                trigger({
                    profileAvatar: result.data.profileAvatarUrl,
                    displayName: result.data.displayName,
                    visibleTwitter: result.data.visibleTwitter,
                    csrfToken: session.csrfToken,
                }).then((response) => {
                    console.log(response)
                    if (!response.success) {
                        reset();
                    }
                    toast.success('Profile updated!')
                    router.refresh();
                    router.push(`/user/${user.address}`);
                    return;
                });
            } catch (e) {
                console.log(e)
                reset();
            }

        }
    }

    if (status === 'loading') return <div>Loading...</div>
    if (status === 'authenticated') {
        if (session?.user?.address !== user.address) {
            return (
                <div>
                    <p>You are not the owner of this account</p>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 p-2">
                        <PFP
                            profileAvatarUrl={state.profileAvatarUrl}
                            profileAvatarBlob={state.profileAvatarBlob}
                            error={state.errors?.profileAvatarUrl?._errors}
                            dispatch={dispatch}
                        />
                        <BasicInput
                            value={state.displayName}
                            label="Display Name"
                            placeholder="Display Name"
                            onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "displayName", value: e.target.value } })}
                            error={state.errors?.displayName?._errors}
                            inputType="text"
                        />
                        <TwitterDisplayToggle state={state} dispatch={dispatch} />
                    </div>
                    <div className="h-0.5 w-full bg-base-100" />
                    <button onClick={onSubmit} className="btn btn-primary normal-case w-fit ml-auto">
                        {isMutating ?
                            <div className="flex gap-2 items-center">
                                <p className="text-sm">Saving</p>
                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                            </div>
                            : "Save"
                        }
                    </button>
                </div>
            )
        }
    }

}

export default Settings;