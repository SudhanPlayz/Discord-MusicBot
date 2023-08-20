#!/usr/bin/env bash

PROJECT_NAME=$(basename $(pwd) | tr '[:upper:]' '[:lower:]')

echo -e "\
    OS: \033[38;5;51m$(uname)\033[0m\n\
    ARCHITECURE: \033[38;5;51m$(uname -m)\033[0m\n\
    PROJECT_NAME: \033[38;5;51m${PROJECT_NAME}\033[0m\n\
    PROJECT_PATH: \033[38;5;51m$(pwd)\033[0m\n"

if [ ! -d "./docker" ]; then
    echo -e "\033[91mNo docker directory found, please create one or relocate this script to the appropriate directory.\033[0m"
    exit 126
elif [ ! -f "docker/docker-compose.yml" ]; then
    echo -e "\033[91mNo docker-compose.yml file found, please create one.\033[0m"
    exit 126
fi

if [ ! -f "docker/.env" ]; then
    if [ -f "djs-bot/.env" ]; then
        echo -e "\033[93;4mCopying .env file from djs-bot to docker.\033[0m"
        cp djs-bot/.env docker/.env
    else
        echo -e "\033[91mNo .env file found, please create one.\033[0m"
        exit 126
    fi
else
    if ! cmp -s docker/.env djs-bot/.env; then
        echo -e "\033[93;4mCopying .env file from djs-bot to docker.\033[0m"
        cp djs-bot/.env docker/.env
    fi
fi

DOCKER="docker compose \
    --file docker/docker-compose.yml \
    -p ${PROJECT_NAME}"

COMPOSE_CONTAINERS=$(${DOCKER} \
    ps --all \
    --format table | grep -v "NAME" | awk '{print $1}')

COMPOSE_CONTAINERS_RUNNING=$(${DOCKER} \
    ps \
    --format table | grep -v "NAME" | awk '{print $1}')

# creates 2 files named .SERVICES and .ENABLE
# used for setting variable for the parent
parse_start_options() {
    echo djs-bot dashboard postgres-db lavalink >.SERVICES
    echo db-start >.ENABLE # Enable the database by default

    while [[ "$1" != "" ]]; do
        case $1 in
        nodb)
            echo start >.ENABLE # Disable the database startup script from running
            sed -i "s/postgres-db//" .SERVICES
            ;;
        noll)
            sed -i "s/lavalink//" .SERVICES
            ;;
        nofe)
            sed -i "s/dashboard//" .SERVICES
            ;;
        *)
            echo -e "\033[91mInvalid option: $1\033[0m"
            return 2
            ;;
        esac
        shift
    done

    return 0
}

# creates 2 files named .SERVICES and .ENABLE
# used for setting variable for the parent
parse_lite_options() {
    echo djs-bot >.SERVICES
    echo start >.ENABLE # Disable the database by default

    while [[ "$1" != "" ]]; do
        case $1 in
        db)
            echo db-start >.ENABLE # Disable the database startup script from running
            sed -i "s/$/ postgres-db/" .SERVICES
            ;;
        ll)
            sed -i "s/$/ lavalink/" .SERVICES
            ;;
        fe)
            sed -i "s/$/ dashboard/" .SERVICES
            ;;
        *)
            echo -e "\033[91mInvalid option: $1\033[0m"
            return 2
            ;;
        esac
        shift
    done

    return 0
}

create_and_run() {
    echo -e "\n\033[92;4mCreating container for: \033[90m$SERVICES\033[0m"
    ${DOCKER} create --pull never --remove-orphans $@ $SERVICES

    echo -e "\n\033[92;4mStarting \033[90m$SERVICES\033[0m"
    ${DOCKER} start $SERVICES

    echo -e "\n\033[92;4mProject started: \033[90m$(date)\033[0m"
    echo -e "\033[3m${PROJECT_NAME}\033[23m is now running.\n"

    echo -e "\033[93;4mType \033[3m$0 help\033[23m\033[93m for more options.\033[0m\n"
}

cleanup_file_vars() {
    rm .ENABLE .SERVICES
}

