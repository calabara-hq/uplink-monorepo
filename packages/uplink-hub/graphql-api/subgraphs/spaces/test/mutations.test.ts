import { describe, expect, test } from '@jest/globals';
import { validateSpaceName, validateAdmins } from '../src/resolvers/mutations';

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

// admins tests

// null admins
// empty admins
// invalid admins
// valid admins
// duplicate admins


describe('validateAdmins', () => {
    test('should return error if passed admins are null', () => {
        const result = validateAdmins(null);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('admins cannot be empty');
        expect(filteredAdmins.length).toEqual(0);
    });

    /*
    // TODO - fix these tests
    test('should return error if passed admins are empty string', () => {
        const result = validateAdmins(['']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(null);
    });
    

    test('should return error if passed admins are empty array', () => {
        const result = validateAdmins([]);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(0);
    });
    */

    test('should return error if passed admins are invalid', () => {
        const result = validateAdmins(['a', 'b', 'c']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('1 or more admin fields are invalid');
        expect(filteredAdmins.length).toEqual(3);
    })

    test('should remove address if empty string is passed #1', () => {
        const result = validateAdmins(['a', '', 'c']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe('1 or more admin fields are invalid');
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove address if empty string is passed #2', () => {
        const result = validateAdmins(['nick.eth', '', 'yungweez.eth']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove address if empty string is passed #3', () => {
        const result = validateAdmins(['', '', '', 'nick.eth', '', 'yungweez.eth', '']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(2);
    })

    test('should remove duplicate ens', () => {
        const result = validateAdmins(['nick.eth', 'nick.eth']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(1);
    });

    test('should remove duplicate address', () => {
        const result = validateAdmins(['0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C', '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C']);
        const { adminError, filteredAdmins } = result;
        expect(adminError).toBe(null);
        expect(filteredAdmins.length).toEqual(1);
    });

    
});
