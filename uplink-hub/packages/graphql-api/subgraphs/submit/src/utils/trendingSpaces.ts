import { dbTrendingSpaces } from "./database.js"



export const trendingSpaces = (limit: number) => {
    // return the spaces that have the most onchain activity
    // for now, we'll just return the spaces with the most editions


    // select editions from past 24 hours
    // group by mintboard
    // group by space
    // order by count descending

    return dbTrendingSpaces(limit);
}