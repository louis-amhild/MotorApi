# MotorApi
Raspberry Pi 3 NodeJS REST Stepper Motor Controller API (Server Side)

# Step 1.Enable SPI for RFID-RC522
a. Enable SPI Interface
sudo raspi-config

b. Reboot
sudo reboot

c. Check if spi_bcm2835 is loaded
lsmod | grep spi
