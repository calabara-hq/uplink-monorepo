import gql from 'graphql-tag';

export const AllSpacesDocument = gql`
    query Spaces{
        spaces{
            id
            name
            members
        }
    }
`;
