#!/usr/bin/env python3
import os
import subprocess
import json
import argparse
from pathlib import Path

DEFAULT_HEADER = """#!/bin/bash
#SBATCH --job-name=<<uuid_job_id>>
#SBATCH --time=<<times>>
#SBATCH --output=.jobs/<<uuid_job_id>>/job.log
#SBATCH --mem=<<memory>>
#SBATCH --cpus-per-task=<<cpus>>
set -e
"""
ACCESS_HEADER = """
PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
echo $(hostname) > ".jobs/<<uuid_job_id>>/job.host"
echo $PORT > ".jobs/<<uuid_job_id>>/job.port"
PASSWORD=$(openssl rand -base64 20)
echo $PASSWORD > ".jobs/<<uuid_job_id>>/job.password"
"""

CLOUD_STORAGE_HEADER = """
# prepare the configuration file
mkdir -p ~/.aws
cat <<EOF > ~/.aws/config
[default]
region = <<project_region>>
EOF

GOOFYS=~/.tools/goofys
if [-f "$GOOFYS" ]; then
    echo "goofys is already installed"
else
    echo "Installing goofys"
    mkdir -p ~/.tools
    cd ~/.tools
    wget https://github.com/kahing/goofys/releases/download/v0.24.0/goofys
    chmod +x goofys
fi
# mount s3
$GOOFYS --profile <<project_name>> --file-mode=0666 --dir-mode=0777 --endpoint=<<project_endpoint>> <<project_bucket>>:.jobs/<<uuid_job_id>>/mount  
"""


def get_tool_name_path(
    tools_dir: str,
    git: str,
    job_script: str,
):
    """Get the tool name and job script path
    Args:
        tool_dir (str): Directory to store the tools
        git (str): Git repository URL
        job_script (str): Job script to execute
    """
    tool_name = os.path.basename(git).rstrip(".git")
    local_repo = os.path.join(tools_dir, tool_name)
    job_script_path = Path(os.path.join(tools_dir, tool_name, job_script))
    return tool_name, local_repo, job_script_path


def clone_or_update_repo(
    git,
    local_repo,
    version,
):
    if not os.path.exists(local_repo):
        try:
            subprocess.check_call(f"git clone {git} {local_repo}", shell=True)
        except subprocess.CalledProcessError:
            raise Exception("Failed to clone the repository")
    else:
        try:
            subprocess.check_call(
                f"cd {local_repo} && git fetch && git checkout {version} && git pull origin {version}",
                shell=True,
            )
        except subprocess.CalledProcessError:
            raise Exception("Failed to update the repository")


def load_json_file(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


def replace_placeholders(template, replacements):
    for key, value in replacements.items():
        placeholder = f"<<{key}>>"
        template = template.replace(placeholder, str(value))
    return template


def generate_script(
    git,
    version,
    allow_access,
    config_file,
    params_file,
    tools_dir,
    job_script,
    output_file,
):
    tool_name, local_repo, job_script_path = get_tool_name_path(
        tools_dir,
        git,
        job_script,
    )
    clone_or_update_repo(git, local_repo, version)

    params = load_json_file(params_file) if params_file else {}

    config_data = load_json_file(config_file)

    header = replace_placeholders(DEFAULT_HEADER, config_data)
    access_header = replace_placeholders(ACCESS_HEADER, config_data)

    with open(job_script_path, "r") as file:
        content = file.read()
        content = replace_placeholders(content, {"tool_name": tool_name})
        if params:
            content = replace_placeholders(content, params)

    with open(output_file, "w") as file:
        file.write(header)
        if allow_access:
            file.write("\n" + access_header)
        file.write("\n" + content)

    os.chmod(output_file, 0o700)
    print(f"Generated script with parameters has been saved to {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate script with parameters")
    parser.add_argument("-git", required=True, help="Git repository URL")
    parser.add_argument(
        "-version", required=True, help="Version to checkout from the repository"
    )
    parser.add_argument(
        "-config_file",
        required=True,
        help="Path to the JSON file containing configuration",
    )
    parser.add_argument(
        "-params_file",
        required=False,
        help="Path to the JSON file containing parameters",
    )
    parser.add_argument(
        "-tools_dir", required=True, help="Directory to store the tools"
    )
    parser.add_argument("-job_script", required=True, help="Job script to execute")
    parser.add_argument("-output_file", required=True, help="Output script file")
    parser.add_argument(
        "--allow_access", action="store_true", help="Allow access to outside scripts"
    )
    args = parser.parse_args()

    generate_script(
        args.git,
        args.version,
        args.allow_access,
        args.config_file,
        args.params_file,
        args.tools_dir,
        args.job_script,
        args.output_file,
    )
