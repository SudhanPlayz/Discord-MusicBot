# This file is basically a wrapper for the dc.sh script.
# It is used to make the docker-compose commands easier to use.
# Basically acting as an alias for the dc.sh script.

all: rebuild


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

up:
	@./dc.sh up $(filter-out $@,$(MAKECMDGOALS))

lite:
	@./dc.sh lite $(filter-out $@,$(MAKECMDGOALS))

del:
	@./dc.sh del $(filter-out $@,$(MAKECMDGOALS))

%:
	@./dc.sh $@
