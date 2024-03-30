set -xe
# Get absolute path for script, and convenience vars for virtual and root
VIRT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "VIRT_DIR: ${VIRT_DIR}"

# CREATE VAGRANT FILE
VAGRANT_OS=${VAGRANT_OS:-"mac_os_m1"}
cp Vagrantfile_${VAGRANT_OS} "${VIRT_DIR}/Vagrantfile"
# Install vagrant and plugin
if [ ! -f /usr/local/bin/vagrant ]; then
  brew install vagrant
fi
# CREATE SSH KEY
yes n | ssh-keygen -q -t rsa -f ~/.ssh/id_rsa -C "" -N "" || echo "key exists"

# CREATE VIRTUAL MACHINE
vagrant up