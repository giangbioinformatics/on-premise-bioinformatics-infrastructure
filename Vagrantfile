# -*- mode: ruby -*-
# mac prefix for vmware fusion virtual machine
Vagrant.configure("2") do |config|
  # mac-l1-c2r4: login node 1, 2 cpus and 4 GBs ram
  config.vm.define "mac-l1-c2r4" do |subconfig|
    subconfig.vm.hostname = "mac-l1-c2r4"
    subconfig.vm.box = "bento/ubuntu-20.04-arm64"
    subconfig.vm.box_version = "202306.30.0"
    subconfig.vm.box_download_insecure = true
    subconfig.vm.network "private_network", ip: "192.168.58.10"
    subconfig.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    subconfig.vm.provider "vmware_desktop" do |pvm|
      pvm.ssh_info_public = true
      pvm.linked_clone = false
      pvm.gui = true
      pvm.linked_clone =   false
      pvm.vmx["ethernet0.virtualdev"] = "vmxnet3"
      pvm.vmx["ethernet0.pcislotnumber"] = "33"
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
  config.vm.define "l1-c2r4" do |subconfig|
    subconfig.vm.hostname = "l1-c2r4"
    subconfig.vm.box = "bento/ubuntu-20.04"
    subconfig.vm.box_version = "202306.30.0"
    subconfig.vm.box_download_insecure = true
    subconfig.vm.network "private_network", ip: "192.168.58.10"
    subconfig.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    subconfig.vm.provider "virtualbox" do |pvm|
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end

  # Additional machine 1 with 2CPUs and 4GB RAM
  # mac-c1-c2r4: node 1, 2 cpus and 4 GBs ram
  config.vm.define "mac-c1-c2r4" do |machine1|
    machine1.vm.hostname = "mac-c1-c2r4"
    machine1.vm.box = "bento/ubuntu-20.04-arm64"
    machine1.vm.box_version = "202306.30.0"
    machine1.vm.box_download_insecure = true
    machine1.vm.network "private_network", ip: "192.168.58.11"
    machine1.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    machine1.vm.provider "vmware_desktop" do |pvm|
      pvm.ssh_info_public = true
      pvm.gui = true
      pvm.linked_clone = false
      pvm.vmx["ethernet0.virtualdev"] = "vmxnet3"
      pvm.vmx["ethernet0.pcislotnumber"] = "33"
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
  config.vm.define "c1-c2r4" do |machine1|
    machine1.vm.hostname = "c1-c2r4"
    machine1.vm.box = "bento/ubuntu-20.04"
    machine1.vm.box_version = "202306.30.0"
    machine1.vm.box_download_insecure = true
    machine1.vm.network "private_network", ip: "192.168.58.11"
    machine1.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    machine1.vm.provider "virtualbox" do |pvm|
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
end