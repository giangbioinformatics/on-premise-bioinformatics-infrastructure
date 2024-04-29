#!/bin/bash
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