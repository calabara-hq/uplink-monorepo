import { SpaceBuilderProps, validateSpaceBuilderProps, reducer, validateSpaceAdmins, validateSpaceName, validateSpaceLogo, validateSpaceWebsite, validateSpaceTwitter } from '@/app/spacebuilder/spaceHandler';
import { describe, expect, test } from "@jest/globals";

const calabaraAddress = "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8"
const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

describe('Space Handler', () => {
    describe('Validate Space Name', () => {
        test('should fail with empty string', () => {
            const { error, value } = validateSpaceName('');
            expect(error).toEqual('Name is required');
            expect(value).toEqual('');
        })
        test('should fail with string too short', () => {
            const { error, value } = validateSpaceName('a'.repeat(2));
            expect(error).toEqual('Name must be at least 3 characters long');
            expect(value).toEqual('a'.repeat(2));
        })
        test('should fail with string too long', () => {
            const { error, value } = validateSpaceName('a'.repeat(31));
            expect(error).toEqual('Name must be less than 30 characters long');
            expect(value).toEqual('a'.repeat(31));
        })
        test('should fail with non-alphanumeric chars', () => {
            const name = 'test!';
            const { error, value } = validateSpaceName(name);
            expect(error).toEqual('Name must only contain alphanumeric characters and underscores');
            expect(value).toEqual(name);
        })
    })

    describe('Validate Space Logo', () => {
        test('should succeed with platform ipfs link', () => {
            const logo = 'https://uplink.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz';
            const { error, value } = validateSpaceLogo(logo);
            expect(error).toBeNull();
            expect(value).toEqual(logo);
        })

        test('should fail with invalid ipfs link', () => {
            const logo = 'https://google.com';
            const { error, value } = validateSpaceLogo(logo);
            expect(error).toEqual('Logo is not valid');
            expect(value).toEqual(logo);
        })


        test('should fail with empty string', () => {
            const logo = '';
            const { error, value } = validateSpaceLogo(logo);
            expect(error).toEqual('Logo is required');
            expect(value).toEqual(logo);
        })

    });

    describe('validate space website', () => {
        test('should succeed with valid website #1', () => {
            const website = 'https://google.com';
            const { error, value } = validateSpaceWebsite(website);
            expect(error).toBeNull();
            expect(value).toEqual(website);
        })

        test('should succeed with valid website #2', () => {
            const website = 'https://gnars.wtf';
            const { error, value } = validateSpaceWebsite(website);
            expect(error).toBeNull();
            expect(value).toEqual(website);
        })

        test('should succeed with valid website #3', () => {
            const website = 'nouns.wtf';
            const { error, value } = validateSpaceWebsite(website);
            expect(error).toBeNull();
            expect(value).toEqual(website);
        })

        test('should fail with invalid website', () => {
            const website = 'test';
            const { error, value } = validateSpaceWebsite(website);
            expect(error).toEqual('Website is not valid');
            expect(value).toEqual(website);
        });
    })

    describe('validate space twitter', () => {
        test('should succeed with valid twitter handle', () => {
            const twitter = '@calabara';
            const { error, value } = validateSpaceTwitter(twitter);
            expect(error).toBeNull();
            expect(value).toEqual(twitter);
        })

        test('should fail with invalid twitter handle', () => {
            const twitter = 'test';
            const { error, value } = validateSpaceTwitter(twitter);
            expect(error).toEqual('Twitter handle is not valid');
            expect(value).toEqual(twitter);
        })
    })


    describe('validate space admins', () => {

        test('should succeed with valid addresses', async () => {
            const admins = ['calabara.eth', 'vitalik.eth'];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, null])
            expect(value).toEqual([calabaraAddress, vitalikAddress])
        })

        test('should succeed and strip empty addresses', async () => {
            const admins = ['calabara.eth', ''];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null])
            expect(value).toEqual([calabaraAddress])
        })

        test('should strip empty addresses and return errors', async () => {
            const admins = ['calabara.eth', 'test', 'vitalik.eth', ''];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, 'invalid address', null])
            expect(value).toEqual([calabaraAddress, 'test', vitalikAddress])
        })

        test('should strip empty addresses, remove duplicates, and return error addresses', async () => {
            const admins = ['calabara.eth', 'test', 'vitalik.eth', '', 'vitalik.eth'];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, 'invalid address', null])
            expect(value).toEqual([calabaraAddress, 'test', vitalikAddress])
        })
    })


    describe('Validate Space Builder Props', () => {

        test('should return errors', async () => {
            const props: SpaceBuilderProps = {
                name: "",
                logoBlob: "",
                logoUrl: "",
                website: "",
                twitter: "",
                admins: [],
                errors: {
                    admins: [],
                },
            }

            const { isValid, errors, values } = await validateSpaceBuilderProps(props);
            expect(isValid).toBe(false);
            expect(errors).toEqual({
                name: "Name is required",
                logoUrl: "Logo is required",
                admins: []
            })
            expect(values).toEqual({
                name: "",
                logoUrl: "",
                admins: [],
            })
        })

        test('should return valid props', async () => {
            const props: SpaceBuilderProps = {
                name: "sample space",
                logoBlob: "asdf",
                logoUrl: "https://uplink.mypinata.cloud/ipfs/asdfasdf",
                website: "twitter.com",
                twitter: "@uplinkwtf",
                admins: [calabaraAddress, vitalikAddress],
                errors: {
                    admins: [],
                },
            }

            const { isValid, errors, values } = await validateSpaceBuilderProps(props);
            console.log(JSON.stringify(errors, null, 2))
            expect(isValid).toBe(true);
            expect(errors).toEqual({
                admins: [null, null]
            })
            expect(values).toEqual({
                name: "sample space",
                logoUrl: "https://uplink.mypinata.cloud/ipfs/asdfasdf",
                website: "twitter.com",
                twitter: "@uplinkwtf",
                admins: [calabaraAddress, vitalikAddress],
            })
        })

    });




})
