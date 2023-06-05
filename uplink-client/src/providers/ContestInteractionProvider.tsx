"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { OutputData } from "@editorjs/editorjs";

interface ContestInteractionContextProps {
  userSubmission: SubmissionBuilderProps;
  setSubmissionField: ({ field, value }: { field: string; value: any }) => void;
  setSubmissionErrors: ({ errors }: { errors: any }) => void;
  resetSubmission: () => void;
}

export interface SubmissionBuilderProps {
  title: string;
  primaryAssetUrl: string | null;
  primaryAssetBlob: string | null;
  videoThumbnailUrl: string | null;
  videoThumbnailBlob: string | null;
  isVideo: boolean;
  isUploading: boolean;
  submissionBody: OutputData | null;
  errors: {
    type?: string;
    title?: string;
    primaryAsset?: string;
    videoThumbnail?: string;
    submissionBody?: string;
  };
}

const createSubmissionInitialState: SubmissionBuilderProps = {
  title: "",
  primaryAssetUrl: null,
  primaryAssetBlob: null,
  videoThumbnailUrl: null,
  videoThumbnailBlob: null,
  isVideo: false,
  isUploading: false,
  submissionBody: null,
  errors: {},
};

const submissionReducer = (state: SubmissionBuilderProps, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        errors: {
          ...state.errors,
          [action.payload.field]: undefined,
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "RESET":
      return createSubmissionInitialState;
    default:
      return state;
  }
};

export const ContestInteractionContext = createContext<
  ContestInteractionContextProps | undefined
>(undefined);

export const ContestInteractionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userSubmission, setUserSubmission] = useReducer(
    submissionReducer,
    createSubmissionInitialState
  );

  useEffect(() => {
    // Return a cleanup function that is called when the component unmounts
    return () => {
      resetSubmission();
    };
  }, []);

  const setSubmissionField = ({
    field,
    value,
  }: {
    field: string;
    value: any;
  }) => {
    setUserSubmission({
      type: "SET_FIELD",
      payload: {
        field,
        value,
      },
    });
  };

  const setSubmissionErrors = ({ errors }: { errors: any }) => {
    setUserSubmission({
      type: "SET_ERRORS",
      payload: errors,
    });
  };

  const resetSubmission = () => {
    setUserSubmission({ type: "RESET" });
  };

  return (
    <ContestInteractionContext.Provider
      value={{
        userSubmission,
        setSubmissionField,
        setSubmissionErrors,
        resetSubmission,
      }}
    >
      {children}
    </ContestInteractionContext.Provider>
  );
};

export const useContestInteractionContext = () => {
  const context = useContext(ContestInteractionContext);
  if (!context) {
    throw new Error(
      "useContestInteractionContext must be used within a ContestInteractionProvider"
    );
  }
  return context;
};
