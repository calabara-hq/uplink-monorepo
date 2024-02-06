import { DatabaseController, schema, TokenController } from "lib";
import dotenv from 'dotenv';
import { StatEditions, Submission, ZoraEdition } from "../__generated__/resolvers-types";
import { calculateTotalMints } from "./totalMints.js"
dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;



// include the contest object so we can filter fields that may need to be hidden (votes, author)
const prepared_singleSubmissionById = db.query.submissions.findFirst({
    where: (submission: schema.dbSubmissionType) => sqlOps.eq(submission.id, sqlOps.placeholder('submissionId')),
    with: {
        author: true,
        votes: true,
        contest: true,
        nftDrop: {
            with: {
                edition: true,
            }
        },
    }
}).prepare();

// we don't need to include the contest object here because the reference to the fields we need 
// (additional params, deadlines)  is resolved by the schema
const prepared_submissionsByContestId = db.query.submissions.findMany({
    where: (submission: schema.dbSubmissionType) => sqlOps.eq(submission.contestId, sqlOps.placeholder('contestId')),
    with: {
        author: true,
        votes: {
            with: {
                voter: true
            }
        },
        nftDrop: {
            with: {
                edition: true,
            }
        },
    }
}).prepare();



const prepared_getRewards = db.query.rewards.findMany({
    where: (reward: schema.dbRewardType) => sqlOps.eq(reward.contestId, sqlOps.placeholder('contestId')),
    with: {
        tokenReward: {
            with: {
                token: true,
            }
        }
    }
}).prepare();


const prepared_userByAddress = db.query.users.findFirst({
    where: (user: schema.dbUserType) => sqlOps.eq(user.address, sqlOps.placeholder('address')),
}).prepare();




export const dbSingleSubmissionById = async (submissionId: number): Promise<schema.dbSubmissionType> => {
    return prepared_singleSubmissionById.execute({ submissionId });
}

export const dbSubmissionsByContestId = async (contestId: number): Promise<Array<schema.dbSubmissionType>> => {
    return prepared_submissionsByContestId.execute({ contestId });
}

export const dbGetRewards = async (contestId: number): Promise<Array<schema.dbRewardType>> => {
    return prepared_getRewards.execute({ contestId });
}

export const dbUserByAddress = async (address: string): Promise<schema.dbUserType> => {
    return prepared_userByAddress.execute({ address })
}


export const dbGetEditionsBySpaceName = async (spaceName: string): Promise<Array<StatEditions>> => {
    return db.execute(sqlOps.sql`
        SELECT 
        JSON_OBJECT(
            'id', edition.id,
            'chainId', edition.chainId,
            'contractAddress', edition.contractAddress,
            'name', edition.name,
            'symbol', edition.symbol,
            'editionSize', edition.editionSize,
            'royaltyBPS', edition.royaltyBPS,
            'fundsRecipient', edition.fundsRecipient,
            'defaultAdmin', edition.defaultAdmin,
            'description', edition.description,
            'animationURI', edition.animationURI,
            'imageURI', edition.imageURI,
            'referrer', edition.referrer,
            'saleConfig', JSON_OBJECT(
                'publicSalePrice', edition.publicSalePrice,
                'maxSalePurchasePerAddress', edition.maxSalePurchasePerAddress,
                'publicSaleStart', edition.publicSaleStart,
                'publicSaleEnd', edition.publicSaleEnd,
                'presaleStart', edition.presaleStart,
                'presaleEnd', edition.presaleEnd,
                'presaleMerkleRoot', edition.presaleMerkleRoot
            )
        ) AS edition
        FROM spaces s
        JOIN contests c ON s.id = c.spaceId
        JOIN submissions sb ON c.id = sb.contestId
        JOIN submissionDrops sd ON sb.id = sd.submissionId
        JOIN zoraEditions edition ON sd.editionId = edition.id
        WHERE s.name = ${spaceName}

        UNION

        SELECT 
            JSON_OBJECT(
                'id', edition.id,
                'chainId', edition.chainId,
                'contractAddress', edition.contractAddress,
                'name', edition.name,
                'symbol', edition.symbol,
                'editionSize', edition.editionSize,
                'royaltyBPS', edition.royaltyBPS,
                'fundsRecipient', edition.fundsRecipient,
                'defaultAdmin', edition.defaultAdmin,
                'description', edition.description,
                'animationURI', edition.animationURI,
                'imageURI', edition.imageURI,
                'referrer', edition.referrer,
                'saleConfig', JSON_OBJECT(
                    'publicSalePrice', edition.publicSalePrice,
                    'maxSalePurchasePerAddress', edition.maxSalePurchasePerAddress,
                    'publicSaleStart', edition.publicSaleStart,
                    'publicSaleEnd', edition.publicSaleEnd,
                    'presaleStart', edition.presaleStart,
                    'presaleEnd', edition.presaleEnd,
                    'presaleMerkleRoot', edition.presaleMerkleRoot
                )
            ) AS edition
        FROM spaces s
        JOIN mintBoards mb ON s.id = mb.spaceId
        JOIN mintBoardPosts mbp ON mb.id = mbp.boardId
        JOIN zoraEditions edition ON mbp.editionId = edition.id
        WHERE s.name = ${spaceName}
    `)
        .then((data: any) => data.rows)
        .then(calculateTotalMints)
}

