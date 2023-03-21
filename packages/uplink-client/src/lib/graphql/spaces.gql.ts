import gql from 'graphql-tag';

export const AllSpacesDocument = gql`
    query Spaces{
        spaces{
            id
            name
            members
            admins{
                address
            }
        }
    }
`;

export const SpaceDocument = gql`
    query Query($id: ID!){
        space(id: $id){
            id
            name
            logo_url
            twitter
            website
            admins{
                address
            }
        }
    }
`;

/*
// upsert a space
export const CreateSpaceDocument = gql`
    mutation CreateSpace($spaceData: CreateSpaceInput!){
        createSpace(spaceData: $spaceData){
            id
            success
            spaceResponse{
                ens{
                    value
                    error
                }
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
*/


// upsert a space
export const CreateSpaceDocument = gql`
    mutation CreateSpace($spaceData: CreateSpaceInput!){
        createSpace(spaceData: $spaceData){
            success
            errors{
                ens
                name
                logo_url
                twitter
                website
                admins
                topLevelAdminsError
            }
            spaceResponse{
                id
                ens
                name
                logo_url
                twitter
                website
                admins
            }
        }
    }
`;

export const EditSpaceDocument = gql`
    mutation EditSpace($spaceData: CreateSpaceInput!){
        editSpace(spaceData: $spaceData){
            success
            errors{
                ens
                name
                logo_url
                twitter
                website
                admins
                topLevelAdminsError
            }
            spaceResponse{
                id
                ens
                name
                logo_url
                twitter
                website
                admins
            }
        }
    }
`;


