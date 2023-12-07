import { sqlOps, db } from "../utils/database.js";
import { AuthorizationController, schema, Context } from "lib";

const authController = new AuthorizationController(process.env.REDIS_URL);

type UserName = string;
type UserAddress = `0x${string}`

type UserIdentifier = UserName | UserAddress

const isUserAddress = (userIdentifier: UserIdentifier): userIdentifier is UserAddress => {
    return userIdentifier.startsWith('0x');
}


const userByUsername = db.query.users.findFirst({
    where: ((users) => sqlOps.eq(users.userName, sqlOps.placeholder('userName'))),
}).prepare();

const userByAddress = db.query.users.findFirst({
    where: sqlOps.eq(schema.users.address, sqlOps.placeholder('userAddress')),
}).prepare();

const restrictedSubmissionsByUserAddress = async (userId: string) => {
    console.log(userId)
    const data = await db.execute(sqlOps.sql`
        SELECT
            s.*,
            c.id as contestId,
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
                'id', author.id,
                'address', author.address,
                'userName', author.userName,
                'displayName', author.displayName,
                'profileAvatar', author.profileAvatar
            ) AS author
        FROM submissions s
        LEFT JOIN (
            SELECT u.id, u.address, u.userName, u.displayName, u.profileAvatar
            FROM users u
        ) AS author ON s.userId = author.id
        JOIN (
            SELECT id, endTime, anonSubs
            FROM contests
        ) AS c ON s.contestId = c.id
        LEFT JOIN (
            SELECT sd.submissionId, sd.editionId
            FROM submissionDrops sd
        ) AS submissionDrop ON s.id = submissionDrop.submissionId
        LEFT JOIN (
            SELECT e.*
            FROM zoraEditions e
        ) AS edition ON submissionDrop.editionId = edition.id
        
        WHERE s.userId = ${userId} AND (c.anonSubs = false OR c.endTime < NOW())
        ORDER BY s.created DESC

    `)

    return data.rows
}

const unrestrictedSubmissionsByUserAddress = async (userId: string) => {
    console.log(userId)
    const data = await db.execute(sqlOps.sql`
        SELECT
        s.*,
        c.id as contestId,
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
                'id', author.id,
                'address', author.address,
                'userName', author.userName,
                'displayName', author.displayName,
                'profileAvatar', author.profileAvatar
            ) AS author
        FROM submissions s
        LEFT JOIN (
            SELECT u.id, u.address, u.userName, u.displayName, u.profileAvatar
            FROM users u
        ) AS author ON s.userId = author.id
        JOIN (
            SELECT id, endTime, anonSubs
            FROM contests
        ) AS c ON s.contestId = c.id
        LEFT JOIN (
            SELECT sd.submissionId, sd.editionId
            FROM submissionDrops sd
        ) AS submissionDrop ON s.id = submissionDrop.submissionId
        LEFT JOIN (
            SELECT e.*
            FROM zoraEditions e
        ) AS edition ON submissionDrop.editionId = edition.id
        WHERE s.userId = ${userId}
        ORDER BY s.created DESC
    `)

    return data.rows
}


const queries = {
    Query: {
        async me(_: any, args: any, context: Context) {
            const user = await authController.getUser(context);
            if (!user) return null;

            const userData = await userByAddress.execute({ userAddress: user.address })
            const submissions = await unrestrictedSubmissionsByUserAddress(user.id.toString());

            return {
                ...userData,
                submissions
            }

        },

        async user(_: any, { userIdentifier }: { userIdentifier: UserIdentifier }) {
            const user = isUserAddress(userIdentifier) ? await userByAddress.execute({ userAddress: userIdentifier }) : await userByUsername.execute({ userName: userIdentifier });
            const submissions = await restrictedSubmissionsByUserAddress(user.id.toString());
            return {
                ...user,
                submissions
            }
        },
    },

};


export default queries