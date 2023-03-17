#!/bin/bash

subgraphs=("spaces" "contests" "submissions" "user")

url_spaces="http://localhost:4002/graphql"
url_contests="http://localhost:4003/graphql"
url_submissions="http://localhost:4004/graphql"
url_user="http://localhost:4005/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submissions="subgraphs/submissions/schema.graphql"
schema_user="subgraphs/user/schema.graphql"
