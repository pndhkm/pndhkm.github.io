# Download Binary File

You can download the prebuilt binary for your operating system from the [GitHub Releases page](https://github.com/pndhkm/cpanel_mail_exporter/releases/tag/v1.0.1).


| OS      | Architecture  | Download Link                                                                                                                                                                                                                                |
| ------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS   | Intel         | [cpanel_mail_exporter_1.0.1_darwin_amd64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_darwin_amd64.zip)   |
| macOS   | Apple Silicon | [cpanel_mail_exporter_1.0.1_darwin_arm64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_darwin_arm64.zip)   |
| Linux   | AMD64         | [cpanel_mail_exporter_1.0.1_linux_amd64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_linux_amd64.zip)     |
| Linux   | ARM64         | [cpanel_mail_exporter_1.0.1_linux_arm64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_linux_arm64.zip)     |
| Windows | AMD64         | [cpanel_mail_exporter_1.0.1_windows_amd64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_windows_amd64.zip) |
| Windows | ARM64         | [cpanel_mail_exporter_1.0.1_windows_arm64.zip](https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_windows_arm64.zip) |

### Retrieve the archive

Input:

```
curl -LO https://github.com/pndhkm/cpanel_mail_exporter/releases/download/v1.0.1/cpanel_mail_exporter_1.0.1_linux_amd64.zip
```

### Unzip the file

Input:

```
unzip cpanel_mail_exporter_1.0.1_linux_amd64.zip
```

### Deploy system-wide

Input:

```
sudo mv cpanel_mail_exporter /usr/bin/
```

### Set execution permission

Input:

```
sudo chmod +x /usr/bin/cpanel_mail_exporter
```

### Verify executable path

Input:

```
which cpanel_mail_exporter
```

Output:

```
/usr/bin/cpanel_mail_exporter
```

Indicates the binary is installed correctly in the global PATH.

### Check runtime

Input:

```
cpanel_mail_exporter 
```

Output:

```
Usage of cpanel_mail_exporter:
  -apikey string
    	API key
  -endpoint string
    	cPanel endpoint
  -listen string
    	Address and port to listen on (format: ip:port) (default ":9197")
  -web.config.file string
    	Path to web configuration YAML file
```

Displays available flags and confirms operational status.

---