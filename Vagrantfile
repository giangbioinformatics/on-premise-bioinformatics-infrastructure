# -*- mode: ruby -*-
# mac prefix for vmware fusion virtual machine
Vagrant.configure("2") do |config|
  # Mac machines
  config.vm.define "mac1" do |mac1|
    mac1.vm.hostname = "mac-l1-c2r4"
    mac1.vm.box = "bento/ubuntu-20.04-arm64"
    mac1.vm.box_version = "202306.30.0"
    mac1.vm.box_download_insecure = true
    mac1.vm.network "private_network", ip: "192.168.58.10"
    mac1.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    mac1.vm.provider "vmware_desktop" do |pvm|
      pvm.ssh_info_public = true
      pvm.linked_clone = false
      pvm.gui = true
      pvm.linked_clone = false
      pvm.vmx["ethernet0.virtualdev"] = "vmxnet3"
      pvm.vmx["ethernet0.pcislotnumber"] = "33"
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
  config.vm.define "mac2" do |mac2|
      mac2.vm.hostname = "mac-c1-c2r4"
    mac2.vm.box = "bento/ubuntu-20.04-arm64"
    mac2.vm.box_version = "202306.30.0"
    mac2.vm.box_download_insecure = true
    mac2.vm.network "private_network", ip: "192.168.58.11"
    mac2.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    mac2.vm.provider "vmware_desktop" do |pvm|
      pvm.ssh_info_public = true
      pvm.gui = true
      pvm.linked_clone = false
      pvm.vmx["ethernet0.virtualdev"] = "vmxnet3"
      pvm.vmx["ethernet0.pcislotnumber"] = "33"
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
  # Non-mac machines
  config.vm.define "non_mac1" do |non_mac1|
    non_mac1.vm.hostname = "l1-c2r4"
    non_mac1.vm.box = "bento/ubuntu-20.04"
    non_mac1.vm.box_version = "202306.30.0"
    non_mac1.vm.box_download_insecure = true
    non_mac1.vm.network "private_network", ip: "192.168.58.10"
    non_mac1.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
    non_mac1.vm.provider "virtualbox" do |pvm|
      pvm.memory = 4096
      pvm.cpus = 2
    end
  end
  config.vm.define "non_mac2" do |non_mac2|
      non_mac2.vm.hostname = "c1-c2r4"
      non_mac2.vm.box = "bento/ubuntu-20.04"
      non_mac2.vm.box_version = "202306.30.0"
      non_mac2.vm.box_download_insecure = true
      non_mac2.vm.network "private_network", ip: "192.168.58.11"
      non_mac2.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"
      non_mac2.vm.provider "virtualbox" do |pvm|
        pvm.memory = 4096
        pvm.cpus = 2
    end
  end
end