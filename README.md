# MotorApi
Raspberry Pi 3 NodeJS REST Stepper Motor Controller API (Server Side) and RFID RC522 controller

## Step 1.Enable SPI for RFID-RC522
a. Enable SPI Interface

sudo raspi-config

->  3 Interfacing Options -> P3 SPI -> Enable Yes

b. Reboot

sudo reboot

c. Check if spi_bcm2835 is loaded

lsmod | grep spi
