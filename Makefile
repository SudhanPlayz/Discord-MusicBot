#
# Makefile that handles all the static file compilation / docker and
# adds some helper tools for daily development.
#

SHELL=/bin/bash -eu -o pipefail

define N # newline


endef

.PHONY: test
test: ## Run nodemon to watch and deploy each time code change happens
	nodemon

.PHONY: code-cleanup
code-cleanup: ## Prettify the code base, and check it.
	prettier --write .
	prettier --check .

.PHONY: release-docker
release-docker: # Release to dockerHub
	set -ex
	npm install
	docker build -t darrenofficial/dmusicbot:v4 .
	@echo -e "\n\n💫 All Good. Now do: docker push darrenofficial/dmusicbot:v4"

.PHONY: help
help:
	@echo -e "Available make commands:"
	@echo -e ""
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sort | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"

.DEFAULT_GOAL := start
