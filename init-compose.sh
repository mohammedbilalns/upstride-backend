#! /bin/bash

source svc-helper

services_to_stop=("redis-server" "rabbitmq")
services_to_start=("docker")

for svc in "${services_to_stop[@]}"; do
    stop_if_running "$svc"
done

for svc in "${services_to_start[@]}"; do
    start_if_not_running "$svc"
done

docker-compose up 
