# Presentation 1
```
Each of these sections represents an individual slide, or group of slides, in our presentation.
Put comments about a slide in block quotes so we can separate it from the spoken prose.
End each slide with a horizontal rule.
```
---

## Introduction
Albert Morgan
### 1 min

```
This introduction should be generic enough that we can reuse it for future presentations.
```

In June 2017, the OSU chapter of the AIAA will launch a rocket in the Mojave Desert.
The software team will develop the tracking software that receives telemetry from the rocket during its flight, logs, and 
displays the data in real-time for the entire OSU rocketry team.
This software must be flexible, robust, and accurate in order to ensure that the variety of 
engineers on the project all receive the data they need on launch day.
Collecting the telemetry in real-time will reduce the chances of a failure-to-recover 
by allowing the ground team to track the rocket during its flight.
The graphical display will make the telemetry instantly understandable to the OSU rocketry team without time-consuming analysis.
Logging the data will ensure that it is accessible for analysis at a later date.
This presentation will provide an status update of the project.

---

## Clients
Albert Morgan
### 1 min

```
This section describes the clients. It should also be reusable.
```

The product owner is Dr. Nancy Squires, a senior instructor of Mechnical Engineering here at OSU.
However, she is not our client.
Our clients are the members of the High-Altitude Rocketry Team, who are other engineers doing other parts of the rocket as their own capstone project.
Although Dr. Squires leads the group, she is very hands-off and lets the engineering students make decisions for themselves.

Our clients, the engineering students, have their own problems to solve with the rocket, and the are also very hands-off with the software.
It is up to us, the software team, to figure out what our clients needs are and deliver a product that means everyone's timeline.
This flexibility is both a blessing and a curse.
On one hand, we are able to make many of the critical design decisions ourselves, and we don't have anyone asking us to do the impossible.
On the other hand, we are left with all of the responsibility of the design.
If we had a client telling us exactly what the backend was going to be, or what kind of user interface they want, it would be much less work for the software team.

---

## Telemetry
Albert Morgan
### 1 min

```
Reference for COCOM Limit:
http://support.spectracom.com/articles/FAQ/Why-are-there-altitude-and-velocity-limits-for-GPS-equipment
```

While the rocket is in flight, it will transmit data back to the groundstation using packet radio over the amateur radio spectrum.
This transmission will send back data from the rocket's sensors.
This data includes reading from latitude, longtiude, altitude, and tilt sensors.
However, not all of the data will be available at all times.
Limits imposed by the Coordinating Committee for Multilateral Export Controls, or COCOM, will cause the GPS on-board th rocket to shut down under certain conditions.
The COCOM limits engage when the GPS reaches an altitude of 60,000 feet and a velocity of 1000 knots, or 1200 miles per hour.
The High-Altitude Rocketry Avionics Team estimates that the rocket will meet these criteria and the GPS receiver will shut down about halfway through the ascent, and remain offline until the rocket reaches apogee, the highest point in it's trajectory.

In order to combat this lack of data, one non-capstone member of our team is working with members of the physics department to build a system that will predict the rocket's position while GPS data is unavailable.

