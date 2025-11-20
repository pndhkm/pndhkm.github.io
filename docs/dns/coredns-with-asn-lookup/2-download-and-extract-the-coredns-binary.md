# Download and Install CoreDNS Binary

CoreDNS must be downloaded according to OS and CPU architecture. After extraction, place the binary directly into `/usr/local/bin` for system-wide execution.

## Binary Options

| OS      | Arch  | Download                              | 
| ------- | ----- | ------------------------------------- | 
| macOS   | amd64 | [coredns_darwin_amd64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_darwin_amd64.tar.gz)  |
| macOS   | arm64 | [coredns_darwin_arm64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_darwin_arm64.tar.gz)  | 
| Linux   | 386   | [coredns_linux_386.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_linux_386.tar.gz)     | 
| Linux   | amd64 | [coredns_linux_amd64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_linux_amd64.tar.gz)   |
| Linux   | arm64 | [coredns_linux_arm64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_linux_arm64.tar.gz)   | 
| Windows | 386   | [coredns_windows_386.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_windows_386.tar.gz)   |
| Windows | amd64 | [coredns_windows_amd64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_windows_amd64.tar.gz) | 
| Windows | arm64 | [coredns_windows_arm64.tar.gz](https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_windows_arm64.tar.gz) | 


## Install Example (Linux amd64)

### Download and extract directly to `/usr/local/bin`

Input:

```
curl -LO https://github.com/pndhkm/coredns/releases/download/v1.12.1/coredns_1.12.1_linux_amd64.tar.gz
```

Input:

```
sudo tar -xzf coredns_1.12.1_linux_amd64.tar.gz -C /usr/local/bin
```

### Enable execution

Input:

```
sudo chmod +x /usr/local/bin/coredns
```
