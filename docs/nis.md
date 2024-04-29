# Slurm NIS

Slurm cluster configuration for NIS (Network Information System)

- [Introduction](#introduction)
- [Add new users](#add-new-users)
- [Update user to the slurm cluster](#update-user-to-the-slurm-cluster)
- [Check for new user](#check-for-new-user)

## Introduction

The user and group in the slurm cluster need to be synchronous. Simply, if we add a user in the login/controller, it should be automatically
added to all workers. However, it should be worked only on the local network area (LAN) system to be securable.

## Add new users
Follow here,[tutorial-add-user](https://www.techrepublic.com/article/how-to-create-users-and-groups-in-linux-from-the-command-line/)


## Update user to the slurm cluster
This function is initialized when login
```bash
function sync_slurm_user(){
    getent passwd | \
        (while IFS=: read name _ uid gid _ home _; do
        if [ $(expr match "$home" /home) -eq 5 ]; then
            if (sacctmgr --immediate --parsable --noheader list user Account=root | grep "^$name|"); then
            continue
            fi
            sacctmgr --immediate --quiet add user "$name" DefaultAccount=root
        fi
        done)
}
```

After adding new user/groups, just use the below command, require to be the group of sudo
```bash
sync_slurm_user
```

## Check for new user
Get the available user
```bash
sudo ypcat passwd
```

Example:
```
vagrant:x:1000:1000:vagrant:/home/vagrant:/bin/bash
giangnguyen:x:1001:1001:,,,:/home/giangnguyen:/bin/bash
test:x:1002:1002::/home/test:/bin/bash
```

Retry by login by the new user and submit a job using the command below
```bash
srun --pty bash
```
Check the new submit job:
```bash
squeue
```