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

// get a space by id r
export const SpaceDocument = gql`
    query Query($name: String!){
        space(name: $name){
            name
            contests{
                id
            }
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
                logo_url{
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
                admins{
                    value
                    error
                }
            }
        }
    }
`;