# Start of utility
if [[ "$1" == "up" ]]; then
    shift

    if [[ "$1" == "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 up [nodb] [noll] [nofe]\033[23m"
        echo -e "\033[93;4mOptions:\033[0m"
        echo -e "\t\033[3mnodb\033[23m\tStart the project without the database"
        echo -e "\t\033[3mnoll\033[23m\tStart the project without the Lavalink server"
        echo -e "\t\033[3mnofe\033[23m\tStart the project without the frontend"
        echo -e "\t\033[3mno-docker\033[23m\tStart the project without docker"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 up\033[23m"
        echo -e "\t\033[3m$0 up nodb\033[23m"
        echo -e "\t\033[3m$0 up noll\033[23m"
        echo -e "\t\033[3m$0 up nofe\033[23m"
        echo -e "\t\033[3m$0 up nodb noll nofe\033[23m"
        exit 3
    elif [[ "$1" == "no-docker" ]]; then
        shift
        # Run the bot without docker
        cd ./djs-bot && npm run start
    else
        parse_start_options $@
        export ENABLE=$(cat .ENABLE)
        SERVICES=$(cat .SERVICES)

        # Pull the required images
        echo -e "\033[92;4mPulling images for: \033[90m$SERVICES\033[0m"
        ${DOCKER} pull $SERVICES
        create_and_run

        cleanup_file_vars
    fi

    echo -e "\033[95mExiting gracefully with code 130\033[0m"
    exit 130

elif [[ "$1" == "lite" ]]; then
    shift

    if [[ "$1" == "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 lite [db] [ll] [fe]\033[23m"
        echo -e "\033[93;4mOptions:\033[0m"
        echo -e "\t\033[3mdb\033[23m\tStart the project with the database"
        echo -e "\t\033[3mll\033[23m\tStart the project with the Lavalink server"
        echo -e "\t\033[3mfe\033[23m\tStart the project with the frontend"
        echo -e "\t\033[3mdocker\033[23m\tStart the project with docker"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 lite\033[23m"
        echo -e "\t\033[3m$0 lite db\033[23m"
        echo -e "\t\033[3m$0 lite ll\033[23m"
        echo -e "\t\033[3m$0 lite fe\033[23m"
        echo -e "\t\033[3m$0 lite db ll fe\033[23m"
        exit 3
    elif [[ "$1" == "" ]]; then
        # Run the bot without docker
        cd ./djs-bot && npm run start
    else
        if [[ "$1" == "docker" ]]; then
            shift
        fi

        parse_lite_options $@
        export ENABLE=$(cat .ENABLE)
        SERVICES=$(cat .SERVICES)

        # Pull the required images
        echo -e "\033[92;4mPulling images for: \033[90m$SERVICES\033[0m"
        ${DOCKER} pull $SERVICES
        create_and_run

        cleanup_file_vars
    fi

    echo -e "\033[95mExiting gracefully with code 130\033[0m"
    exit 130

elif [[ "$1" == "enter" ]]; then
    shift

    if [[ "$1" == "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 enter <container> [fs]\033[23m"
        echo -e "\033[93;4mOptions:\033[0m"
        echo -e "\t\033[3mfs\033[23m\tEnter the container's filesystem"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 enter php\033[23m"
        echo -e "\t\033[3m$0 enter php fs\033[23m"
        exit 3
    elif [[ ${COMPOSE_CONTAINERS_RUNNING} == "" ]]; then
        echo -e "\033[91mNo containers found, make sure the project is running.\033[0m"
        exit 126
    elif [[ "$1" != "" ]]; then
        CONTAINER=$(docker ps | grep $1 | awk '{print $1}')
        echo -e "\033[93;4mEntering container:\033[0m \033[3m$1\033[23m\n"

        # Additional option to enter the container's filesystem
        if [[ "$2" != "" && "$2" == "fs" ]]; then
            docker exec -it "${CONTAINER}" /bin/bash
            echo -e "\033[95mExiting gracefully with code 130\033[0m"
            exit 130
        elif [[ "$2" != "" ]]; then
            echo -e "\033[91mInvalid option: $2\033[0m"
            exit 2
        else
            # Enter the container's active process
            echo -e "\033[93;4mPress CTRL+P then CTRL+Q to detach from the container.\033[0m\n"
            docker attach ${CONTAINER}
            echo -e "\033[95mExiting gracefully with code 130\033[0m"
            exit 130
        fi
    else
        echo -e "\033[93;4mPlease specify the container name:\033[0m"
        echo -e "\n\t\033[4mAvailable containers:\033[24m"
        echo -e "\033[3m${COMPOSE_CONTAINERS_RUNNING}\033[23m\n"
        exit 2
    fi

elif [[ "$1" == "rebuild" ]]; then
    shift

    ${DOCKER} down

    parse_start_options $@
    export ENABLE=$(cat .ENABLE)
    SERVICES=$(cat .SERVICES)

    ${DOCKER} pull $SERVICES
    ${DOCKER} build --no-cache $SERVICES

    create_and_run --force-recreate

    cleanup_file_vars
    echo -e "\033[95mExiting gracefully with code 130\033[0m"
    exit 130

elif [[ "$1" == "down" ]]; then

    ${DOCKER} down

elif [[ "$1" == "purge" ]]; then

    ${DOCKER} down
    docker system prune -a
    docker rmi "$(docker images -a -q)"
    docker rm "$(docker ps -a -f status=exited -q)"
    docker volume prune

elif [[ "$1" == "del" ]]; then
    shift

    if [[ "$1" == "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 del <container>\033[23m"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 del php\033[23m"
        exit 3
    elif [[ $COMPOSE_CONTAINERS == "" ]]; then
        echo -e "\033[91mNo containers found.\033[0m"
        exit 126
    elif [[ "$1" != "" ]]; then
        # get the ID of the container to delete, from the the inputted name
        SERVICE=$(docker container ls --all | grep $1 | awk '{print $1}')
        SERVICE_IMAGE=$(docker container ls --all | grep $1 | awk '{print $2}')

        echo -e "\033[93;4mContainer Name: \033[0m\033[3m$1\033[23m"
        echo -e "\033[93;4mContainer Id: ${SERVICE}\033[0m"
        echo -e "\033[93;4mContainer Image: ${SERVICE_IMAGE}\033[0m"

        SERVICE_IS_RUNNING=$(echo $COMPOSE_CONTAINERS_RUNNING | grep $1)
        if [[ $SERVICE_IS_RUNNING != '' ]]; then
            docker container stop $SERVICE >/dev/null 2>&1
            echo -e "\033[92;4mContainer stopped: \033[90m$(date)\033[0m"
        fi

        CONTAINER_EXIST=$(echo $COMPOSE_CONTAINERS | grep $1)
        if [[ $CONTAINER_EXIST != '' ]]; then
            docker container rm $SERVICE >/dev/null 2>&1
            echo -e "\033[92;4mContainer deleted: \033[90m$(date)\033[0m"
        fi

        if [[ $SERVICE_IMAGE != '' ]]; then
            docker rmi $SERVICE_IMAGE >/dev/null 2>&1
            echo -e "\033[92;4mImage deleted: \033[90m$(date)\033[0m"
        else
            echo -e "\033[93;4mContainer didn't exist, Image not deleted.\033[0m"
        fi

        echo -e "\033[95mExiting gracefully with code 130\033[0m"
        exit 130
    else
        echo -e "\033[93;4mPlease specify the container name:\033[0m"
        echo -e "\n\t\033[4mAvailable containers:\033[24m"
        echo -e "\033[3m${COMPOSE_CONTAINERS}\033[23m\n"
        exit 2
    fi

elif [[ "$1" == "log" ]]; then

    ${DOCKER} logs -f --tail="100"

elif [[ "$1" == "help" ]]; then

    echo -e "\033[93;4mUsage:\033[0m"
    echo -e "\t\033[3m$0 <command>\033[23m"
    echo -e "\033[93;4mCommands:\033[0m"
    echo -e "  up [help]   \tStart the project"
    echo -e "  lite [help]\tStart bot only without database, lavalink and dashboard"
    echo -e "  down    \tStop the project"
    echo -e "  enter    \tEnter a container"
    echo -e "  log    \tView the logs"
    echo -e "  rebuild    \tRebuild the project"
    echo -e "  purge    \tPurge the project"
    echo -e "  help    \tView this help"
    echo -e "\033[93;4mOptions:\033[0m"
    echo -e "  --help    \tView the docker-compose help"
    echo -e "\033[93;4mExamples:\033[0m"
    echo -e "  \033[3m$0 up nodb noll nofe\033[23m"
    echo -e "  \033[3m$0 lite db ll fe\033[23m"
    echo -e "  \033[3m$0 enter php\033[23m"
    echo -e "  \033[3m$0 enter php fs\033[23m"
    echo -e "  \033[3m$0 log\033[23m"
    echo -e "  \033[3m$0 rebuild\033[23m"
    echo -e "  \033[3m$0 purge\033[23m"
    echo -e "  \033[3m$0 --help\033[23m"
    echo -e "  \033[3m$0 help\033[23m"

elif [[ "$1" != "" ]]; then
    ${DOCKER} "$@"
fi

# vim: et sw=4
