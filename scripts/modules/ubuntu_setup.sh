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
    curl -O https://releases.hashicorp.com/vagrant/{VAGRANT_VERSION}/vagrant_{VAGRANT_VERSION}_x86_64.deb

    # Install Vagrant
    echo "Installing Vagrant..."
    sudo dpkg -i vagrant_{VAGRANT_VERSION}_x86_64.deb

    # Clean up downloaded package
    echo "Cleaning up..."
    rm vagrant_{VAGRANT_VERSION}_x86_64.deb

    echo "Vagrant installation completed."

    # All done
    echo "Setup completed successfully."
}

install_virtual_machine_ubuntu(){
    
}