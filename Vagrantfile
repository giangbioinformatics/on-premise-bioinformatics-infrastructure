# -*- mode: ruby -*-
# Note: Not use the docker-compose provisioner for the mac machines as it has the bug for the url to download
def configure_mac(config, s3_machine = false)
  config.vm.box = "bento/ubuntu-20.04-arm64"
  config.vm.box_version = "202306.30.0"
  config.vm.box_download_insecure = true
  config.vm.provision :docker if s3_machine
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
  config.vm.provider "vmware_desktop" do |pvm|
    pvm.ssh_info_public = true
    pvm.linked_clone = false
    pvm.gui = true
    pvm.linked_clone = false
    pvm.vmx["ethernet0.virtualdev"] = "vmxnet3"
    pvm.vmx["ethernet0.pcislotnumber"] = "33"
    pvm.memory = s3_machine ? 2048 : 4096
    pvm.cpus = s3_machine ? 1 : 2
  end
  
end

def configure_non_mac(config, s3_machine = false)
  config.vm.box = "bento/ubuntu-20.04"
  config.vm.box_version = "202306.30.0"
  config.vm.box_download_insecure = true
  config.vm.provision :docker if s3_machine
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
  config.vm.provider "virtualbox" do |pvm|
    pvm.memory = s3_machine ? 2048 : 4096
    pvm.cpus = s3_machine ? 1 : 2
  end
  
end

Vagrant.configure("2") do |config|
  config.vm.define "mac-s3" do |mac_s3|
    mac_s3.vm.hostname = "mac-s3"
    mac_s3.vm.network "private_network", ip: "192.168.58.10"
    configure_mac(mac_s3, true)
    mac_s3.vm.provision "file", source: "scripts/setup_s3.sh", destination: "~/setup_s3.sh"
    mac_s3.vm.provision "shell", inline: "chmod +x /home/vagrant/setup_s3.sh && /home/vagrant/setup_s3.sh"
  end

  # Mac machines
  (1..2).each do |i|
    config.vm.define "mac#{i}" do |mac|
      mac.vm.hostname = "mac-l#{i}-c2r4"
      configure_mac(mac)
      mac.vm.network "private_network", ip: "192.168.58.1#{i}"
    end
  end

  # Non-mac machines
  config.vm.define "non_mac_s3" do |non_mac_s3|
    non_mac_s3.vm.hostname = "non_mac1_s3"
    configure_non_mac(non_mac_s3, true)
    non_mac_s3.vm.provision "file", source: "scripts/setup_s3.sh", destination: "/home/vagrant/setup_s3.sh"
    non_mac_s3.vm.provision "shell", inline: "chmod +x /home/vagrant/setup_s3.sh && /home/vagrant/setup_s3.sh"
  end

  (1..2).each do |i|
    config.vm.define "non_mac#{i}" do |non_mac|
      non_mac.vm.hostname = "l#{i}-c2r4"
      configure_non_mac(non_mac)
      non_mac.vm.network "private_network", ip: "192.168.58.1#{i}"
    end
  end
end
