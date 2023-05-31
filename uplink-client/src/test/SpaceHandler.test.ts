import { SpaceBuilderProps, validateSpaceBuilderProps, reducer, validateSpaceAdmins, validateSpaceName, validateSpaceLogo, validateSpaceWebsite, validateSpaceTwitter } from '@/app/spacebuilder/spaceHandler';
import { describe, expect, test } from "@jest/globals";

const calabaraAddress = "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8"
const nickAddress = "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"

const baseState: SpaceBuilderProps = {
    name: '',
    logo_url: '',
    logo_blob: '',
    admins: [],
    errors: {
        admins: []
    }
}

describe('space handler reducer', () => {
    describe('website reducer', () => {
        test('should properly set website with string payload', () => {
            const action = { type: 'setWebsite', payload: 'test' }
            const newState = reducer(baseState, action)
            expect(newState.website).toEqual('test')
        })

        test('should properly clear website with empty string payload', () => {
            const initialState = { ...baseState, website: 'test' }
            const action = { type: 'setWebsite', payload: '' }
            const newState = reducer(initialState, action)
            expect(newState).toEqual(baseState)
        })
    })

    describe('twitter reducer', () => {
        test('should properly set twitter with string payload', () => {
            const action = { type: 'setTwitter', payload: 'test' }
            const newState = reducer(baseState, action)
            expect(newState.twitter).toEqual('test')
        })

        test('should properly clear twitter with empty string payload', () => {
            const initialState = { ...baseState, twitter: 'test' }
            const action = { type: 'setTwitter', payload: '' }
            const newState = reducer(initialState, action)
            expect(newState).toEqual(baseState)
        })
    })

    describe('admins reducer', () => {
        test('should properly add admin', () => {
            const action = { type: 'addAdmin' }
            const newState = reducer(baseState, action)
            expect(newState.admins).toEqual([''])
        })

        test('should properly remove admin', () => {
            const initialState = { ...baseState, admins: [calabaraAddress] }
            const action = { type: 'removeAdmin', payload: 0 }
            const newState = reducer(initialState, action)
            expect(newState.admins).toEqual([])
        })

        test('should properly setAdmin', () => {
            const initialState = { ...baseState, admins: [''] }
            const action = { type: 'setAdmin', payload: { index: 0, value: calabaraAddress } }
            const newState = reducer(initialState, action)
            expect(newState.admins).toEqual([calabaraAddress])
        })
    })
})

describe('space builder props validation', () => {
    describe('validate space name', () => {
        test('should succeed with standard string', () => {
            const name = 'test';
            const { error, value } = validateSpaceName(name);
            expect(error).toBeNull();
            expect(value).toEqual(name);
        })

        test('should succeed and trim string', () => {
            const name = '   test    ';
            const { error, value } = validateSpaceName(name);
            expect(error).toBeNull();
            expect(value).toEqual('test');
        })

        test('should fail with empty string', () => {
            const name = '';
            const { error, value } = validateSpaceName(name);
            expect(error).toEqual('Name is required');
            expect(value).toEqual(name);
        })

        test('should fail with string less than 3 characters', () => {
            const name = 'te';
            const { error, value } = validateSpaceName(name);
            expect(error).toEqual('Name must be at least 3 characters long');
            expect(value).toEqual(name);
        })

        test('should fail with string more than 30 characters', () => {
            const name = 'teasdfasdfasdflkjasdlkfjalskdjflaksjdflksdjf';
            const { error, value } = validateSpaceName(name);
            expect(error).toEqual('Name must be less than 30 characters long');
            expect(value).toEqual(name);
        })

        test('should fail non alphanumeric chars', () => {
            const name = 'test!';
            const { error, value } = validateSpaceName(name);
            expect(error).toEqual('Name must only contain alphanumeric characters and underscores');
            expect(value).toEqual(name);
        })

    })

    describe('validate space logo', () => {
        test('should succeed with platform ipfs link', () => {
            const logo = 'https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz';
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
            const admins = ['calabara.eth', 'nickdodson.eth'];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, null])
            expect(value).toEqual([calabaraAddress, nickAddress])
        })

        test('should succeed and strip empty addresses', async () => {
            const admins = ['calabara.eth', ''];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null])
            expect(value).toEqual([calabaraAddress])
        })

        test('should strip empty addresses and return errors', async () => {
            const admins = ['calabara.eth', 'test', 'nickdodson.eth', ''];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, 'invalid address', null])
            expect(value).toEqual([calabaraAddress, 'test', nickAddress])
        })

        test('should strip empty addresses, remove duplicates, and return error addresses', async () => {
            const admins = ['calabara.eth', 'test', 'nickdodson.eth', '', 'nickdodson.eth'];
            const { error, value } = await validateSpaceAdmins(admins);
            expect(error).toEqual([null, 'invalid address', null])
            expect(value).toEqual([calabaraAddress, 'test', nickAddress])
        })
    })
})




/*
    test('validate space builder props', async () => {
        const initialState: SpaceBuilderProps = {
            ens: '',
            name: 'nick',
            logo_url: 'https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz',
            logo_blob: '',
            website: '',
            twitter: '',
            admins: ['calabara.eth', 'nickdodson.eth'],
            errors: {
                ens: null,
                name: null,
                logo_url: null,
                website: null,
                twitter: null,
                admins: [],
            }
        }


        const { isValid, errors, values } = await validateSpaceBuilderProps(initialState);
        expect(isValid).toBe(false);
        expect(errors).toEqual({
            admins: [null, null]
        })
    })
    */