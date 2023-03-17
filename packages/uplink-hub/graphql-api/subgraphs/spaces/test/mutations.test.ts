import { describe, expect, test } from '@jest/globals';
import {
    validateSpaceName,
    validateSpaceLogo,
    validateAdmins,
    validateSpaceWebsite,
    validateSpaceTwitter
} from '../src/resolvers/mutations';


// space name

describe('validateSpaceName', () => {
    test('should return error if name is empty string', () => {
        const result = validateSpaceName('');
        expect(result.error).toBe('Space name cannot be empty');
    });
    test('should return error if name is null', () => {
        const result = validateSpaceName(null);
        expect(result.error).toBe('Space name cannot be empty');
    });
    test('should return error if name is < 3 characters', () => {
        const result = validateSpaceName('ab');
        expect(result.error).toBe('Space name must be at least 3 characters');
    });
    test('should return error if name is too long', () => {
        const result = validateSpaceName('a'.repeat(31));
        expect(result.error).toBe('Space name is too long');
    });
});

// logo

describe('validateSpaceLogo', () => {
    test('should return error if logo is empty string', () => {
        const result = validateSpaceLogo('');
        expect(result.error).toBe('Space logo cannot be empty');
    });
    test('should return error if logo is null', () => {
        const result = validateSpaceLogo(null);
        expect(result.error).toBe('Space logo cannot be empty');
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
        const result = validateSpaceWebsite(null);
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
        const result = validateSpaceTwitter(null);
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

describe('validateAdmins', () => {
    test('should return error if passed admins are null', async () => {
        const result = await validateAdmins(null);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('admins cannot be empty');
        expect(filteredAdmins.length).toEqual(0);
    });


    test('should return error if passed admins are empty string', async () => {
        const result = await validateAdmins(['']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(0);
    });


    test('should return error if passed admins are empty array', async () => {
        const result = await validateAdmins([]);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(0);
    });


    test('should return error if passed admins are invalid', async () => {
        const result = await validateAdmins(['a', 'b', 'c']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('1 or more admin fields are invalid');
        expect(filteredAdmins.length).toEqual(3);
    })

    test('should remove address if empty string is passed #1', async () => {
        const result = await validateAdmins(['a', '', 'c']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('1 or more admin fields are invalid');
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove address if empty string is passed #2', async () => {
        const result = await validateAdmins(['nick.eth', '', 'yungweez.eth']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove address if empty string is passed #3', async () => {
        const result = await validateAdmins(['', '', '', 'nick.eth', '', 'yungweez.eth', '']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove duplicate ens', async () => {
        const result = await validateAdmins(['nick.eth', 'nick.eth']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(1);
    });

    test('should remove duplicate address', async () => {
        const result = await validateAdmins(['0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C', '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(1);
    });


});
