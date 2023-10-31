import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { ZodError } from 'zod';
import { validateStandardSubmissionPayload, validateTwitterSubmissionPayload } from '../src/utils/validate.js'
import { TwitterSubmissionPayload } from '../src/__generated__/resolvers-types.js';

const sampleStdSubmission = {
    title: "test",
    previewAsset: "https://ipfs/preview",
    videoAsset: "https://ipfs/video",
    body: {
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
    }
}

const sampleTwitterSubmission = {
    title: "test",
    thread: [
        {
            text: "test",
            previewAsset: "https://ipfs/preview",
            videoAsset: "https://ipfs/video",
            assetType: "video/mp4",
            assetSize: 100,
        },
        {
            text: "test",
            previewAsset: "https://ipfs/preview",
            videoAsset: null,
            assetType: "image/png",
            assetSize: 100,
        }
    ]
}


describe("Standard submission validation", () => {

    test("fail with null title", () => {
        const submission = {
            ...sampleStdSubmission,
            title: null,
        };

        assert.throws(() => validateStandardSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be a string"]
            )
            assert(err instanceof ZodError);
            return true;
        })

    })

    test("fail with title too long", () => {
        const submission = {
            ...sampleStdSubmission,
            title: "test".repeat(100),
        };

        assert.throws(() => validateStandardSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be less than 100 characters long"]
            )
            assert(err instanceof ZodError);
            return true;
        })

    })

    test("fail with no content", () => {
        const submission = {
            ...sampleStdSubmission,
            previewAsset: null,
            videoAsset: null,
            body: null,
        };

        assert.throws(() => validateStandardSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Submission content is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail without video thumbnail", () => {
        const submission = {
            ...sampleStdSubmission,
            previewAsset: null,
            videoAsset: "https://ipfs/video",
            body: null,
        };

        assert.throws(() => validateStandardSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Video thumbnail is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    });

    test("fail with empty body blocks", () => {
        const submission = {
            ...sampleStdSubmission,
            body: {
                ...sampleStdSubmission.body,
                blocks: [],
            }
        }

        assert.throws(() => validateStandardSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Submission body blocks cannot be empty"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    });

    test("pass with valid video submission", () => {
        const result = validateStandardSubmissionPayload(sampleStdSubmission);
        assert.deepEqual(result, { ...sampleStdSubmission, type: 'video' })
    });

    test("pass with valid image submission", () => {
        const submission = {
            ...sampleStdSubmission,
            videoAsset: null,
        }

        const expected = {
            type: 'image',
            previewAsset: sampleStdSubmission.previewAsset,
            body: sampleStdSubmission.body,
            title: sampleStdSubmission.title,
        }

        const result = validateStandardSubmissionPayload(submission);
        assert.deepEqual(result, expected)
    });

    test("pass with valid text submission", () => {
        const submission = {
            ...sampleStdSubmission,
            videoAsset: null,
            previewAsset: null,
        }

        const expected = {
            type: 'text',
            body: sampleStdSubmission.body,
            title: sampleStdSubmission.title,
        }

        const result = validateStandardSubmissionPayload(submission);
        assert.deepEqual(result, expected)
    });
})



describe("Twitter submission validation", () => {
    test("fail with null title", () => {
        const submission = {
            ...sampleTwitterSubmission,
            title: null,
        }

        assert.throws(() => validateTwitterSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be a string"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail with title too long", () => {
        const submission = {
            ...sampleTwitterSubmission,
            title: "test".repeat(100),
        }

        assert.throws(() => validateTwitterSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be less than 100 characters long"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail with no content", () => {
        const submission = {
            ...sampleTwitterSubmission,
            thread: [],
        }

        assert.throws(() => validateTwitterSubmissionPayload(submission as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Submission content is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail with single empty thread item", () => {
        const submission: TwitterSubmissionPayload = {
            title: "demo",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: "https://ipfs/video",
                    assetType: "video/mp4",
                    assetSize: 100,
                },
                {
                    text: null,
                    previewAsset: null,
                    videoAsset: null,
                    assetType: null,
                    assetSize: null,
                }
            ]
        }
        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[1]._errors,
                ["Thread item content is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail without video thumbnail", () => {
        const submission: TwitterSubmissionPayload = {
            title: "test video thumbnail",
            thread: [
                {
                    text: "test",
                    previewAsset: null,
                    videoAsset: "https://ipfs/video",
                    assetType: "video/mp4",
                    assetSize: 100,
                },
            ]
        }

        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[0]._errors,
                ["Video thumbnail is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail video without asset type", () => {
        const submission: TwitterSubmissionPayload = {
            title: "demo",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: "https://ipfs/video",
                    assetType: null,
                    assetSize: 100,
                },
            ]
        }
        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[0]._errors,
                ["Asset type is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail video without asset size", () => {
        const submission: TwitterSubmissionPayload = {
            title: "demo",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: "https://ipfs/video",
                    assetType: "video/mp4",
                    assetSize: null,
                },
            ]
        }
        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[0]._errors,
                ["Asset size is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail image without asset type", () => {
        const submission: TwitterSubmissionPayload = {
            title: "demo",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: null,
                    assetType: null,
                    assetSize: 100,
                },
            ]
        }
        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[0]._errors,
                ["Asset type is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
    test("fail image without asset size", () => {
        const submission: TwitterSubmissionPayload = {
            title: "demo",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: null,
                    assetType: "image/png",
                    assetSize: null,
                },
            ]
        }
        assert.throws(() => validateTwitterSubmissionPayload(submission), (err: any) => {
            assert.deepEqual(err.format().thread[0]._errors,
                ["Asset size is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("pass with valid video submission", () => {
        const submission = {
            title: "test",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: "https://ipfs/video",
                    assetType: "video/mp4",
                    assetSize: 100,
                },
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: null,
                    assetType: "image/png",
                    assetSize: 100,
                }
            ]
        }

        const expected = {
            title: "test",
            type: 'video',
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: "https://ipfs/video",
                    assetType: "video/mp4",
                    assetSize: 100,
                },
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    assetType: "image/png",
                    assetSize: 100,
                }
            ]
        }

        const result = validateTwitterSubmissionPayload(submission);
        assert.deepEqual(result, expected)

    })
    test("pass with valid image submission", () => {
        const submission = {
            title: "test",
            thread: [
                {
                    text: "test",
                    previewAsset: "https://ipfs/preview",
                    videoAsset: null,
                    assetType: "image/jpg",
                    assetSize: 100,
                },
            ]
        }

        const expected = {
            title: "test",
            type: 'image',
            thread: [
                {
                    previewAsset: "https://ipfs/preview",
                    text: "test",
                    assetType: "image/jpg",
                    assetSize: 100,
                },
            ],
        }

        const result = validateTwitterSubmissionPayload(submission);
        assert.deepEqual(result, expected)

    })

    test("pass with valid text submission", () => {
        const submission = {
            title: "test",
            thread: [
                {
                    text: "test",
                    previewAsset: null,
                    videoAsset: null,
                    assetType: null,
                    assetSize: null,
                },
            ]
        }

        const expected = {
            title: "test",
            type: 'text',
            thread: [
                {
                    text: "test",
                },
            ],
        }

        const result = validateTwitterSubmissionPayload(submission);
        assert.deepEqual(result, expected)
    })

});