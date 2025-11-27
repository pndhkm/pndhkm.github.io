#!/usr/bin/env bash

set -euo pipefail

#########################################
# GLOBALS
#########################################
PROJECT_NAME=""
FORCE=false

#########################################
# HELP
#########################################
show_help() {
    cat <<EOF
Usage: ./ansible_playbooks_template [OPTIONS] <project_folder>

Creates a fully structured Ansible project scaffold.

Examples:
  ./ansible_playbooks_template my-ansible-project
  ./ansible_playbooks_template --force infra-setup

Options:
  -f, --force     Overwrite existing folder if it exists
  -h, --help      Show this help message

EOF
}

#########################################
# PARSE ARGS
#########################################
parse_args() {
    if [[ $# -eq 0 ]]; then
        show_help
        exit 1
    fi

    while [[ $# -gt 0 ]]; do
        case "$1" in
            -f|--force)
                FORCE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                if [[ -z "$PROJECT_NAME" ]]; then
                    PROJECT_NAME="$1"
                else
                    echo "Unexpected argument: $1"
                    show_help
                    exit 1
                fi
                shift
                ;;
        esac
    done
}

#########################################
# VALIDATION
#########################################
validate() {
    if [[ -z "$PROJECT_NAME" ]]; then
        echo "Project name not provided."
        exit 1
    fi

    if [[ -d "$PROJECT_NAME" && "$FORCE" = false ]]; then
        echo "Error: Directory '$PROJECT_NAME' already exists. Use --force to overwrite."
        exit 1
    fi

    if [[ -d "$PROJECT_NAME" && "$FORCE" = true ]]; then
        echo "Warning: Removing existing project '$PROJECT_NAME'"
        rm -rf "$PROJECT_NAME"
    fi
}

#########################################
# PROJECT CREATION
#########################################
create_structure() {
    echo "Creating Ansible project: $PROJECT_NAME"
    mkdir -p "$PROJECT_NAME"

    # Inventory
    mkdir -p "$PROJECT_NAME/inventory"
    cat > "$PROJECT_NAME/inventory/hosts.ini" <<'EOF'
[appservers]
app01 ansible_host=10.10.10.11 env=prod
app02 ansible_host=10.10.10.12 env=dev
EOF

    # ansible.cfg
    cat > "$PROJECT_NAME/ansible.cfg" <<'EOF'
[defaults]
host_key_checking = False
roles_path = roles
library = library
retry_files_save_path=retries
EOF

    # Retries
    mkdir -p "$PROJECT_NAME/retries"

    # group_vars
    mkdir -p "$PROJECT_NAME/group_vars"
    cat > "$PROJECT_NAME/group_vars/appservers.yml" <<'EOF'
app_name: "backend_service"
listen_port: 8080
log_level: "info"

env_config:
  prod:
    db_host: "10.1.1.10"
    db_port: 5432
  dev:
    db_host: "10.1.1.20"
    db_port: 5432
EOF

    # Playbooks
    mkdir -p "$PROJECT_NAME/plays"
    cat > "$PROJECT_NAME/plays/setup-example.yml" <<'EOF'
- hosts: appservers
  become: yes
  gather_facts: yes
  roles:
    - example
EOF

    # Roles
    mkdir -p "$PROJECT_NAME/roles/example/tasks"
    mkdir -p "$PROJECT_NAME/roles/example/handlers"
    mkdir -p "$PROJECT_NAME/roles/example/templates"

    # Tasks/main.yml
    cat > "$PROJECT_NAME/roles/example/tasks/main.yml" <<'EOF'
- name: Render application configuration
  template:
    src: example.conf.j2
    dest: /etc/example/example.conf
    mode: "0644"
  notify:
    - Restart apache

- name: Ensure service directory exists
  file:
    path: /etc/example
    state: directory
    mode: "0755"
EOF

    # Handlers
    cat > "$PROJECT_NAME/roles/example/handlers/main.yml" <<'EOF'
- name: Restart apache
  ansible.builtin.service:
    name: httpd
    state: restarted
EOF

    # Templates
    cat > "$PROJECT_NAME/roles/example/templates/example.conf.j2" <<'EOF'
[service]
name = {{ app_name }}
port = {{ listen_port }}
log_level = {{ log_level }}

[database]
host = {{ env_config[hostvars[inventory_hostname].env].db_host }}
port = {{ env_config[hostvars[inventory_hostname].env].db_port }}
EOF

    echo "Project created successfully: $PROJECT_NAME"
}

#########################################
# MAIN
#########################################
parse_args "$@"
validate
create_structure
