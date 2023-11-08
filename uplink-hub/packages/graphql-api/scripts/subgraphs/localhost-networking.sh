#!/bin/bash

subgraphs=("spaces" "contests" "submit" "vote" "user")

url_spaces="http://localhost:5003"
url_contests="http://localhost:5004"
url_submit="http://localhost:5005"
url_vote="http://localhost:5006"
url_user="http://localhost:5007"

schema_spaces="subgraphs/spaces/schema.graphql"
schema_contests="subgraphs/contests/schema.graphql"
schema_submit="subgraphs/submit/schema.graphql"
schema_vote="subgraphs/vote/schema.graphql"
schema_user="subgraphs/user/schema.graphql"
