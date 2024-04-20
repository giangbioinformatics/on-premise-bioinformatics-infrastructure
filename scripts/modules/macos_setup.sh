# 2. Install vagrant
# Check if Vagrant is already installed
# Function to install Vagrant on Ubuntu
# Set Vagrant version
# Install brew to set up easier
# Currently, macos is not mainly support, just for testing purposes
# The specific version is not defined
install_homebrew(){
    # Check if Homebrew is already installed
    if command -v brew &>/dev/null; then
        echo "Homebrew is already installed."
    else
        # by pass the prompt
        echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
}
install_vagrant_macos() {
# Check if Vagrant is already installed
    if command -v vagrant &>/dev/null; then
        echo "Vagrant is already installed."
    else
        brew install vagrant
        vagrant plugin install vagrant-vmware-desktop
    fi
}


# Full setup for Ubuntu
setup_macos(){
    install_homebrew
    install_vagrant_macos
}