# On-Premise Bioinformatics Infrastructure

This repository provides configurations for setting up a local infrastructure tailored for bioinformatics analysis, leveraging [Slurm](https://slurm.schedmd.com/overview.html).

## Machines

### Monitor Server:
- **geerlingguy.docker**: Docker container
- **prometheus**: Metrics collection for monitoring
- **alertmanager**: Alerts to Slack channel with specific rules (e.g., down node)
- **grafana**: Dashboard for monitoring resource usage

### Slurm HPC:
#### Common Roles:
- `nextflow`
- `mambaorg.micromamba`
- `geerlingguy.docker`
- `prometheus-node-exporter`
- `abims_sbr.singularity`

#### Specific Nodes:
- **Controller Node:**
  - `slurm-master`: Controller and login node
  - `rsyslog-server`: Syslog server controller

- **Worker Nodes:**
  - `slurm-worker`: Computing nodes
  - `rsyslog-client`: Syslog client worker

## Setup Steps

### Step 1: Set Up Machines

If you don't have the required machines but still want to test this repository, you can use virtual machines with Vagrant support.

**For Virtual Setup:**
```bash
bash scripts/setup.sh
```

**For Real Machines:**
```bash
bash scripts/ansible_only.sh
```
Before running `ansible-playbook`, adjust your hosts configuration in `inventories/hosts`:
```bash
source env/bin/activate
ansible-playbook -i inventories/hosts setup_cluster.yml
```

### Step 2: Testing

#### Monitoring:
Access Grafana at `<monitoring_node_id>:3000`

#### Slurm Cluster:
Login to Slurm:
```bash
ssh <user>@<slurm_login>
```
Run the Nextflow workflow:
```bash
bash fetchngs/fetchngs.sh
# Check your results at fetchngs/output
```

By following these steps, you'll have your on-premise bioinformatics infrastructure set up and ready for use.
