SHELL := /bin/bash
export COMPOSE_PROJECT_NAME=uplink-hub
export SUBGRAPH_BOOT_TIME=2

# local composition

.PHONY: config
config:
	scripts/config.sh "localhost" > ./supergraph/schema/local.yaml 2>/dev/null
	scripts/config.sh "kubernetes" > ./supergraph/schema/kubernetes.yaml 2>/dev/null

.PHONY: compose
compose:
	@set -x; cd supergraph/schema; \
	  rover supergraph compose --elv2-license=accept --config local.yaml > local.graphql
	@set -x; cd supergraph/schema; \
	  rover supergraph compose --elv2-license=accept --config kubernetes.yaml > kubernetes.graphql

.PHONY: integration
integration:
	scripts/integration-tests.sh

.PHONY: up-subgraphs
up-subgraphs:
	docker compose \
	 -f docker-compose.yaml \
	 up -d --build
	@set -x; sleep $$SUBGRAPH_BOOT_TIME
	docker compose logs

.PHONY: run-router-local
run-router-local:
	@set -x; \
	 ./supergraph/router --version && \
	 ./supergraph/router --dev \
	  -c ./supergraph/router.yaml \
	  -s ./supergraph/schema/local.graphql \
	  --log info

.PHONY: run-supergraph-local
run-supergraph-local: up-subgraphs config compose run-router-local

.PHONY: test
run-test: 
	node test.js
