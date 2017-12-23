let gpio = require('rpi-gpio');

// Motor class
class Motor {

  constructor() {
      this.step = 0;

      this.dirPin = 37;
      this.stepPin = 35;
      this.nSleepPin = 33;
      this.nResetPin = 31;
      this.nEnablePin = 29;

      this.msi1Pin = 19;
      this.msi2Pin = 21;
      this.msi3Pin = 23;

      this.interval = null;
  }

  write(pin, value) {
  	// The rpi-gpio uses the physical pin number aka pin 35 = gpio 19
    gpio.write(pin, value, function(err) {

  	if (err) throw err;
          //console.log('Set pin' + pin + " to " + value);
      });
  }

  startMotor() {
      this.write(this.nEnablePin, 0);
      this.interval = setInterval(() => {
          this.step = !this.step;
          this.write(this.stepPin, this.step);
      }, 2);
  }

  stopMotor() {
  	clearInterval(this.interval);
  	this.write(this.nEnablePin, 1);
  }

  init() {
      gpio.setup(this.dirPin, gpio.DIR_OUT, () => {
          this.write(this.dirPin,0);
      });
      gpio.setup(this.stepPin, gpio.DIR_OUT, () => {
          this.write(this.stepPin,0);
      });
      gpio.setup(this.nSleepPin, gpio.DIR_OUT, () => {
          this.write(this.nSleepPin,1); // Disable sleep
      });
      gpio.setup(this.nEnablePin, gpio.DIR_OUT, () => {
          this.write(this.nEnablePin,1); // Disable board
      });
      gpio.setup(this.nResetPin, gpio.DIR_OUT, () => {
          this.write(this.nResetPin,1);
      });
      gpio.setup(this.msi1Pin, gpio.DIR_OUT, () => {
          this.write(this.msi1Pin,0);
      });
      gpio.setup(this.msi2Pin, gpio.DIR_OUT, () => {
          this.write(this.msi2Pin,0);
      });
      gpio.setup(this.msi3Pin, gpio.DIR_OUT, () => {
          this.write(this.msi3Pin,0);
      });
  }

  destroy() {
  }
}
module.exports = Motor;
