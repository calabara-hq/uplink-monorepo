import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import { gql } from 'graphql-request';
import { schema } from "lib";
import { authenticatedGraphqlClient, db, sqlOps } from './config';


const nickAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'



const createSpace = async (spaceData: any) => {
    const mutation = gql` mutation CreateSpace($spaceData: SpaceBuilderInput!){
        createSpace(spaceData: $spaceData){
            spaceName
            success
            errors{
                name
                logoUrl
                twitter
                website
                admins
            }
        }
    }`;
    return authenticatedGraphqlClient.request(mutation, { spaceData });
}


describe('e2e spaces', () => {

    test('successfully create a space', async () => {

        
        const spaceData = {
            name: 'test space',
            logoUrl: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            twitter: '@nickddsn',
            website: 'https://calabara.com',
            admins: [nickAddress]
        }

        const result: any = await createSpace(spaceData);

        expect(result.createSpace.success).toBe(true);
        expect(result.createSpace.errors).toEqual({
            name: null,
            logoUrl: null,
            twitter: null,
            website: null,
            admins: null
        });


        const spaceResult = await db.select({
            spaceId: schema.spaces.id,
            name: schema.spaces.name,
            displayName: schema.spaces.displayName,
            logoUrl: schema.spaces.logoUrl,
            twitter: schema.spaces.twitter,
        }).from(schema.spaces).where(sqlOps.eq(schema.spaces.name, spaceData.name.replace(' ', '')))

        const { spaceId, name, displayName, logoUrl, twitter } = spaceResult[0];

        expect(name).toBe(spaceData.name.replace(' ', ''));

        const adminsResult = await db.select({
            adminId: schema.admins.id,
            spaceId: schema.admins.spaceId,
            address: schema.admins.address,
        }).from(schema.admins).where(sqlOps.eq(schema.admins.spaceId, spaceId))


        expect(adminsResult[0].address).toBe(nickAddress);
        
    })
});

