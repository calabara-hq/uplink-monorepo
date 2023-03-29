#!/bin/bash

subgraphs=("spaces" "contests" "submissions")

url_spaces="http://spaces:4000/graphql"
url_contests="http://contests:4000/graphql"
url_submissions="http://submissions:4000/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submissions="subgraphs/submissions/schema.graphql"
