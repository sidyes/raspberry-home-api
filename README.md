# Raspberry Home API

REST API designed to be used within your local network to control "smart" devices like a ceiling fan. It is designed to run on a Raspberry PI.

## Prerequesites

1. Raspberry PI with node & python installed
2. RF transmitter attached to the Raspberry PI in order to send fan commands
3. (WiringPi)[https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/] must be installed
   -> Inofficial successor: https://github.com/WiringPi/WiringPi


## How to

### Swagger

You can access the OpenApi specification by visitting `/api` (e.g. `localhost:3000/api` on your local machine).

### Local DEV

Run `npm start` to start the server locally.

### Deployment

Run `gulp deploy` in order to deploy a new production build to your target environment. 
You can define the environment by creating a `.env` file containing the following variables:

```yaml
API_KEY=<API key> # the API which is used to secure your API 
SSH_USER=<userame> 
SSH_PW=<password>
SSH_HOST=<hostname>
REMOTE_PATH=</target/path/on/your/pi> # where to deploy on your PI?
```


## Raspberry Pi Setup

### Transmitter/Receiver Setup
tbd

### NGINX 
tbd

### PM 2

tbd
pm2 list, pm2 status or pm2 show

### Sniff Signals

https://github.com/jderehag/rpi-rfsniffer