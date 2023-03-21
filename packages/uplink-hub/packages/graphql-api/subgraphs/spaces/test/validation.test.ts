import { describe, expect, test } from '@jest/globals';
import {
    validateSpaceName,
    validateSpaceLogo,
    validateSpaceAdmins,
    validateSpaceWebsite,
    validateSpaceTwitter,
    validateSpaceEns
} from '../src/utils/validateFormData';


// space ens

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

// space name

describe('validateSpaceName', () => {
    test('should return error if name is empty string', async () => {
        const result = await validateSpaceName('');
        expect(result.error).toBe('Space name cannot be empty');
    });
    test('should return error if name is null', async () => {
        const result = await validateSpaceName(null as any);
        expect(result.error).toBe('Space name cannot be empty');
    });
    test('should return error if name is < 3 characters', async () => {
        const result = await validateSpaceName('ab');
        expect(result.error).toBe('Space name must be at least 3 characters');
    });
    test('should return error if name is too long', async () => {
        const result = await validateSpaceName('a'.repeat(31));
        expect(result.error).toBe('Space name is too long');
    });
    test('should pass validation #1', async () => {
        const result = await validateSpaceName('nouns');
        expect(result.error).toBe(null);
    });
    test('should pass validation #2', async () => {
        const result = await validateSpaceName('  nouns  ');
        expect(result.error).toBe(null);
    });
});

// logo

describe('validateSpaceLogo', () => {
    test('should return error if logo is empty string', () => {
        const result = validateSpaceLogo('');
        expect(result.error).toBe('Space logo cannot be empty');
    });
    test('should return error if logo is null', () => {
        const result = validateSpaceLogo(null as any);
        expect(result.error).toBe('Space logo cannot be empty');
    });
    test('should return error if logo is not ipfs', () => {
        const result = validateSpaceLogo('https://google.com');
        expect(result.error).toBe('Space logo is not valid');
    });
    test('should pass validation #1', () => {
        const result = validateSpaceLogo('https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4');
        expect(result.error).toBe(null);
    });
    test('should pass validation #2', () => {
        const result = validateSpaceLogo('    https://calabara.mypinata.cloud/ipfs/Qmdu6zwZqY6XtLUPigE7hsqcEPTwbeon5j9SCXYiBekei4     ');
        expect(result.error).toBe(null);
    });
});

// website

describe('validateSpaceWebsite', () => {

    test('should ignore entry if website is null', () => {
        const result = validateSpaceWebsite(null as any);
        expect(result.error).toBe(null);
    });

    test('should ignore entry if website is empty string', () => {
        const result = validateSpaceWebsite('');
        expect(result.error).toBe(null);
    });

    test('should return error if website is too long', () => {
        const result = validateSpaceWebsite('a'.repeat(51));
        expect(result.error).toBe("Website is too long");
    });

    test('should fail validation #1', () => {
        const result = validateSpaceWebsite('calabara');
        expect(result.error).toBe("Website is not valid");
    });

    test('should fail validation #2', () => {
        const result = validateSpaceWebsite('https://nouns');
        expect(result.error).toBe("Website is not valid");
    });


    test('should pass validation #1', () => {
        const result = validateSpaceWebsite('calabara.com');
        expect(result.error).toBe(null);
    });

    test('should pass validation #2', () => {
        const result = validateSpaceWebsite('nouns.wtf');
        expect(result.error).toBe(null);
    });

    test('should pass validation #3', () => {
        const result = validateSpaceWebsite('https://uplink.wtf');
        expect(result.error).toBe(null);
    });

    test('should pass validation #4', () => {
        const result = validateSpaceWebsite('http://nouns.com');
        expect(result.error).toBe(null);
    });
});



// twitter 

describe('validateSpaceTwitter', () => {
    test('should ignore entry if twitter is null', () => {
        const result = validateSpaceTwitter(null as any);
        expect(result.error).toBe(null);
    });

    test('should ignore entry if twitter is empty string', () => {
        const result = validateSpaceTwitter('');
        expect(result.error).toBe(null);
    });

    test('should ignore entry if twitter is too long', () => {
        const result = validateSpaceTwitter('@mynameisnickandthisisaverylongtwitterhandle');
        expect(result.error).toBe("Twitter handle is too long");
    });

    test('should fail validation #1', () => {
        const result = validateSpaceTwitter("nick");
        expect(result.error).toBe("Twitter handle is not valid");
    });

    test('should fail validation #1', () => {
        const result = validateSpaceTwitter("@ni-)ck");
        expect(result.error).toBe("Twitter handle is not valid");
    });

    test('should pass validation #1', () => {
        const result = validateSpaceTwitter("@nick");
        expect(result.error).toBe(null);
    });

    test('should pass validation #1', () => {
        const result = validateSpaceTwitter("@calabarahq");
        expect(result.error).toBe(null);
    });
})


// admins

describe('validateSpaceAdmins', () => {
    test('should return error if passed admins are null', async () => {
        const result = await validateSpaceAdmins(null as any);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe('Admins cannot be empty');
        expect(addresses.length).toEqual(0);
    });

    test('should return error if passed admins are empty array', async () => {
        const result = await validateSpaceAdmins([]);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe('Admins cannot be empty');
        expect(addresses.length).toEqual(0);
    });

    test('should return error if no valid admins are passed', async () => {
        const result = await validateSpaceAdmins(['']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe('Admins cannot be empty');
        expect(addresses.length).toEqual(0);
    });

    test('should return error if passed admins are invalid', async () => {
        const result = await validateSpaceAdmins(['a', 'b', 'c']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe('1 or more admin fields are invalid');
        expect(addresses.length).toEqual(3);
        expect(errors.length).toEqual(3);

    })

    test('should remove address if empty string is passed #1', async () => {
        const result = await validateSpaceAdmins(['a', '', 'c']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe('1 or more admin fields are invalid');
        expect(addresses.length).toEqual(2);
        expect(errors.length).toEqual(2);
    })

    test('should remove address if empty string is passed #2', async () => {
        const result = await validateSpaceAdmins(['nick.eth', '', 'yungweez.eth']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe(null);
        expect(addresses.length).toEqual(2);
        expect(errors.length).toEqual(2);
    })

    test('should remove address if empty string is passed #3', async () => {
        const result = await validateSpaceAdmins(['', '', '', 'nick.eth', '', 'yungweez.eth', '']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe(null);
        expect(addresses.length).toEqual(2);
        expect(errors.length).toEqual(2);
    })


    test('should remove duplicate ens', async () => {
        const result = await validateSpaceAdmins(['nick.eth', 'nick.eth']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe(null);
        expect(addresses.length).toEqual(1);
        expect(errors.length).toEqual(1);
    });

    test('should remove duplicate address', async () => {
        const result = await validateSpaceAdmins(['0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C', '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C']);
        const { topLevelAdminsError, addresses, errors } = result;
        expect(topLevelAdminsError).toBe(null);
        expect(addresses.length).toEqual(1);
        expect(errors.length).toEqual(1);
    });


});

