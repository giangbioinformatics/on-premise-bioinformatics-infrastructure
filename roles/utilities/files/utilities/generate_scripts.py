#!/usr/bin/env python3
import os
import subprocess
import json
import sys


def get_tool_name_path(git: str, tools_dir: str):
    tool_name = os.path.basename(git).rstrip(".git")
    tool_path = os.path.join(tools_dir, tool_name)
    return tool_name, tool_path


def valid_tool(git: str, tools_dir: str):
    tool_name, tool_path = get_tool_name_path(git, tools_dir)
    template_file = os.path.join(tool_path, ".template")
    return os.path.exists(tool_path) and os.path.exists(template_file)


def run_tools(params: dict, git: str, tools_dir: str, output_file: str):
    tool_name, tool_path = get_tool_name_path(git, tools_dir)

    if not valid_tool(git, tools_dir):
        try:
            subprocess.check_call(f"git clone {git} {tool_path}", shell=True)
        except subprocess.CalledProcessError:
            raise Exception("Failed to clone the repository")

    # Read the template file
    template_file = os.path.join(tool_path, ".template")
    with open(template_file, "r") as file:
        template_content = file.read()

    # Replace placeholders
    for key, value in params.items():
        placeholder = f"<<{key}>>"
        template_content = template_content.replace(placeholder, value)

    # Write the result to a new script file
    with open(output_file, "w") as file:
        file.write(template_content)

    # Make the generated script executable
    os.chmod(output_file, 0o755)

    print(f"Generated script with parameters has been saved to {output_file}")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "Usage: python3 generate_script.py <params.json> <tools_dir> <output_file>"
        )
        sys.exit(1)

    params_file = sys.argv[1]
    tools_dir = sys.argv[2]
    output_file = sys.argv[3]

    with open(params_file, "r") as file:
        data = json.load(file)

    params = data["params"]
    git = data["git"]

    run_tools(params, git, tools_dir, output_file)
