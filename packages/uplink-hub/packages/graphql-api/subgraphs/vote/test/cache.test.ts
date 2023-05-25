import { describe, expect, test, jest, afterEach, afterAll } from '@jest/globals';
import { redisClient, setCacheValue } from '../src/utils/cache';

describe('cache test suite', () => {
    test('successful cache set/get', async () => {
        const setResult = await setCacheValue('test', 'thisisatest');
        const getResult = await redisClient.get('test');
        expect(getResult).toEqual('thisisatest');
        await redisClient.del('test');
        await redisClient.quit();
    });
});