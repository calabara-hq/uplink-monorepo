
import { spaces } from './index.js';

const queries = {
    Query: {
        spaces() {
            //return [spaces.at(Math.floor(Math.random() * spaces.length - 1))];
            return spaces
        },
        space(parent, args, contextValue, info) {
            return spaces.find(space => space.id === args.id);
        },
    },

    Space: {
        __resolveReference(space) {
            return spaces.find(_space => _space.id === space.id);
        }
    }
};




export default queries
