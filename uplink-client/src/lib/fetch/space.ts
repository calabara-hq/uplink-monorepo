import 'server-only';
import graphqlClient from "@/lib/graphql/initUrql";
import gql from 'graphql-tag';
import { cache } from 'react';


const AllSpacesDocument = gql`
    query Spaces{
        spaces{
            name
            displayName
            members
            admins{
                address
            }
            logoUrl
        }
    }
`;

const SpaceDocument = gql`
    query Query($name: String, $id: ID){
        space(name: $name, id: $id){
            id
            name
            displayName
            logoUrl
            twitter
            website
            admins{
                address
            }
            contests {
                deadlines {
                  endTime
                  snapshot
                  startTime
                  voteTime
                }
                id
                metadata {
                  category
                }
                promptUrl
              }
        }
    }
`;


const IsEnsValidDocument = gql`
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


const CreateSpaceDocument = gql`
    mutation CreateSpace($spaceData: SpaceBuilderInput!){
        createSpace(spaceData: $spaceData){
            spaceName
            success
            errors{
                name
                logoUrl
                twitter
                website
                admins
            }
        }
    }
`;

const EditSpaceDocument = gql`
    mutation EditSpace($spaceId: ID!, $spaceData: SpaceBuilderInput!){
        editSpace(spaceId: $spaceId, spaceData: $spaceData){
            spaceName
            success
            errors{
                name
                logoUrl
                twitter
                website
                admins
            }
        }
    }
`;





export const getSpace = async (spaceName: string) => {
    //console.log('getting space')
    const response = await graphqlClient.query(SpaceDocument, { name: spaceName })
        .toPromise();
    return response
}