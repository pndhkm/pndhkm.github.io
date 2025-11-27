# Ansible Playbooks

Ansible Playbooks provide a repeatable, reusable, simple configuration management and multimachine deployment system that is well suited to deploying complex applications. If you need to execute a task with Ansible more than once, you can write a playbook and put the playbook under source control. You can then use the playbook to push new configurations or confirm the configuration of remote systems.

Source: [docs.ansible.com](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_intro.html)

---

## My Favorite Structure

```
ansible-project/
├── ansible.cfg
├── inventory
│   └── hosts.ini
├── group_vars
│   └── appservers.yml
├── plays
│   └── setup-example.yml
├── retries
└── roles
    └── example
        ├── handlers
        │   └── main.yml
        ├── tasks
        │   └── main.yml
        └── templates
            └── example.conf.j2
```

---

## Inventory and Group Variables

#### inventory/hosts.ini — Defines hosts and groups

Input:

```
[appservers]
app01 ansible_host=10.10.10.11 env=prod
app02 ansible_host=10.10.10.12 env=dev
```

#### group_vars/appservers.yml — Variables applied to whole group

Input:

```
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
```

---

## Roles

Roles let you automatically load related vars, files, tasks, handlers, and other Ansible artifacts based on a known file structure. After you group your content into roles, you can easily reuse them and share them with other users.

### Handlers 

Sometimes you want a task to run only when a change is made on a machine. For example, you may want to restart a service if a task updates the configuration of that service, but not if the configuration is unchanged. 

#### roles/example/handlers/main.yml

Input:

```
- name: Restart apache
  ansible.builtin.service:
    name: httpd
    state: restarted
```

--- 

### Tasks
#### roles/example/tasks/main.yml

Input:

```
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
```

---

### Template Rendering

Templates let you build dynamic config files.

#### roles/example/templates/example.conf.j2

Input:

```
[service]
name = {{ app_name }}
port = {{ listen_port }}
log_level = {{ log_level }}

[database]
host = {{ env_config[hostvars[inventory_hostname].env].db_host }}
port = {{ env_config[hostvars[inventory_hostname].env].db_port }}
```

---

## Playbook Calling the Role

#### plays/setup-example.yml

Input:

```
- hosts: appservers
  become: yes
  gather_facts: yes
  roles:
    - example
```
---

## Ansible Configuration

Ansible reads `ansible.cfg` to define global behavior for inventory, roles, SSH, retries, and module paths.

### Understanding ansible.cfg entries

Input:

```
[defaults]
host_key_checking = False
roles_path = roles
library = library
retry_files_save_path=retries
```

#### Explanation

| Key                               | Meaning                              | Technical Explanation                                                                         |
| --------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `host_key_checking = False`       | Disables SSH host key verification   | Prevents Ansible from asking confirmation on unknown host fingerprints during SSH connection. |
| `roles_path = roles`              | Sets the default directory for roles | Ansible will search for roles inside the `roles/` folder relative to the project.             |
| `library = library`               | Custom module directory              | Ansible loads any custom modules stored in the `library/` path.                               |
| `retry_files_save_path = retries` | Where to store retry files           | If a play fails, retry files are stored under `retries/` for rerunning failed hosts.          |

---

### Running the Playbook

#### introduction about the command before input

Apply configuration to all *appservers*.

Input:

```
ansible-playbook -i inventory/hosts.ini playbook.yml
```

Output:

```
TASK [example : Render application configuration] ********************************
changed: [app01]
changed: [app02]

TASK [example : Ensure service directory exists] *********************************
ok: [app01]
ok: [app02]
```

This shows that the template was rendered and copied, and directory state validated.

---

## Resulting Configuration

| Host  | env  | DB Host   | Port |
| ----- | ---- | --------- | ---- |
| app01 | prod | 10.1.1.10 | 5432 |
| app02 | dev  | 10.1.1.20 | 5432 |

The config file is built from shared variables but changes per host environment.

---

## Get The Template

Input: 
```
bash <(curl -s https://pndhkm.github.io/scripts/ansible_playbooks_template.sh)
```

Output:
```
Usage: ./ansible_playbooks_template [OPTIONS] <project_folder>

Creates a fully structured Ansible project scaffold.

Examples:
  ./ansible_playbooks_template my-ansible-project
  ./ansible_playbooks_template --force infra-setup

Options:
  -f, --force     Overwrite existing folder if it exists
  -h, --help      Show this help message

```

---