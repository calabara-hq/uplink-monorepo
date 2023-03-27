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


export const IsEnsValidDocument = gql`
    query IsEnsValid($ens: String!){
        isEnsValid(ens: $ens){
            success
            errors{
                ens
            }
            ens
        }
    }
`;


// upsert a space
export const CreateSpaceDocument = gql`
    mutation CreateSpace($spaceData: AlterSpaceInput!){
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
    mutation EditSpace($spaceData: AlterSpaceInput!){
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


