# 2. Install vagrant
# Check if Vagrant is already installed
# Function to install Vagrant on Ubuntu
install_vagrant_ubuntu() {
    # Check if Vagrant is already installed
    if command -v vagrant &>/dev/null; then
        echo "Vagrant is already installed."
        exit 0
    fi

    # Check if curl is installed
    if ! command -v curl &>/dev/null; then
        echo "curl is not installed. Please install curl first."
        exit 1
    fi

    # Download Vagrant package
    echo "Downloading Vagrant..."
    curl -O https://releases.hashicorp.com/vagrant/${VAGRANT_VERSION}/vagrant_${VAGRANT_VERSION}_x86_64.deb

    # Install Vagrant
    echo "Installing Vagrant..."
    sudo dpkg -i vagrant_${VAGRANT_VERSION}_x86_64.deb

    # Clean up downloaded package
    echo "Cleaning up..."
    rm vagrant_${VAGRANT_VERSION}_x86_64.deb
    echo "Vagrant installation completed."

}

install_virtual_machine_ubuntu(){
    # install and start service of libvirtd
    export LIBVIRT_GROUP="libvirt"
    if ! groups "$(whoami)" | grep "${LIBVIRT_GROUP}"; then
      echo "Adding your user to ${LIBVIRT_GROUP} so you can manage VMs."
      echo "You may need to start a new shell to use vagrant interactively."
      sudo usermod -a -G libvirt "$(whoami)"
    fi
    # add user to the libvirt group to manage the vms
    case "${VERSION_ID}" in
      20.*)
        export LIBVIRT_GROUP="libvirt"
	;;
      *)
        export LIBVIRT_GROUP="libvirtd"
	;;
    esac
    if ! groups "$(whoami)" | grep "${LIBVIRT_GROUP}"; then
      echo "Adding your user to ${LIBVIRT_GROUP} so you can manage VMs."
      echo "You may need to start a new shell to use vagrant interactively."
      sudo usermod -a -G libvirt "$(whoami)"
    fi
}

# Full setup for Ubuntu
setup_ubuntu(){
    install_vagrant_ubuntu
    install_virtual_machine_ubuntu
    install_vagrant_vm_plugins
}