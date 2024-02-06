
import { StatEditions, ZoraEdition } from "../__generated__/resolvers-types";
import { dbGetEditionsBySpaceName, dbUserByAddress } from "./database.js"
// query total editions by space name


export const spaceStatistics = async (name: string) => {
    const editions = await dbGetEditionsBySpaceName(name); // Assuming the correct return type
    let totalMints = 0;
    let creatorMintsMap: { [key: string]: number } = {};
    let creatorAppearanceMap: { [key: string]: number } = {};
    let topMintsCreator = { address: '', totalMints: 0 };
    let topAppearanceCreator = { address: '', appearances: 0 };

    editions.forEach(item => {
        const { defaultAdmin } = item.edition;
        totalMints += item.totalMints; // Accumulate total mints

        // Update total mints for the creator
        creatorMintsMap[defaultAdmin] = (creatorMintsMap[defaultAdmin] || 0) + item.totalMints;
        // Check and update the top mints creator
        if (creatorMintsMap[defaultAdmin] > topMintsCreator.totalMints) {
            topMintsCreator = { address: defaultAdmin, totalMints: creatorMintsMap[defaultAdmin] };
        }

        // Update appearances for the creator
        creatorAppearanceMap[defaultAdmin] = (creatorAppearanceMap[defaultAdmin] || 0) + 1;
        // Check and update the top appearance creator
        if (creatorAppearanceMap[defaultAdmin] > topAppearanceCreator.appearances) {
            topAppearanceCreator = { address: defaultAdmin, appearances: creatorAppearanceMap[defaultAdmin] };
        }
    });



    const [user_topMintsCreator, user_topAppearanceCreator] = await Promise.all([
        topMintsCreator.address ? await dbUserByAddress(topMintsCreator?.address) : null,
        topAppearanceCreator.address ? await dbUserByAddress(topAppearanceCreator.address) : null
    ]);

    return {
        editions,
        totalEditions: editions.length,
        totalMints,
        topMintsUser: user_topMintsCreator,
        topAppearanceUser: user_topAppearanceCreator
        
    };
};