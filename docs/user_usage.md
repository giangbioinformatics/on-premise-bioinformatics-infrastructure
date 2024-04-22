# Slurm HPC for Bioinformatics documentation
## Table of Contents

1. [Using `screen` to Hold the Session](#using-screen-to-hold-the-session)
2. [Using isolated environments (conda, docker, singularity) to run/develop/deploy tools](#using-isolated-environments-condadockersingularity-to-rundevelopdeploy-tools)
3. [SLURM JOBS](#slurm-jobs)
    1. [Using srun on Slurm](#using-srun-on-slurm)
    2. [Using sbatch on Slurm](#using-sbatch-on-slurm)

This documentation provides guidance on using Slurm on an HPC system, including instructions on using `screen`, submitting jobs interactively with `srun` and `sbatch`, install, deploy the environment using docker, singularity, micromamba and running Nextflow with the Slurm executor.

## Using `screen` to Hold the Session
For more details, folllow [screen tutorial](https://linuxize.com/post/how-to-use-linux-screen/)
`screen` is a terminal multiplexer that allows you to run multiple terminal sessions within a single window. This is useful for running long-running processes that you don't want to be interrupted if your SSH session disconnects.

To start a `screen` session, simply type:
```
screen -S <session_name>
```
To detached the screen session:

```
#Use the key sequence Ctrl-a + Ctrl-d to detach from the screen session.
```

To resume the old session, you should list all sessions to get id, sometimes, it has many sessions using the same names
```
screen ls
#Ex:There are screens on:
#    10835.pts-0.linuxize-desktop   (Detached)
#    10366.pts-0.linuxize-desktop   (Detached)
#2 Sockets in /run/screens/S-linuxize.
```
To resume first session
```
screen -r 10835
```

## Using isolated environments (conda,docker,singularity) to run/develop/deploy tools
For more details, follows [programming-for-bioinformatics-containers](https://github.com/giangbioinformatics/programming-for-bioinformatics/blob/main/04.software_and_pipeline_bioinformatics/01.introduction_to_environment_container.md)


## SLURM JOBS
### Using srun on Slurm
`srun` is a command used in Slurm to submit jobs for immediate execution in an interactive mode. It allows you to allocate resources and execute commands within that allocation.

## Syntax

The basic syntax for using `srun` is as follows:
## Options

Here are some commonly used options with `srun`:

- `-n, --ntasks=<number>`: Specifies the number of tasks to be run. 
- `-N, --nodes=<number>`: Specifies the number of nodes to allocate for the job.
- `-p, --partition=<partition>`: Specifies the partition to submit the job to.
- `-t, --time=<time>`: Specifies the maximum runtime for the job.
- `-c, --cpus-per-task=<number>`: Specifies the number of CPUs per task.
- `-o, --output=<file>`: Redirects standard output to the specified file.
- `-e, --error=<file>`: Redirects standard error to the specified file.

## Examples

### Example 1: Running a Basic Command

To run a basic command interactively, you can use `srun` without any additional options. For example:
Move from login to the worker node, the entry point will be shell bash
```
srun --pty /bin/bash
```
Request 2 cpus, 10 GB memory, 1 gpu (not support yet) and for 30 minutes, the entry point will be shell bash
```
srun --nodes=1 --ntasks=1 --cpus-per-task 2  --gres=gpu:1 --mem=10G --time=00:30:00 --pty /bin/bash
```
### Using sbatch on Slurm
`sbatch` is a command used in Slurm to submit batch jobs to be executed later. It allows you to specify various job parameters such as job name, number of tasks, and CPUs per task. Similar to srun we can reused previous srun tutorial. Besides, it should be configured using the script as below.
If you use the nextflow with the config `executor='slurm'` it will use the sbatch to submit the job parrallely. It will wait for the job
to finish. Check at any work hash task. For example, work directory is `work/1a/hihihaha`. In side this folder,
you can check the sbatch command by `cat work/1a/hihihaha/.command.run`. If the docker is enable, then you can see the sbatch use docker to run 
the task, mount the work directory for input and output path.

## Example Script

```bash
#!/bin/bash
#SBATCH --job-name=singlecputasks
#SBATCH --ntasks=2
#SBATCH --cpus-per-task=1
docker run -v /path/to/fastq/files:/data biocontainers/fastqc:v0.11.8_cv2 fastqc /data/*.fastq
```
