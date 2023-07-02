# Raspberry Home API

REST API designed to be used within your local network to control "smart" devices like a ceiling fan. It is designed to run on a Raspberry PI.

## How to

### Swagger

You can access the OpenApi specification by visitting `/api` (e.g. `localhost:3000/api` on your local machine).

### Local DEV

Run `npm start` to start the server locally.

#### How to add new devices

0. Sniff and store commands on your Raspberry Pi (cf. [Sniff Signals](#sniff-signals))
1. Export them via `rfsniffer -v dump > output.txt`
2. Copy the entries (buttons) of the desired devices you want to integrate (just copy the timing/level entries) into a new file `codes.txt`
3. Use the [persist.js](./utils/persist.js) file to generate a (json) file out of it
4. Copy the generated hash out of the console and create a new file within [assets](./assets/) having the hash as the name
5. Create an entry of format `{ "key": "XX", "value": [...]}` where `XX` represents the device name
6. Paste the generated `codes` file's content into the `value` section of the newly created file

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

### Node & Python

Install node and python.

### WiringPi

Install (WiringPi)[https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/] for the communication with the Raspberry Pi
-> Inofficial successor: https://github.com/WiringPi/WiringPi

### Transmitter/Receiver Setup

Checkout the well described [blog post](https://hackernoon.com/diy-home-automation-fan-control-with-raspberry-pi-3-rf-transmitter-and-homebridge-59ad24845770) how to setup and connect a RF transmitter and receiver on your Raspberry Pi.

### NGINX

Make sure to be up to date:

```
sudo apt update
sudo apt upgrade
```

Install NGINX next:

```
sudo apt install nginx
```

Start NGINX:

```
sudo systemctl start nginx
```

Open the default configuration:

```
sudo nano /etc/nginx/sites-enabled/default
```

Copy, paste and replace its content with the following:

```
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```

Restart NGINX:

```
sudo systemctl restart nginx
```

### PM2

In order daeomonize the application and to automatically start and restart it PM2 can be used:

```
sudo npm install -g pm2
```

In the next step start your application using PM2:

```
pm2 start dist/main.js
```

Now, enable the automated start of the application by entering

```
pm2 startup systemd
```

This generates a `sudo env...` command you need to copy and paste in order to tell PM2 to run the application during the startup.

Save the new configuration by

```
pm2 save
```

### Sniff Signals

Use [rpi-rfsniffer](https://github.com/jderehag/rpi-rfsniffer) to sniff and record the RF signals
