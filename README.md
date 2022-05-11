# gofer
> A gofer for devops developer


## Installation
Donwload latest [Release](https://github.com/droyuki/gofer/releases)

### MacOS
```
mv gofer-macos /usr/local/bin/gofer
```
### Linux
```
mv gofer-linux /usr/local/bin/gofer
```
### Wondows
Run gofer-win.exe in CMD

## Usage example

```
# Display help message
gofer -h

Usage: gofer [options] [command]

Options:
  -c, --config <path>  config file
  -v, --version        output the version number
  -h, --help           display help for command

Commands:
  init [path]          create gfconfig
  azure                execcute azure tool
  gitlab               execcute gitlab tool
  docker               execcute docker tool
  k8s                  execcute k8s tool
  help [command]       display help for command
```

## Config.json

Create config.json at the first time

gofer will save gfconfig under home directory if path not specified

```
gofer init [path]

# ~/gfconfig
{
    "git-api": "https://gitlab.com/api/v4",
    "git-pat": "YOUR_GITLAB_TOKEN",
    "projects": [],

    // Optional
    'gitlab-group-id': 1, 
}
```



## Development setup

All you need is nodejs, then run npm install

```sh
npm install
```

## Meta

Distributed under the MIT license.

## Contributing

1. Fork it (<https://github.com/droyuki/gofer/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
