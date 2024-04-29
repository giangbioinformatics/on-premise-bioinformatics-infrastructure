# Slurm Deployment Guide

Instructions for deploying a GPU cluster with Slurm

- [Slurm Deployment Guide](#slurm-deployment-guide)
  - [Monitoring Slurm](#monitoring-slurm)
  - [Centralized syslog](#centralized-syslog)
  - [Configuring shared filesystems](#configuring-shared-filesystems)
  - [Pyxis, Enroot, and Singularity](#pyxis-enroot-and-singularity)

## Monitoring Slurm
For more details, follow [SLURM MONITOR](./monitor.md)
As part of the Slurm installation, Grafana and Prometheus are both deployed.

The services can be reached from the following addresses:

- Grafana: http://\<slurm-master\>:3000
- Prometheus: http://\<slurm-master\>:9090

## Centralized syslog

To enable syslog forwarding from the cluster nodes to the first Slurm controller node, you can set the following variables in your DeepOps configuration:

```
slurm_enable_rsyslog_server: true
slurm_enable_rsyslog_client: true
```

For more information about our syslog forwarding functionality, please see the [centralized syslog guide](../misc/syslog.md).

## Configuring shared filesystems

For information about configuring a shared NFS filesystem on your Slurm cluster, see the documentation on [Slurm and NFS](./nfs.md).

## Configuring network information system 

For information about configuring a synchronous user and groups between nodes in clusters, see the documentation on [Slurm and NIS](./nis.md).
