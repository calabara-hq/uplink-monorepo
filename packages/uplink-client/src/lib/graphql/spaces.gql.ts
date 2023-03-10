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
        }
        spaceContests(spaceId: $id){
            start
            end
            tag
        }
    }
`;


// create a space
export const CreateSpaceDocument = gql`
    mutation CreateSpace($spaceData: SpaceInput!){
        createSpace(spaceData: $spaceData){
            success
            spaceResponse{
                name{
                    value
                    error
                }
                twitter{
                    value
                    error
                }
                website{
                    value
                    error
                }
            }
        }
    }
`;
