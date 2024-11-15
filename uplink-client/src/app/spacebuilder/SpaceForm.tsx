"use client";;
import { SpaceSettingsInput, SpaceSettingsOutput, SpaceSettingsStateT, useSpaceSettings } from "@/hooks/useSpaceReducer";
import { useSession } from "@/providers/SessionProvider";
import { Button } from "@/ui/DesignKit/Button";
import { FormInput } from "@/ui/DesignKit/Form";
import { Info } from "@/ui/DesignKit/Info";
import { Label } from "@/ui/DesignKit/Label";
import { AvatarUpload } from "@/ui/MediaUpload/AvatarUpload";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import useSWRMutation from "swr/mutation";
import { mutateSpaces } from "../mutate";
import toast from "react-hot-toast";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { useRouter } from "next/navigation";
import { insertSpace, InsertSpaceArgs } from "@/lib/fetch/insertSpace";
import { updateSpace, UpdateSpaceArgs } from "@/lib/fetch/updateSpace";


export const AdminRow = ({
    admins,
    setField,
    index,
    isNewSpace,
    error,
    onDeleteRow,
    onEditRow
}: {
    admins: string[];
    setField: any;
    index: number;
    isNewSpace: boolean;
    error?: string;
    onDeleteRow: () => void;
    onEditRow: (val: string) => void;
}) => {
    const { data: session, status } = useSession();

    // // the user can never remove themself as an admin (if they are one)
    // // on session change, check if the user is an admin. if they are, lock the row and set the address
    // // if they aren't, unlock the row for editing

    const isLocked = isNewSpace
        ? index === 0
        : status === "authenticated"
            ? session?.user?.address === admins[index]
            : true;

    useEffect(() => {
        if (isNewSpace) {
            // set the session / address if the user is signed in and is an admin
            if (status === "authenticated" && admins[index] === "you") {
                setField("admins", admins.map((a, i) => i === index ? session?.user?.address : a));
            }
        }
    }, [status, session?.user?.address]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <FormInput
                    inputType="text"
                    placeholder="vitalik.eth"
                    label={""}
                    error={error}
                    disabled={isLocked}
                    value={admins[index]}
                    onChange={(e) => onEditRow(e.target.value)}
                />
                {!isLocked && (
                    <Button variant="destructive" onClick={onDeleteRow}>
                        <HiTrash className="w-6" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export const SpaceForm = ({ initialState, spaceId }: { initialState: SpaceSettingsStateT, spaceId?: string }) => {
    const { data: session, status } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const isNewSpace = !spaceId;
    const {
        state,
        setField,
        validateSettings
    } = useSpaceSettings(initialState);

    const { trigger, error, isMutating, reset } = useSWRMutation(
        isNewSpace
            ? `/api/createSpace/${spaceId}`
            : `/api/editSpace/${spaceId}`,
        isNewSpace ? insertSpace : updateSpace,
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


    const onFormSubmit = async () => {
        const result = await validateSettings();
        if (!result.success) return toast.error("Oops, something went wrong. Please check the fields and try again.")

        try {
            await trigger({
                ...result.data,
                spaceId,
                csrfToken: session.csrfToken,
            }).then(({ success }) => {
                if (success) {
                    const spaceName = result.data.name.replace(' ', '').toLowerCase()
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
                    toast.error("Form submission failed. Please check the fields and try again.");
                    reset();
                }
            });
        } catch (e) {
            reset();
        }
    }

    return (
        <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
            <div className="flex flex-col gap-4  w-full border-2 border-border bg-base-100 p-6 rounded-xl">
                <h2 className="text-3xl font-bold">Space Builder</h2>

                {isNewSpace &&
                    <Info className="text-sm">
                        Spaces are like profiles for your organization, project, community, or yourself! After creating a space, you can create contests and mintboards inside of it.
                    </Info>
                }

                <AvatarUpload
                    fieldLabel={"Logo"}
                    initialData={state.logoUrl || ""}
                    acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
                    uploadStatusCallback={(status) => setIsUploading(status)}
                    ipfsImageCallback={(url) => {
                        if (url) {
                            setField("logoUrl", url)
                        }
                    }}
                    error={state.errors?.logoUrl?._errors}
                />

                <FormInput
                    inputType="text"
                    label="Name"
                    value={state.name}
                    placeholder={"Nouns"}
                    onChange={(e) => setField("name", e.target.value)}
                    error={state.errors?.name?._errors[0]}
                />

                <FormInput
                    inputType="text"
                    label="Website (optional)"
                    value={state.website}
                    placeholder={"nouns.wtf"}
                    onChange={(e) => setField("website", e.target.value)}
                    error={state.errors?.website?._errors[0]}
                />

                <div className="flex flex-col gap-2">
                    <Label>
                        Admins
                    </Label>
                    <Info className="text-sm">
                        Admins have the ability to create contests, mintboards, and manage the space settings.
                    </Info>
                    <div className="flex flex-col gap-2">
                        {state.admins.map((admin: string, index: number) => {
                            return (
                                <AdminRow
                                    key={index}
                                    index={index}
                                    admins={state.admins}
                                    isNewSpace={isNewSpace}
                                    setField={setField}
                                    error={state?.errors?.admins?.[index]?._errors?.[0]}
                                    onDeleteRow={() => {
                                        setField("admins", state.admins.filter((_, i) => i !== index));
                                    }}
                                    onEditRow={(val) => {
                                        setField("admins", state.admins.map((a, i) => i === index ? val : a));
                                    }}
                                />
                            );
                        })}
                        {state.errors?.admins?._errors && (
                            <Label>
                                <p className="text-error max-w-sm break-words">{state.errors?.admins?._errors.join(",")}</p>
                            </Label>
                        )}
                        <Button
                            variant="ghost"
                            className="w-fit"
                            onClick={() => {
                                setField("admins", [...state.admins, ""]);
                            }}
                        >
                            + Add
                        </Button>
                    </div>
                </div>



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