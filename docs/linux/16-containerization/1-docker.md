# Docker

Docker is a popular containerization platform that automates application deployment using containers.

### Key Concepts
- **Image**: Read-only template for creating containers.
- **Container**: Running instance of an image.
- **Dockerfile**: Script to build custom images.
- **Volume**: Persistent storage for containers.
- **Network**: Isolated communication between containers or with the host.

Input:

```
docker ps -a
```

Output:
```
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS                     PORTS     NAMES
e1f3b2d1c2a4   nginx:latest   "nginx -g 'daemon of…"   2 hours ago    Up 2 hours                 80/tcp    webserver
```

Shows all Docker containers, including stopped ones, with their image, command, and status.

Input:

```
docker run -d --name webserver -p 8080:80 nginx:latest
```

Starts a new container in detached mode with port mapping 8080→80.

References:
- https://docs.docker.com/manuals/

---


