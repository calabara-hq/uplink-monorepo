import { useStandardSubmissionCreator } from "@/hooks/useStandardSubmissionCreator";
import { describe, expect, test, beforeEach, afterEach, jest } from "@jest/globals";
import * as React from "react";
describe("studio submission validation", () => {



    let useReducerMock;

    // Mock state and dispatch
    const mockState = { /* your mock state here */ };
    const mockDispatch = jest.fn();

    beforeEach(() => {
        // Mock the useReducer hook
        useReducerMock = jest.spyOn(React, 'useReducer');
        useReducerMock.mockImplementation(() => [mockState, mockDispatch]);
    });

    afterEach(() => {
        // Cleanup after each test
        useReducerMock.mockClear();
    });

    const { validateSubmission } = useStandardSubmissionCreator();


    test('fail with empty title', () => {
        const submission = {
            title: "",
            primaryAssetUrl: "",
            videoThumbnailUrl: "",
            submissionBody: null
        }

        // const result = validateSubmission(submission);
        // expect(result).toEqual({
        //     isError: true,
        //     errors: {
        //         title: "Please provide a title"
        //     },
        // })

    })


    // test('fail with short title', () => {
    //     const submission = {
    //         title: "aa",
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: null
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: true,
    //         errors: {
    //             title: "Title must be at least 3 characters"
    //         },
    //     })
    // });
    // test('fail with long title', () => {
    //     const submission = {
    //         title: "a".repeat(101),
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: null
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: true,
    //         errors: {
    //             title: "Title must be less than 100 characters",
    //         },
    //     })
    // });
    // test('fail with empty content', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: null
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: true,
    //         errors: {
    //             type: "Please upload an image, video, or text",
    //         },
    //     })
    // })
    // test('fail without video thumbnail', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: null,
    //         isVideo: true
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: true,
    //         errors: {
    //             videoThumbnail: "Please choose a thumbnail for your video",
    //         },
    //     })
    // })
    // test('fail with empty text', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: {
    //             blocks: []
    //         },
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: true,
    //         errors: {
    //             submissionBody: "Please provide a submission body",
    //         },
    //     })
    // })


    // test('succeed with valid text submission', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "",
    //         videoThumbnailUrl: "",
    //         submissionBody: {
    //             blocks: [{
    //                 type: "paragraph",
    //                 data: {
    //                     text: "test"
    //                 }
    //             }]
    //         },
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: false,
    //         payload: {
    //             title: "aaaaaa",
    //             body: submission.submissionBody
    //         }
    //     })
    // });

    // test('succeed with valid image submission', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "https://example.com/image.png",
    //         videoThumbnailUrl: "",
    //         submissionBody: null,
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: false,
    //         payload: {
    //             title: "aaaaaa",
    //             previewAsset: submission.primaryAssetUrl
    //         }
    //     })
    // });

    // test('succeed with valid video submission', () => {
    //     const submission = {
    //         title: " aaaaaa ",
    //         primaryAssetUrl: "https://example.com/image.png",
    //         videoThumbnailUrl: "https://example.com/image.png",
    //         submissionBody: null,
    //         isVideo: true
    //     }

    //     const result = validateSubmission(submission);
    //     expect(result).toEqual({
    //         isError: false,
    //         payload: {
    //             title: "aaaaaa",
    //             previewAsset: submission.videoThumbnailUrl,
    //             videoAsset: submission.primaryAssetUrl
    //         }
    //     })
    // });

});