#!/bin/bash

subgraphs=("spaces" "contests" "submit" "vote" "user")

url_spaces="http://spaces:4000/graphql"
url_contests="http://contests:4000/graphql"
url_submit="http://submit:4000/graphql"
url_vote="http://vote:4000/graphql"
url_user="http://user:4000/graphql"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submit="subgraphs/submit/schema.graphql"
schema_vote="subgraphs/vote/schema.graphql"
schema_user="subgraphs/user/schema.graphql"