export const dbGetMintBoardPostsByBoardId = async (boardId: number): Promise<Array<schema.dbMintBoardPostType>> => {
    return db.execute(sqlOps.sql`
        SELECT
            mbp.*,
            JSON_OBJECT(
                'id', post_author.id,
                'address', post_author.address,
                'userName', post_author.userName,
                'displayName', post_author.displayName,
                'profileAvatar', post_author.profileAvatar
            ) AS author,
            JSON_OBJECT(
                'id', edition.id,
                'chainId', edition.chainId,
                'contractAddress', edition.contractAddress,
                'name', edition.name,
                'symbol', edition.symbol,
                'editionSize', edition.editionSize,
                'royaltyBPS', edition.royaltyBPS,
                'fundsRecipient', edition.fundsRecipient,
                'defaultAdmin', edition.defaultAdmin,
                'description', edition.description,
                'animationURI', edition.animationURI,
                'imageURI', edition.imageURI,
                'referrer', edition.referrer,
                'saleConfig', JSON_OBJECT(
                    'publicSalePrice', edition.publicSalePrice,
                    'maxSalePurchasePerAddress', edition.maxSalePurchasePerAddress,
                    'publicSaleStart', edition.publicSaleStart,
                    'publicSaleEnd', edition.publicSaleEnd,
                    'presaleStart', edition.presaleStart,
                    'presaleEnd', edition.presaleEnd,
                    'presaleMerkleRoot', edition.presaleMerkleRoot
                )
            ) AS edition

        FROM mintBoardPosts mbp
        LEFT JOIN (
            SELECT u.id, u.address, u.userName, u.displayName, u.profileAvatar
            FROM users u
        ) AS post_author ON mbp.userId = post_author.id
        LEFT JOIN (
            SELECT e.*
            FROM zoraEditions e
        ) AS edition ON mbp.editionId = edition.id
        WHERE mbp.boardId = ${boardId}
        GROUP BY mbp.id
        ORDER BY mbp.created DESC
    `)
        .then((data: any) => data.rows)
        .then(calculateTotalMints)

}

// get the last 3 contests that have ended, get submissions with more than 3 unique votes, and take a random sample of 20

