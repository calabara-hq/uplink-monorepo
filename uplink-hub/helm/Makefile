SHELL := /bin/bash

# local composition

.PHONY: staging-secret
staging-secret:
	kubectl create secret generic staging-sealed-secret --from-env-file=../.env.staging --namespace=staging --dry-run=client -o yaml | yq e '.metadata.annotations += {"sealedsecrets.bitnami.com/managed": "true"}' > staging-sealed-secret.yaml
	kubeseal --fetch-cert > cert.pem
	kubeseal --format=yaml --cert=cert.pem < staging-sealed-secret.yaml > sealed-secrets/staging-sealed-secret.yaml
	rm cert.pem staging-sealed-secret.yaml 


.PHONY: production-secret
production-secret:
	kubectl create secret generic production-sealed-secret --from-env-file=../.env.staging --namespace=production --dry-run=client -o yaml | yq e '.metadata.annotations += {"sealedsecrets.bitnami.com/managed": "true"}' > production-sealed-secret.yaml
	kubeseal --fetch-cert > cert.pem
	kubeseal --format=yaml --cert=cert.pem < production-sealed-secret.yaml > sealed-secrets/production-sealed-secret.yaml
	rm cert.pem production-sealed-secret.yaml 
