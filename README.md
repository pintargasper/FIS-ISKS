<div align="center">

  <h1>ISKS Seminar Project</h1>

  <p>
    Faculty of Information Studies<br/>
    <a href="https://www.fis.unm.si/">fis.unm.si</a>
  </p>

</div>

---

## Table of Contents

1. [Task 1: Photoresistor](#task-1-photoresistor)
2. [Task 2: Touch Sensors](#task-2-touch-sensors)
3. [Task 3: Potentiometer](#task-3-potentiometer)

---

## Task 1: Photoresistor

**Pins used**
- Photoresistor sensor: GPIO 32
- Main LED: GPIO 33
- Backup LED: GPIO 25
- ESP LED: GPIO 2

<div align="center">
  <img src="assets/task1.png" width="600px" alt="Photoresistor Example">
</div>

---

## Task 2: Touch Sensors

**Pins used**
- Touch Sensor 1: 
- Touch Sensor 2: 
- Touch Sensor 3: 
- Each touch sensor controls a corresponding LED (see code for mapping)

---

## Task 3: Potentiometer

**Pins used**
- Potentiometer: GPIO 32
- Blue LED: GPIO 27
- Green LED: GPIO 26
- Red LED: GPIO 25

<div align="center">
  <img src="assets/task3.png" width="600px" alt="Potentiometer Example">
</div>

---

## System Architecture

The system consists of
- **ESP32**: Reads sensors and controls actuators, communicates with the dashboard via WebSocket (SSL)
- **Web Control Panel (Next.js)**: Visualizes sensor data and allows control of actuators in real time

---

## Communication

Messages are exchanged in JSON format over WebSocket

**Photoresistor (toggle LED):**
```json
{
  "name": "mainButton",
  "value": true
}
```
**Photoresistor (set threshold):**
```json
{
  "name": "threshold",
  "value": 1500
}
```
**Potentiometer (status):**
```json
{
  "name": "status",
  "value": "ok"
}
```

---

## Examples

### Photoresistor
- Shows a chart of light intensity
- Allows toggling the main LED
- Set threshold for low light detection

### Touch Sensors
- Add/remove charts for each touch pin.
- Show LED status for each touch input.

### Potentiometer
- Displays analog value and status (Too low, OK, Too high).
- Status LEDs indicate the range.

---
