#!/usr/bin/env bash

PROJECT_NAME=$(basename $(pwd) | tr  '[:upper:]' '[:lower:]')

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

DOCKER="docker compose \
        --file docker/docker-compose.yml \
        -p ${PROJECT_NAME}"
        
COMPOSE_CONTAINERS=$(${DOCKER} \
ps \
--format table | grep -v "NAME" | awk '{print $1}' )

# Start of utility
if [[ "$1" = "up" ]]; then
    shift

    if [[ "$1" = "help" ]]; then
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
    elif [[ "$1" = "no-docker" ]]; then
        shift
        # Run the bot without docker
        cd ./djs-bot && npm run start
        exit 130
    else 
        OPTIONS=$@
        export ENABLE=db-start # Enable the database by default
        COMMAND="${DOCKER} up -d --remove-orphans"
        while [[ "$1" != "" ]]; do
            case $1 in
                nodb)
                    export ENABLE=start # Disable the database startup script from running
                    COMMAND+=" --scale postgres-db=0"
                    ;;
                noll) 
                    COMMAND+=" --scale lavalink=0"
                    ;;
                nofe) 
                    COMMAND+=" --scale dashboard=0"
                    ;;
                *) 
                    echo -e "\033[91mInvalid option: $1\033[0m"
                    exit 2
                    ;;
            esac
            shift
        done
    fi
    
    # Start the project
    ${COMMAND}

    echo -e "\n\033[92;4mProject started: \033[90m$(date)\033[0m"
    echo -e "\033[3m${PROJECT_NAME}\033[23m is now running.\n"
    
    echo -e "\033[93;4mType \033[3m$0 help\033[23m\033[93m for more options.\033[0m\n"
    exit 130

elif [[ "$1" = "enter" ]]; then
    shift
    
    if [[ "$1" = "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 enter <container> [fs]\033[23m"
        echo -e "\033[93;4mOptions:\033[0m"
        echo -e "\t\033[3mfs\033[23m\tEnter the container's filesystem"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 enter php\033[23m"
        echo -e "\t\033[3m$0 enter php fs\033[23m"
        exit 3
    elif [[ ${COMPOSE_CONTAINERS} == "" ]]; then
        echo -e "\033[91mNo containers found, make sure the project is running.\033[0m"
        exit 126
    elif [[ "$1" != "" ]]; then
        CONTAINER=$(docker ps | grep $1 | awk '{print $1}') 
        echo -e "\033[93;4mEntering container:\033[0m \033[3m$1\033[23m\n"
        
        # Additional option to enter the container's filesystem
        if [[ "$2" != "" && "$2" = "fs" ]]; then
            docker exec -it "${CONTAINER}" /bin/bash
            exit 130
        elif [[ "$2" != "" ]]; then
            echo -e "\033[91mInvalid option: $2\033[0m"
            exit 2
        else
            # Enter the container's active process
            echo -e "\033[93;4mPress CTRL+P then CTRL+Q to detach from the container.\033[0m\n"
            docker attach ${CONTAINER}
            exit 130
        fi
    else 
        echo -e "\033[93;4mPlease specify the container name:\033[0m"
        echo -e "\n\t\033[4mAvailable containers:\033[24m"
        echo -e "\033[3m${COMPOSE_CONTAINERS}\033[23m\n"
        exit 2
    fi

elif [[ "$1" = "rebuild" ]]; then

    ${DOCKER} down
    ${DOCKER} build
    ${DOCKER} up -d --force-recreate --remove-orphans

elif [[ "$1" = "down" ]]; then

    ${DOCKER} down

elif [[ "$1" = "purge" ]]; then

    ${DOCKER} down
	docker system prune -a
    docker rmi "$(docker images -a -q)"
    docker rm "$(docker ps -a -f status=exited -q)"
    docker volume prune

elif [[ "$1" = "del" ]]; then
    shift

    if [[ "$1" = "help" ]]; then
        echo -e "\033[93;4mUsage:\033[0m"
        echo -e "\t\033[3m$0 del <container>\033[23m"
        echo -e "\033[93;4mExamples:\033[0m"
        echo -e "\t\033[3m$0 del php\033[23m"
        exit 3
    elif [[ ${COMPOSE_CONTAINERS} == "" ]]; then
        echo -e "\033[91mNo containers found, make sure the project is running.\033[0m"
        exit 126
    elif [[ "$1" != "" ]]; then
        # get the ID of the container to delete, from the the inputted name
        SERVICE=$(docker ps | grep $1 | awk '{print $1}')
        SERVICE_IMAGE=$(docker ps | grep $1 | awk '{print $2}')
        echo -e "\033[93;4mStopping container: \033[0m\033[3m$1\033[23m"
        docker stop ${SERVICE} > /dev/null 2>&1
        docker rmi ${SERVICE_IMAGE} -f > /dev/null 2>&1
        echo -e "\033[92;4mImage deleted: \033[90m$(date)\033[0m"
        exit 130
    else 
        echo -e "\033[93;4mPlease specify the container name:\033[0m"
        echo -e "\n\t\033[4mAvailable containers:\033[24m"
        echo -e "\033[3m${COMPOSE_CONTAINERS}\033[23m\n"
        exit 2
    fi

elif [[ "$1" = "log" ]]; then

    ${DOCKER} logs -f --tail="100"

elif [[ "$1" = "help" ]]; then

    echo -e "\033[93;4mUsage:\033[0m"
    echo -e "\t\033[3m$0 <command>\033[23m"
    echo -e "\033[93;4mCommands:\033[0m"
    echo -e "  up [help]   \tStart the project"
    echo -e "  down    \tStop the project"
    echo -e "  enter    \tEnter a container"
    echo -e "  log    \tView the logs"
    echo -e "  rebuild    \tRebuild the project"
    echo -e "  purge    \tPurge the project"
    echo -e "  help    \tView this help"
    echo -e "\033[93;4mOptions:\033[0m"
    echo -e "  --help    \tView the docker-compose help"
    echo -e "\033[93;4mExamples:\033[0m"
    echo -e "  \033[3m$0 up [nodb] [noll] [nofe]\033[23m"
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
