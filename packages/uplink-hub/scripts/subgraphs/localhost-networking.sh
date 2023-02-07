#!/bin/bash

subgraphs=("spaces" "contests" "submissions")

url_spaces="http://localhost:4001/graphql"
url_contests="http://localhost:4002/graphql"
url_submissions="http://localhost:4003/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submissions="subgraphs/submissions/schema.graphql"
