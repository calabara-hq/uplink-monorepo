import { describe, expect, test, jest, beforeEach, beforeAll } from '@jest/globals';
import {
    validateSpaceName,
    validateSpaceLogo,
    validateSpaceAdmins,
    validateSpaceWebsite,
    validateSpaceTwitter,
} from '../src/utils/validateFormData';

import { db } from "lib";





// space name

describe('validateSpaceName', () => {

    describe('new space mode', () => {

        let mockFindMany;

        beforeAll(() => {
            // TODO - upgrade this for drizzle
            //mockFindMany = jest.spyOn(_prismaClient.space, 'findMany');
        });

        beforeEach(() => {
            mockFindMany.mockClear();
            mockFindMany.mockImplementation(async () => []);
        });

        test('should return error if name is empty string', async () => {
            const { value, error } = await validateSpaceName('');
            expect(error).toBe('Name is required');
            expect(value).toBe('');
        });

        test('should return error if name is null', async () => {
            const { value, error } = await validateSpaceName(null as any);
            expect(error).toBe('Name is required');
            expect(value).toBeUndefined();
        });
        test('should return error if name is < 3 characters', async () => {
            const { value, error } = await validateSpaceName('ab');
            expect(error).toBe('Name must be at least 3 characters');
            expect(value).toBe('ab');
        });
        test('should return error if name is too long', async () => {
            const { value, error } = await validateSpaceName('a'.repeat(31));
            expect(error).toBe('Name must be less than 30 characters');
            expect(value).toBe('a'.repeat(31));
        });

        test('should return error if non alphanumeric', async () => {
            const { value, error } = await validateSpaceName('aasdf!!@');
            expect(error).toBe('Name must only contain alphanumeric characters and underscores');
            expect(value).toBe('aasdf!!@');
        });

        test('should pass validation #1', async () => {
            const { value, error } = await validateSpaceName('nouns');
            expect(error).toBeUndefined();
            expect(value).toBe('nouns');
        });
        test('should pass validation #2', async () => {
            const { value, error } = await validateSpaceName('  nouns  ');
            expect(error).toBeUndefined();
            expect(value).toBe('nouns');
        });

    });

    describe('edit space mode', () => {

        let mockFindMany;

        beforeAll(() => {
            // TODO - upgrade this for drizzle
            // mockFindMany = jest.spyOn(_prismaClient.space, 'findMany');
        });

        beforeEach(() => {
            mockFindMany.mockClear();
        });

        test('should return error if name is already taken and id is not the same', async () => {
            const name = 'sharkdao';
            mockFindMany.mockImplementation(async () => [{ id: 1, name: name }]);
            const { value, error } = await validateSpaceName(name, "2");
            expect(error).toBe('Name is already taken');
            expect(value).toBe(name);
        });

        test('should succeed if name is take and id is the same', async () => {
            const name = 'sharkdao';
            mockFindMany.mockImplementation(async () => []);
            const { value, error } = await validateSpaceName(name, "2");
            expect(error).toBeUndefined();
            expect(value).toBe(name);
        });
    })

});

// logo

describe('validateSpaceLogo', () => {
    test('should return error if logo is empty string', () => {
        const { error, value } = validateSpaceLogo('');
        expect(error).toBe('Logo is required');
        expect(value).toBe('');
    });
    test('should return error if logo is null', () => {
        const { error, value } = validateSpaceLogo(null as any);
        expect(error).toBe('Logo is required');
        expect(value).toBeUndefined();
    });
    test('should return error if logo is not ipfs', () => {
        const { error, value } = validateSpaceLogo('https://google.com');
        expect(error).toBe('Logo is not valid');
        expect(value).toBe('https://google.com');
    });
    test('should pass validation #1', () => {
        const { error, value } = validateSpaceLogo('https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4');
        expect(error).toBeUndefined();
        expect(value).toBe('https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4')
    });
    test('should pass validation #2', () => {
        const { error, value } = validateSpaceLogo('    https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4     ');
        expect(error).toBeUndefined();
        expect(value).toBe('https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4')
    });



});

// website

describe('validateSpaceWebsite', () => {

    test('should ignore entry if website is empty string', () => {
        const { error, value } = validateSpaceWebsite('');
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should ignore entry if website is null', () => {
        const { error, value } = validateSpaceWebsite(null as any);
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should ignore entry if website is undefined', () => {
        const { error, value } = validateSpaceWebsite(undefined);
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should fail validation #1', () => {
        const { error, value } = validateSpaceWebsite('calabara');
        expect(error).toBe("Website is not valid");
        expect(value).toBeUndefined();
    });

    test('should fail validation #2', () => {
        const { error, value } = validateSpaceWebsite('https://nouns');
        expect(error).toBe("Website is not valid");
        expect(value).toBeUndefined();
    });

    test('should pass validation #1', () => {
        const { error, value } = validateSpaceWebsite('calabara.com');
        expect(error).toBeUndefined();
        expect(value).toBe('calabara.com');
    });

    test('should pass validation #2', () => {
        const { error, value } = validateSpaceWebsite('nouns.wtf');
        expect(error).toBeUndefined();
        expect(value).toBe('nouns.wtf');
    });

    test('should pass validation #3', () => {
        const { error, value } = validateSpaceWebsite('https://uplink.wtf');
        expect(error).toBeUndefined();
        expect(value).toBe('https://uplink.wtf');
    });

    test('should pass validation #4', () => {
        const { error, value } = validateSpaceWebsite('http://nouns.com');
        expect(error).toBeUndefined();
        expect(value).toBe('http://nouns.com');
    });
});



