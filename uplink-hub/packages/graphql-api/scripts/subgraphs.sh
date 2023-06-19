#!/bin/bash 

SUBGRAPH_NETWORKING="${1:-localhost}"

>&2 echo ""
if [[ "$SUBGRAPH_NETWORKING" == "kubernetes" ]]; then
  >&2 echo "Subgraphs will listen on different Kubernetes services (spaces.staging.svc.cluster.local, ...)"
  source "$(dirname $0)/subgraphs/kubernetes-networking.sh"
else
  >&2 echo "Subgraphs will listen on different localhost ports (4001, 4002, ...)"
  source "$(dirname $0)/subgraphs/localhost-networking.sh"
fi
>&2 echo ""
