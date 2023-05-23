#!/bin/bash

subgraphs=("spaces" "contests" "submit" "voting" "user")

url_spaces="http://localhost:4002/graphql"
url_contests="http://localhost:4003/graphql"
url_submit="http://localhost:4004/graphql"
url_voting="http://localhost:4005/graphql"
url_user="http://localhost:4006/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submit="subgraphs/submit/schema.graphql"
schema_voting="subgraphs/voting/schema.graphql"
schema_user="subgraphs/user/schema.graphql"