// twitter 

describe('validateSpaceTwitter', () => {
    test('should ignore entry if twitter is null', () => {
        const { error, value } = validateSpaceTwitter(null as any);
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should ignore entry if twitter is empty string', () => {
        const { error, value } = validateSpaceTwitter('');
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should ignore entry if twitter is undefined', () => {
        const { error, value } = validateSpaceTwitter(undefined);
        expect(error).toBeUndefined();
        expect(value).toBeUndefined();
    });

    test('should fail validation #1', () => {
        const { error, value } = validateSpaceTwitter("nick");
        expect(error).toBe("Twitter handle is not valid");
        expect(value).toBeUndefined();
    });

    test('should fail validation #1', () => {
        const { error, value } = validateSpaceTwitter("@ni-)ck");
        expect(error).toBe("Twitter handle is not valid");
        expect(value).toBeUndefined();
    });

    test('should pass validation #1', () => {
        const { error, value } = validateSpaceTwitter("@nick");
        expect(error).toBeUndefined();
        expect(value).toBe('@nick');
    });

    test('should pass validation #2', () => {
        const { error, value } = validateSpaceTwitter("@calabarahq");
        expect(error).toBeUndefined();
        expect(value).toBe('@calabarahq');
    });

    test('should pass validation #3', () => {
        const { error, value } = validateSpaceTwitter("  @calabarahq  ");
        expect(error).toBeUndefined();
        expect(value).toBe('@calabarahq');
    });
})

// admins

const calabaraAddress = "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8"
const nickAddress = "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"

describe('validateSpaceAdmins', () => {
    test('should return error if passed admins are null', async () => {
        const { error, addresses } = await validateSpaceAdmins(null as any);
        expect(addresses).toEqual([]);
        expect(error).toEqual("Admins are required");
    });


    test('should return error if passed admins are empty', async () => {
        const { error, addresses } = await validateSpaceAdmins([]);
        expect(addresses).toEqual([]);
        expect(error).toEqual("Admins are required");
    });

    test('should succeed with valid addresses', async () => {
        const admins = ['calabara.eth', 'nickdodson.eth'];
        const { error, addresses } = await validateSpaceAdmins(admins);
        expect(error).toBeUndefined();
        expect(addresses).toEqual([calabaraAddress, nickAddress])
    })

    test('should succeed and strip empty addresses', async () => {
        const admins = ['calabara.eth', ''];
        const { error, addresses } = await validateSpaceAdmins(admins);
        expect(error).toBeUndefined();
        expect(addresses).toEqual([calabaraAddress])
    });

    test('should strip empty addresses, error addresses, and return error', async () => {
        const admins = ['calabara.eth', 'test', 'nickdodson.eth', ''];
        const { error, addresses } = await validateSpaceAdmins(admins);
        expect(error).toEqual('invalid address at index 1');
        expect(addresses).toEqual([calabaraAddress, nickAddress])
    });

    test('should strip empty addresses, error addresses, and return accumulated errors', async () => {
        const admins = ['calabara.eth', 'test', 'nickdodson.eth', 'test', '', 'asdfasd'];
        const { error, addresses } = await validateSpaceAdmins(admins);
        expect(error).toEqual('invalid address at index 1, invalid address at index 3, invalid address at index 5');
        expect(addresses).toEqual([calabaraAddress, nickAddress])
    });

});


// space ens
/*

describe('validateSpaceEns', () => {
    test('should return error if ens is empty string', async () => {
        const result = await validateSpaceEns('');
        expect(result.error).toBe('Space ens cannot be empty');
    });

    test('should return error if ens is null', async () => {
        const result = await validateSpaceEns(null as any);
        expect(result.error).toBe('Space ens cannot be empty');
    });

    test('should return error if ens is invalid', async () => {
        const result = await validateSpaceEns('nick');
        expect(result.error).toBe('Invalid ens');
    });
    test('should return error if ens is taken', async () => {
        const result = await validateSpaceEns('sharkdao.eth');
        expect(result.error).toBe('Ens is already taken');
    });

    test('should pass validation', async () => {
        const result = await validateSpaceEns('nickdodson.eth');
        expect(result.error).toBe(null);
        expect(result.value).toBe('nickdodson.eth');
    });
});
*/