import gql from 'graphql-tag';


export const TestEndpointDocument = gql`
    query testEndoint($id: ID!){
        testEndpoint(id: $id){
            success
        }
    }
`;
