#!/bin/bash

subgraphs=("spaces" "contests" "submit" "voting")

url_spaces="http://spaces:4000/graphql"
url_contests="http://contests:4000/graphql"
url_submit="http://submit:4000/graphql"
url_voting="http://voting:4000/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submit="subgraphs/submit/schema.graphql"
schema_voting="subgraphs/voting/schema.graphql"
