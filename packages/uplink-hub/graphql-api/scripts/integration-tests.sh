#!/bin/bash

PORT="${1:-4000}"
COUNT="${2:-1}"

OK_CHECK="\xE2\x9C\x85"
FAIL_MARK="\xE2\x9D\x8C"
ROCKET="\xF0\x9F\x9A\x80"

err() {
    local red=`tput setaf 1 2>/dev/null || echo ''`
    local reset=`tput sgr0 2>/dev/null || echo ''`
    echo "${red}ERROR${reset}: $1" >&2
    exit 1
}

exec_curl() {
  ERR=""
  RES=$("$@" 2>/dev/null)
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "$@"
    if [ $EXIT_CODE -eq 7 ]; then
      ERR="CURL ERROR 7: Failed to connect() to host or proxy."
    elif [ $EXIT_CODE -eq 52 ]; then
      ERR="CURL ERROR 52: Empty reply from server."
    elif [ $EXIT_CODE -eq 56 ]; then
      ERR="CURL ERROR 56: Recv failure: Connection reset by peer."
    else
      ERR="CURL ERROR $EXIT_CODE\n"
    fi
  fi
  return $EXIT_CODE
}

TESTS=(0)

HAS_DEFER=0

# introspection query
exec_curl curl -X POST http://localhost:$PORT/ \
  -H "Content-Type: application/json" \
  --data '{ "query": "query { __schema { directives { name }}}" }'
if [ $? != 0 ]; then err "$ERR"; fi
printf "$OK_CHECK Introspection Success!\n"

if echo "$RES" | grep -q '{"name":"defer"}'; then HAS_DEFER=1; fi

if [ $HAS_DEFER -eq 1 ]; then
  echo " - has @defer support"
  TESTS=("${TESTS[@]}" "${DEFER_TESTS[@]}")
else
  echo " - no @defer support"
fi
printf "\n"

TESTS=("${TESTS[@]}" "${DEPRECATED_TESTS[@]}")

# --------------------------------------------------------------------
# TEST 0
# --------------------------------------------------------------------
DESCR_0="spaces subgraph only"
OPNAME_0="Spaces"
ACCEPT_0="application/json"
read -r -d '' QUERY_0 <<"EOF"
query Spaces {
  spaces {
    id,
    name
  }
}
EOF

OP_0=equals

read -r -d '' EXP_0 <<"EOF"
{"data":{"spaces":[{"id":"1","name":"sharkdao"}]}}
EOF

set -e

printf "Running integration tests ... $ROCKET $ROCKET $ROCKET\n"
trap 'rm -f *.tmp' EXIT
sleep 2

run_tests ( ){
  for (( i=1; i<=$COUNT; i++ )); do
    for test in ${TESTS[@]}; do
      descr_var="DESCR_$test"
      query_var="QUERY_$test"
      exp_var="EXP_$test"
      op_var="OP_$test"
      opname_var="OPNAME_$test"
      accept_var="ACCEPT_$test"
      is_slow_var="ISSLOW_$test"

      DESCR="${!descr_var}"
      QUERY=$(echo "${!query_var}" | tr '\n' ' ' | awk '$1=$1')
      EXP="${!exp_var}"
      OP="${!op_var}"
      OPNAME="${!opname_var}"
      ACCEPT="${!accept_var}"
      ISSLOW="${!is_slow_var}"
      CMD=(curl -i -X POST -H "Content-Type: application/json" -H "apollographql-client-name: smoke-test" -H "accept:${ACCEPT}" --data "{ \"query\": \"${QUERY}\", \"operationName\": \"$OPNAME\" }" http://localhost:$PORT/ )

      if [ $i -gt 1 ]; then
        if [ "$ISSLOW" == "true" ]; then
          continue
        fi
      fi

      if [ $COUNT -le 1 ]; then
        echo ""
        echo "=============================================================="
        echo "TEST $test: $DESCR"
        echo "=============================================================="
        echo "${CMD[@]}"
      fi

      # execute operation
      set +e
      RESULT=$("${CMD[@]}" 2>/dev/null)
      EXIT_CODE=$?
      if [ $EXIT_CODE -ne 0 ]; then
        if [ $EXIT_CODE -eq 7 ]; then
          printf "CURL ERROR 7: Failed to connect() to host or proxy.\n"
        elif [ $EXIT_CODE -eq 52 ]; then
          printf "CURL ERROR 52: Empty reply from server.\n"
        elif [ $EXIT_CODE -eq 56 ]; then
          printf "CURL ERROR 56: Recv failure: Connection reset by peer.\n"
        else
          printf "CURL ERROR $EXIT_CODE\n"
        fi
        printf "${RESULT}"
        printf '\n'
        exit 1
      fi
      set -e

      echo "$RESULT" | awk -v bl=1 'bl{bl=0; h=($0 ~ /HTTP\/1/)} /^\r?$/{bl=1} {print $0>(h?"headers.tmp":"body.tmp")}'
      HEADERS=$(<headers.tmp)
      ACT=$(<body.tmp)

      ACT=$(echo "$ACT" | sed "s/\r//g" | sed "s/\n\n/\n/g")
      EXP=$(echo "$EXP" | sed "s/\r//g" | sed "s/\n\n/\n/g")

      OK=0
      if [ "$OP" == "equals" ]; then
        [[ "$ACT" == "$EXP" ]] && OK=1
      elif [ "$OP" == "startsWith" ]; then
        EXP=$( echo "$EXP" | sed 's|\\|\\\\|g' | sed 's|\[|\\[|g' | sed 's|\]|\\]|g')
        if echo "$ACT" | grep -q "^${EXP}"; then
          OK=1
        fi
      elif [ "$OP" == "contains" ]; then
        EXP=$( echo "$EXP" | sed 's|\\|\\\\|g' | sed 's|\[|\\[|g' | sed 's|\]|\\]|g')
        if echo "$ACT" | grep -q "${EXP}"; then
          OK=1
        fi
      fi

      if [ $OK -eq 1 ]; then
        if [ $COUNT -le 1 ]; then
          echo -------------------------
          echo "[Response Headers]"
          echo "$HEADERS"
          echo -------------------------
          echo "[Response Body]"
          echo "$ACT"
          echo -------------------------
          echo "[Expected Body: $OP]"
          echo "$EXP"
          echo -------------------------
          printf "$OK_CHECK Success!\n"
        fi
      else
          echo -------------------------
          printf "$FAIL_MARK TEST $test Failed! \n"
          echo -------------------------
          if [ $COUNT -gt 1 ]; then
            # only show headers for load tests when an error occurs
            echo "=============================================================="
            echo "TEST $test: $DESCR"
            echo "=============================================================="
            echo -------------------------
            printf '%q ' "${CMD[@]}"
            echo -------------------------
          fi
          echo "[Response Headers]"
          echo "$HEADERS"
          echo -------------------------
          echo "[Response Body]"
          echo "$ACT"
          echo -------------------------
          echo "[Expected Body: $OP]"
          echo "$EXP"
          echo -------------------------
          printf "$FAIL_MARK TEST $test Failed! \n"
          echo -------------------------
          exit 1
      fi
    done
    if [ $COUNT -gt 1 ]; then
      printf "$OK_CHECK $i \n"
    fi
  done

  echo ""
  echo "================================"
  printf "$OK_CHECK ALL TESTS PASS! \n"
  echo "================================"
  echo ""
}

if [ $COUNT -gt 1 ]; then
  time run_tests
else
  run_tests
fi
