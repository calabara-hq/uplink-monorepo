import express, { Request, Response, NextFunction } from 'express';
import * as channelController from './controllers/channel.js'
import * as tokenController from './controllers/token.js'
import * as utilitiesController from './controllers/utilities.js'
import * as userController from './controllers/user.js'
import * as spaceController from './controllers/space.js'
import * as contestV1Controller from './controllers/contest_v1.js'

const v2 = express();
import cookie from 'cookie';
import { Context, xor_compare } from 'lib';
import { AuthorizationError, InvalidArgumentError, SpaceMutationError, TransactionRevertedError } from './errors.js';
import { ContexedRequest } from './types.js';


const parseHeader = (headerArray: string[] | string) => {
    return Array.isArray(headerArray) ? headerArray[0] : headerArray || '';
};


const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const context: Context = {
        token: cookie.parse(parseHeader(req.headers['cookie'])),
        csrfToken: parseHeader(req.headers['x-csrf-token']),
        ip: parseHeader(req.headers['x-forwarded-for']) || req.socket.remoteAddress,
        hasApiToken: xor_compare(parseHeader(req.headers['x-api-token']), process.env.FRONTEND_API_SECRET)
    };

    (req as ContexedRequest).context = context;
    next();
};


const handleApiErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if (err instanceof AuthorizationError) {
        return res.status(401).json({ message: err.message });
    } else if (err instanceof InvalidArgumentError) {
        return res.status(400).json({ message: err.message });
    } else if (err instanceof TransactionRevertedError) {
        return res.status(400).json({ message: err.message });
    } else if (err instanceof SpaceMutationError) {
        return res.status(400).json({ message: err.message });
    }
    else {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */


v2.get('/health', (req, res) => {
    res.send('ready')
})

v2.get('/channel', channelController.getChannel)
v2.get('/space', spaceController.getSpace)
v2.get('/spaces', spaceController.getSpaces)
v2.get('/channel_upgradePath', channelController.getChannelUpgradePath)
v2.get('/channel_tokensV1', tokenController.getChannelTokensV1)
v2.get('/channel_tokensV2', tokenController.getChannelTokensV2)
v2.get('/channel_tokenIntents', tokenController.getChannelTokenIntents)
v2.get('/channel_popularTokens', tokenController.getChannelPopularTokens)
v2.get('/channel_finiteTokensV2', tokenController.getFiniteChannelTokensV2)

v2.get('/legacy_singleContest', contestV1Controller.getSingleV1Contest)
v2.get('/space_channels', spaceController.getChannelsBySpaceName)
v2.get('/space_stats', spaceController.getSpaceStats)

v2.get('/singleTokenV1', tokenController.getSingleTokenV1)
v2.get('/singleTokenV2', tokenController.getSingleTokenV2)
v2.get('/singleTokenIntent', tokenController.getSingleTokenIntent)
v2.get('/explore_trending', channelController.getTrendingChannels)
v2.get('/explore_activeContests', channelController.getActiveContests)
v2.get('/featured_mints', tokenController.getFeaturedMints)

v2.get('/userOwnedTokens', userController.getUserOwnedTokens)
v2.get('/userManagedSpaces', userController.getUserManagedSpaces)
v2.get('/singleLegacyContestSubmission', contestV1Controller.getSingleLegacyContestSubmission)
/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

v2.post('/insert_space', sessionMiddleware, spaceController.createSpace)
v2.post('/update_space', sessionMiddleware, spaceController.editSpace)
v2.post('/paymaster_proxy', utilitiesController.paymasterProxy)
v2.post('/insert_channel', sessionMiddleware, channelController.insertSpaceChannel)
v2.post('/insert_tokenIntent', sessionMiddleware, tokenController.insertChannelTokenIntent)
v2.post('/fulfill_tokenIntent', sessionMiddleware, tokenController.fulfillChannelTokenIntent)
v2.post('/ban_tokenIntent', sessionMiddleware, tokenController.banTokenIntent)
v2.post('/ban_tokenV2', sessionMiddleware, tokenController.banTokenV2)

v2.use(handleApiErrors)


export default v2