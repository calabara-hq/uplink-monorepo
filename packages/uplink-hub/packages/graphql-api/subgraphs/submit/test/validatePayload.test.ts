import { describe, expect, test, jest, afterEach, afterAll } from '@jest/globals';
import * as validateUtils from '../src/utils/validatePayload';
import { EditorOutputData } from 'lib';


describe('validate submission payload test suite', () => {
    describe('validateTitle', () => {

        test('should return error if title is too long', () => {
            const title = "a".repeat(100);
            const result = validateUtils.validateTitle(title);
            expect(result.error).toEqual("Title must be less than 50 characters");
        });

        test('should trim valid title', () => {
            const title = "  my new title  ";
            const result = validateUtils.validateTitle(title);
            expect(result.error).toBeUndefined();
            expect(result.result).toEqual("my new title");
        });
    })

    describe('validateBody', () => {

        test('should return nothing with null body', async () => {
            const result = await validateUtils.validateBody(null);
            expect(result).toBeUndefined();
        });

        test('should return error with empty body blocks', async () => {
            const body = {
                time: 1682628241526,
                blocks: [],
                version: "2.26.5"
            }
            const result = await validateUtils.validateBody(body);
            expect(result?.error).toEqual("Submission body blocks cannot be empty");
            expect(result?.result).toBeUndefined();
        });

        test('should return body with valid body', async () => {
            const body = {
                time: 1682628241526,
                blocks: [
                    {
                        id: "qZxrSG7bxL",
                        type: "paragraph",
                        data: {
                            text: "test"
                        }
                    }
                ],
                version: "2.26.5"
            };
            const result = await validateUtils.validateBody(body);
            expect(result?.result).toEqual(body);
            expect(result?.error).toBeUndefined();
        });
    })





    describe('composeSubmission', () => {

        describe('compose video submission', () => {
            test('should compose a valid video submission without body', async () => {
                const previewAsset = "https://ipfs/preview";
                const videoAsset = "https://ipfs/video";
                const result = await validateUtils.composeSubmission(previewAsset, videoAsset, null);
                expect(result.error).toBeUndefined();
                expect(result.result).toEqual({
                    template: "video",
                    videoAsset: videoAsset,
                    previewAsset: previewAsset,
                });
            })
            test('should compose a valid video submission with body', async () => {
                const previewAsset = "https://ipfs/preview";
                const videoAsset = "https://ipfs/video";
                const body = {
                    time: 1682628241526,
                    blocks: [
                        {
                            id: "qZxrSG7bxL",
                            type: "paragraph",
                            data: {
                                text: "test"
                            }
                        }
                    ],
                    version: "2.26.5"
                };
                const result = await validateUtils.composeSubmission(previewAsset, videoAsset, body);
                expect(result.error).toBeUndefined();
                expect(result.result).toEqual({
                    template: "video",
                    videoAsset: videoAsset,
                    previewAsset: previewAsset,
                    body: body
                });
            })
        })

        describe('compose image submission', () => {
            test('should compose a valid image submission without body', async () => {
                const previewAsset = "https://ipfs/preview";
                const result = await validateUtils.composeSubmission(previewAsset, null, null);
                expect(result.error).toBeUndefined();
                expect(result.result).toEqual({
                    template: "image",
                    previewAsset: previewAsset,
                });
            })
            test('should compose a valid image submission with body', async () => {
                const previewAsset = "https://ipfs/preview";
                const body = {
                    time: 1682628241526,
                    blocks: [
                        {
                            id: "qZxrSG7bxL",
                            type: "paragraph",
                            data: {
                                text: "test"
                            }
                        }
                    ],
                    version: "2.26.5"
                };
                const result = await validateUtils.composeSubmission(previewAsset, null, body);
                expect(result.error).toBeUndefined();
                expect(result.result).toEqual({
                    template: "image",
                    previewAsset: previewAsset,
                    body: body
                });
            })
        });

        describe('compose text submission', () => {
            test('should compose a valid text submission with body', async () => {
                const body = {
                    time: 1682628241526,
                    blocks: [
                        {
                            id: "qZxrSG7bxL",
                            type: "paragraph",
                            data: {
                                text: "test"
                            }
                        }
                    ],
                    version: "2.26.5"
                };
                const result = await validateUtils.composeSubmission(null, null, body);
                expect(result.error).toBeUndefined();
                expect(result.result).toEqual({
                    template: "text",
                    body: body
                });
            })
            test('should return error with empty body blocks', async () => {
                const result = await validateUtils.composeSubmission(null, null, { blocks: [] });
                expect(result.error).toEqual("Submission body blocks cannot be empty");
            })
        });

        test('should return error if all assets are missing', async () => {
            const result = await validateUtils.composeSubmission(null, null, null);
            expect(result.error).toEqual("Submission content is required");
        });

    });

})