export const dbGetPopularSubmissions = async (): Promise<Array<schema.dbSubmissionType>> => {

    const data = await db.execute(sqlOps.sql`
        SELECT 
            s.*,
            COALESCE(vote_counts.uniqueVotes, 0) AS uniqueVotes,
            CASE 
                WHEN edition.id IS NULL 
                THEN NULL 
                ELSE JSON_OBJECT(
                    'id', edition.id,
                    'chainId', edition.chainId,
                    'contractAddress', edition.contractAddress,
                    'name', edition.name,
                    'symbol', edition.symbol,
                    'editionSize', edition.editionSize,
                    'royaltyBPS', edition.royaltyBPS,
                    'fundsRecipient', edition.fundsRecipient,
                    'defaultAdmin', edition.defaultAdmin,
                    'description', edition.description,
                    'animationURI', edition.animationURI,
                    'imageURI', edition.imageURI,
                    'referrer', edition.referrer,
                    'saleConfig', JSON_OBJECT(
                        'publicSalePrice', edition.publicSalePrice,
                        'maxSalePurchasePerAddress', edition.maxSalePurchasePerAddress,
                        'publicSaleStart', edition.publicSaleStart,
                        'publicSaleEnd', edition.publicSaleEnd,
                        'presaleStart', edition.presaleStart,
                        'presaleEnd', edition.presaleEnd,
                        'presaleMerkleRoot', edition.presaleMerkleRoot
                    )
                ) END AS edition,
            JSON_OBJECT(
                'id', sub_author.id,
                'address', sub_author.address,
                'userName', sub_author.userName,
                'displayName', sub_author.displayName,
                'profileAvatar', sub_author.profileAvatar
            ) AS author
        FROM submissions s
        LEFT JOIN (
            SELECT u.id, u.address, u.userName, u.displayName, u.profileAvatar
            FROM users u
        ) AS sub_author ON s.userId = sub_author.id
        JOIN (
            SELECT id, created, endTime
            FROM contests
            WHERE endTime < NOW()
            ORDER BY created DESC
            LIMIT 3
        ) AS latest_contests ON s.contestId = latest_contests.id

        LEFT JOIN (
            SELECT v.submissionId, COUNT(DISTINCT v.id) AS uniqueVotes
            FROM votes v
            GROUP BY v.submissionId
            HAVING uniqueVotes > 1
        ) AS vote_counts ON s.id = vote_counts.submissionId
        LEFT JOIN (
            SELECT sd.*
            FROM submissionDrops sd
        ) AS submissionDrop ON s.id = submissionDrop.submissionId
        LEFT JOIN (
            SELECT e.*
            FROM zoraEditions e
        ) AS edition ON submissionDrop.editionId = edition.id
        ORDER BY RAND()
`);
    // sample the subs that have more than 3 unique votes
    // if length of 3vote array is < 10, sample the subs that have 2 unique votes
    // if length of 2vote array is < 10, just return the original array

    const subsWith3PlusVotes = data.rows.filter((sub: Submission & { uniqueVotes: number }) => sub.uniqueVotes >= 3)
    // if > 20, return a random sample of 20
    if (subsWith3PlusVotes.length > 20) {
        return subsWith3PlusVotes.sort(() => Math.random() - Math.random()).slice(0, 20)
    }
    // if > 10, return the array as is
    if (subsWith3PlusVotes.length >= 10) {
        return subsWith3PlusVotes
    }

    // if < 10, keep going

    const subsWith2PlusVotes = data.rows.filter((sub: Submission & { uniqueVotes: number }) => sub.uniqueVotes >= 2)

    // if > 20, return a random sample of 20
    if (subsWith2PlusVotes.length > 20) {
        return subsWith2PlusVotes.sort(() => Math.random() - Math.random()).slice(0, 20)
    }
    // if > 10, return the array as is
    if (subsWith2PlusVotes.length >= 10) {
        return subsWith2PlusVotes
    }

    // if < 10, work with the original array

    // if > 20, return a random sample of 20
    if (data.rows.length > 20) {
        return data.rows.sort(() => Math.random() - Math.random()).slice(0, 20)
    }

    // otherwise return the original array

    return data.rows
}