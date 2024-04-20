#!/bin/bash
# CONFIG
VAGRANT_VERSION="2.4.1"
PYTHON_VERSION="3.9.13"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR=$(realpath ${SCRIPT_DIR}/..)
# LOAD MODULES
. ${ROOT_DIR}/scripts/modules/common_setup.sh
. ${ROOT_DIR}/scripts/modules/macos_setup.sh
. ${ROOT_DIR}/scripts/modules/ubuntu_setup.sh
# Check the operating system
if [ "$(uname)" == "Darwin" ]; then
    echo "macOS detected."
    OS="macos"
    # Insert macOS setup commands here
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Ubuntu/Linux detected."
    export DEBIAN_FRONTEND=noninteractive
    OS="ubuntu"
    # Insert Ubuntu setup commands here
else
    echo "Unsupported operating system."
    exit 1
fi

# Run the setup commands
# 1. Install python venv with ansible core
install_python_venv
# 2. Install ansible dependencies
ansible_galaxy_install
# 3. Install the vagrant
if [ "${OS}" == "macos" ]; then
    setup_macos
elif [ "${OS}" == "ubuntu" ]; then
    setup_ubuntu
fi
# 4. Create the VM machines
if []
up_vm_and_inventory
# 5. Setup the cluster
setup_cluster
