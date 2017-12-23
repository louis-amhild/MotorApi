let pigpio = require('pigpio');
let onoff = require('onoff');

// Motor class
class Motor {
    constructor() {
        // Motor speed in Hz
        this.speed = 800;
        this.motorRunning = false;

        // Set "static" pin definition
        this.dirPin = 26;
        this.pwmInPin = 22;
        this.stepPin = 27;
        this.nSleepPin = 13;
        this.nResetPin = 6;
        this.nEnablePin = 5;

        this.msi1Pin = 10;
        this.msi2Pin = 9;
        this.msi3Pin = 11;

        // Declare and nit piopig pin objects
        this.dir = new pigpio.Gpio(this.dirPin, {mode: pigpio.Gpio.OUTPUT});
        this.step = new pigpio.Gpio(this.stepPin, {mode: pigpio.Gpio.OUTPUT});
        this.nSleep = new pigpio.Gpio(this.nSleepPin, {mode: pigpio.Gpio.OUTPUT});
        this.nEnable = new pigpio.Gpio(this.nEnablePin, {mode: pigpio.Gpio.OUTPUT});
        this.nReset = new pigpio.Gpio(this.nResetPin, {mode: pigpio.Gpio.OUTPUT});

        this.msi1 = new pigpio.Gpio(this.msi1Pin, {mode: pigpio.Gpio.OUTPUT});
        this.msi2 = new pigpio.Gpio(this.msi2Pin, {mode: pigpio.Gpio.OUTPUT});
        this.msi3 = new pigpio.Gpio(this.msi3Pin, {mode: pigpio.Gpio.OUTPUT});

        this.maxSteps = -1;

        // Init counter gpio
        this.stepCount = 0;
        this.pwmIn = new onoff.Gpio(this.pwmInPin, 'in', 'rising');
        this.pwmIn.watch( (err, value) => {
            if (err) {
                throw err;
            }
            this.stepCount += 1;

            if(this.maxSteps > 0 && this.stepCount >= this.maxSteps-3) {
                this.setSpeed(10, "tmp");
            }

            if(this.maxSteps > 0 && this.stepCount >= this.maxSteps) {
                this.stopMotor();
            }
        });
    }

    write(pin, value) {
        // The rpi-gpio uses the physical pin number aka pin 35 = gpio 19
        gpio.write(pin, value, function(err) {

            if (err) throw err;
            //console.log('Set pin' + pin + " to " + value);
        });
    }

    startMotor() {
        this.stepCount = 0;

        console.log("Start motor at " + this.speed + " Hz");
        this.nEnable.digitalWrite(0);
        // 50% duty cycle
        this.step.pwmWrite(128);
        // Speed in Hz
        this.step.pwmFrequency(this.speed);
        this.motorRunning = true;
        return {"status" : "running", "speed": this.speed};
    }

    stopMotor() {
        this.step.pwmWrite(0);
        this.step.pwmFrequency(0);
        this.nEnable.digitalWrite(1);
        this.motorRunning = false;
        console.log("Missing steps: " + (this.maxSteps - this.stepCount));
        // Reset max steps
        this.maxSteps = -1;
        return  {   "status": "stopped",
                    "stepsMoved": this.stepCount,
                    "revolutionMoved": (Math.round(this.stepCount / 20)/10),
        }
    }

    stepMotor(steps) {
        // Move x amount of steps
        this.maxSteps = steps;
        return this.startMotor();
    }

    setSpeed(speed, tmp) {
        if(speed < 0 || speed > 2000) {
            return "Please specify a motor speed between 0 and 2000 Hz (max from cold start 1200)";
        }
        if(!tmp)
            this.speed = speed;

        if(this.motorRunning) {
            // 50% duty cycle
            this.step.pwmWrite(128);
            // Speed in Hz
            this.step.pwmFrequency(speed);
        }
        return "";
    }

    getSpeed() {
        return this.speed;
    }

    init() {
        setTimeout( () => {
            // Init motor pins
            this.dir.digitalWrite(1);
            this.step.digitalWrite(0);
            this.nSleep.digitalWrite(1);  // Disable sleep
            this.nEnable.digitalWrite(0); // Disable not enable
            this.nReset.digitalWrite(1); // Disable reset

            // Low  Low  Low - Full step
            // High Low	 Low - Half step
            // Low  High Low - Quarter step
            this.msi1.digitalWrite(0);
            this.msi2.digitalWrite(0);
            this.msi3.digitalWrite(0);
        }, 500);
    }

    destroy() {
        pigpio.terminate();
        this.pwmIn.unexport();
    }
}

module.exports = Motor;
