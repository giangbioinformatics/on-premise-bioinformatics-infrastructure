#!/bin/bash 
#SBATCH --job-name=code-server
#SBATCH --time=04:00:00
#SBATCH --output=code_server_%N.log 
#SBATCH --mem=1gb 
#SBATCH --cpus-per-task=1

PASSWORD=1234 # TODO: Change to secure password
PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
echo "********************************************************************" 
echo "Starting code-server in Slurm"
echo "Environment information:" 
echo "Date:" $(date)
echo "Allocated node:" $(hostname)
echo "Node IP:" $(ip a | grep 192.168)
echo "Path:" $(pwd)
echo "Password to access VSCode:" $PASSWORD
echo "Listening on:" $PORT
echo "********************************************************************" 
