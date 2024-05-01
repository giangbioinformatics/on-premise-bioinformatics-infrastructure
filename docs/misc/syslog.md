# Syslog

Centralized logging with syslog

- [Syslog](#syslog)
  - [Summary](#summary)
  - [Using an external syslog server](#using-an-external-syslog-server)

## Introduction

This River Computing (RC) playbooks include a minimal implementation of centralized cluster logging using rsyslog. This allows the admin to manage the system log of all machine in the cluster. By default, the syslog server is installed at the login/controller node (1 nodes) and the syslog client is installed at the worker nodes.

Rsyslog was selected for the minimal cluster logging implementation in order to provide a light-weight solution using software already installed on the nodes. This ensures that logs are recorded in one place, making it easier to debug node-specific issues even in the case where the nodes are down or non-responsive. However, for a more full-featured logging solution with search and visualization capabilities, we recommend deploying the  `ELK stack` or other log solution. Currently this full-featured logging is planned to used in the next release.

In the syslog-based implementation, the first cluster management node is selected as a syslog server and listens on `rsyslog_client_tcp_port` for connections. The remaining nodes in the cluster then forward their logs to the selected syslog server. Log files for remote nodes are stored on the syslog server in node-specific files under `/var/log/deepops-hosts`. Currently these directory is adopted by this folder, can be changed later.


## Using an external syslog server
For monitoring, the entire nodes in the slurm cluster, 
If your site already includes a syslog server, you can forward your logs there using the following variables:

- On Slurm: set `rsyslog_server` on the list of roles in specific nodes and `rsyslog_client` on the hosts that we want to install
- Set `rsyslog_client_tcp_host` to the hostname or IP address of your syslog server
- Set `rsyslog_client_tcp_port` to the port your syslog server listens on for TCP logs
