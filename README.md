# ON-PREMISE BIOINFORMATICS INFRASTRUCTURE
## SLURM CLUSTER
This repo for setting up the  local infrastructure for bioinformatics analysis using
[Slurm](https://slurm.schedmd.com/overview.html)

For roles details, check this: [role documentations](docs/README.md)


Machines: 
+ Monitor server:
    + geerlingguy.docker: Docker container
    + prometheus: monitoring metrics collection
    + alertmanager: alert to slack channel with specific rules. Ex: down node
    + grafana: dashboard for monitoring usage
    

+ Slurm HPC:
    For common roles:
    + nextflow
    + mambaorg.micromamba
    + geerlingguy.docker (only for sudo group user)
    + docker-rootless (if user requests)
    + prometheus-node-exporter
    + abims_sbr.singularity
    + goofys s3 storage mount

    For specific nodes:
    + Controller node
        + slurm-master: controller and login node
        + rsyslog-server: syslog server controller

    + Worker nodes
        + slurm-worker: computing nodes
        + rsyslog-client: syslog client worker
        
### Step 1:
Requirements: python3, python3-venv
If you do not have have the machines but still want to test this repo, 
try to use the virtual machine with vagrant support.
Create the virtual env. It requires to install python and and vagrant, vmware_fusion for mac m1,2,3 or virtualmachine for other linux kernel

With virtual setup
```
bash scripts/setup.sh
```
With your real machines
```
bash scripts/ansible_only.sh
```
Adjust your hosts before running ansible-playbook
`inventories/hosts`
```
source env/bin/activate
ansible-playbook -i inventories/hosts river_cluster.yml
```
### Step 2: 
Test
Monitoring:
Grafana: `<monitoring_node_id>:3000`

Slurm cluster:
Login to slurm 
```
ssh <user>@<slurm_login>
```
Run the nextflow workflow
```
bash fetchngs/fetchngs.sh
# check your result at fetchngs/output
```

## SINGLE MACHINE
Follow the session slurm cluster, on the second step, change to run this:
```
source env/bin/activate
ansible-playbook -i inventories/hosts river_local.yml
```

It will install:
+ nextflow
+ mambaorg.micromamba
+ geerlingguy.docker
+ abims_sbr.singularity
+ goofys s3 storage mount

Note: due to the single machine, the metrics services do not need to install.