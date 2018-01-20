#/usr/bin/bash

sudo rm /dev/spidev0.0 && sudo ln /dev/spidev1.0 /dev/spidev0.0

sudo npm --prefix /var/www/html/MotorApi run start

