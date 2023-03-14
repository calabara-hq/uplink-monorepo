import { validateEthAddress } from "../src/utils/ethAddress";
import { describe, expect, test } from "@jest/globals";



describe('validateEthAddress', () => {
    test('should return null if address is invalid', async () => {
        const result = await validateEthAddress('0x1');
        expect(result).toBe(null);
    })

    test('should return checksum if ENS is valid', async () => {
        const result = await validateEthAddress('nickdodson.eth');
        expect(result).toBe('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C');
    })

    test('should return checksum if address is valid', async () => {
        const result = await validateEthAddress('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'.toLowerCase());
        expect(result).toBe('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C');
    })
})


