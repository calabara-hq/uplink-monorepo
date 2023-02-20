import gql from 'graphql-tag';
//import * as Urql from 'urql';



export const AllSpacesDocument = gql`
    query Spaces{
        spaces{
            id
            name
            members
        }
    }
`;
