# This file is basically a wrapper for the dc.sh script.
# It is used to make the docker-compose commands easier to use.
# Basically acting as an alias for the dc.sh script.

all: rebuild

up:
	@./dc.sh up

up-nodb:
	@./dc.sh up-nodb

down:
	@./dc.sh down

log:
	@./dc.sh log

purge:
	@./dc.sh purge

rebuild:
	@./dc.sh rebuild

enter:
	@./dc.sh enter $(filter-out $@,$(MAKECMDGOALS))

%:
	@./dc.sh $@
