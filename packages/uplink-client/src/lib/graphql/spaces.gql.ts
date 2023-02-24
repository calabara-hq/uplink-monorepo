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

// get a space by id
export const SpaceDocument = gql`
    query Query($id: ID!){
        space(id: $id){
            name
            members
        }
        spaceContests(spaceId: $id){
            start
            end
            tag
        }
    }
`;