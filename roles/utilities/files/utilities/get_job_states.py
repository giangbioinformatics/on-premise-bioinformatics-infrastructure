#!/usr/bin/env python3
import subprocess
import argparse
from datetime import timedelta
import json
import os


class Job:
    def __init__(
        self,
        uuid_job_id,
        slurm_job_id=None,
        status=None,
        port=None,
        host=None,
        running_time=timedelta(seconds=0),
    ):
        self.uuid_job_id = uuid_job_id
        self.slurm_job_id = slurm_job_id
        self.status = status
        self.port = port
        self.host = host
        self.running_time = running_time

    def __repr__(self):
        return f"Job(uuid={self.uuid_job_id}, slurm_id={self.slurm_job_id}, status={self.status}, running_time={self.running_time}, port={self.port}, host={self.host})"  # noqa

    def to_dict(self):
        return {
            "uuid_job_id": self.uuid_job_id,
            "slurm_job_id": self.slurm_job_id,
            "status": self.status,
            "port": self.port,
            "host": self.host,
            "running_time": str(self.running_time),
        }


def get_slurm_jobs(jobs: list):
    for job in jobs:
        if not job.slurm_job_id:
            try:
                if os.path.exists(f".jobs/{job.uuid_job_id}/job.id"):
                    slurm_id = subprocess.check_output(
                        f"cat .jobs/{job.uuid_job_id}/job.id", shell=True
                    )
                    job.slurm_job_id = slurm_id.decode().strip()
                if os.path.exists(f".jobs/{job.uuid_job_id}/job.host"):
                    slurm_host = subprocess.check_output(
                        f"cat .jobs/{job.uuid_job_id}/job.host", shell=True
                    )
                    job.host = slurm_host.decode().strip()
                if os.path.exists(f".jobs/{job.uuid_job_id}/job.port"):
                    slurm_port = subprocess.check_output(
                        f"cat .jobs/{job.uuid_job_id}/job.port", shell=True
                    )
                    job.port = slurm_port.decode().strip()
            except subprocess.CalledProcessError:
                pass


def parse_duration(duration_str):
    if "-" in duration_str:
        days, time = duration_str.split("-")
        total_seconds = 0
        if days:
            total_seconds += int(days) * 24 * 3600
        hours, minutes, seconds = map(int, time.split(":"))
        total_seconds += hours * 3600 + minutes * 60 + seconds
    elif ":" in duration_str:
        parts = duration_str.split(":")
        if len(parts) == 2:
            minutes, seconds = map(int, parts)
            total_seconds = minutes * 60 + seconds
        elif len(parts) == 3:
            hours, minutes, seconds = map(int, parts)
            total_seconds = hours * 3600 + minutes * 60 + seconds
        else:
            raise ValueError(f"Invalid duration format: {duration_str}")
    else:
        total_seconds = int(duration_str)
    return timedelta(seconds=total_seconds)


def parsing_squeue_status(jobs: list, states: str, command="squeue"):
    if states:
        lines = states.split("\n")[1:-1]
        for line in lines:
            for job in jobs:
                if job.slurm_job_id == line.split()[0]:
                    job_id, state, time = line.split()
                    job.running_time = parse_duration(time)
                    job.status = state


def get_jobs_info(jobs: list):
    get_slurm_jobs(jobs)
    job_ids = [job.slurm_job_id for job in jobs if job.slurm_job_id]
    if len(job_ids) == 0:
        return
    job_ids = ",".join(job_ids)
    squeue_cmd = f"squeue --jobs {job_ids} --format='%.18i %.9T %.10M'"
    sacct_cmd = f"sacct --jobs {job_ids} --format='JobID,State,Elapsed'"
    try:
        squeue_status = subprocess.check_output(squeue_cmd, shell=True).decode("utf-8")
    except subprocess.CalledProcessError:
        squeue_status = None
    try:
        sacct_status = subprocess.check_output(sacct_cmd, shell=True).decode("utf-8")
    except subprocess.CalledProcessError:
        sacct_status = None
    parsing_squeue_status(jobs, sacct_status, command="sacct")
    parsing_squeue_status(jobs, squeue_status)


def main():
    parser = argparse.ArgumentParser(description="Get information about SLURM jobs.")
    parser.add_argument("job_uuids", help="Comma-separated list of job UUIDs")
    args = parser.parse_args()

    job_uuids = args.job_uuids.split(",")
    jobs = [Job(uuid) for uuid in job_uuids]
    get_jobs_info(jobs)

    jobs_info = [job.to_dict() for job in jobs]
    print(json.dumps(jobs_info, indent=6))


if __name__ == "__main__":
    main()
