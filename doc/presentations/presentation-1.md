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
### ? min

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
This piece of the project will account for many factors, such as wind speed, tilt, and last known velocity to make a prediction about the most likely position of the rocket.

---

## Backend
Albert Morgan
### ? Min

```
Talking about the design of the backend. This should also be reusable.
```

Our backend is designed to run on a Raspberry Pi.
This decision was made because the Raspberry Pi is cheap, portable, and easy to power.
Although they are not as powerful as a desktop PC, modern iterations of the Raspberry Pi have more than enough processing power for our project.

Early iterations of our backend design subdivided it into the web server, which would serve pages to the client,
and the application server, which would read telemetry from the serial port and make it available to the web server.
A design like this would likely use a combination of C and PHP or Ruby.
However, there are some drawbacks to this design.
* Writing software in two languages means having to switch gears more often
* No one-solution package manager
* Integrating the C process with the web backend is an extra step

After writing the Technology Review, we realized that Node.js, which was originally researched as an option for just the web backend, would be ideal to take over all backend tasks.
Node.js allows backend programs to be written using Chrome's V8 JavaScript engine.
The frontend will also be written in JavaScript, because it will be designed to run in a web browser.
* Writing the backend in JavaScript as well will allow more work to be done without switching gears.
* Custom libraries can be shared between the frontend and the backend.
* NPM, the Node Package Manager, can easily track packages for both the frontend and the backend.
* Node uses an event-driven architecture, unlike PHP or Ruby which uses a request-driven architecture. Because our system is inherently event based (each telemetry packet is an event), the architecture of Node is ideal for our purposes.
* Node is faster than either PHP or Ruby.




---

## Overview of first 10 weeks Terrance
## 5 min
At the beginning of the project we met with the rest of the OSU AIAA chapter. This included Mechanical engineers, Electrical engineers as well as underclassmen.  They all were very helpful in giving us an overview of how the whole situation works. Most of them have been part of the chapter since last year if not longer.  Before we started any of the documents we setup our GitHub so that we could add content to the project.  We setup our blog as well as a telegram so that we could communicate with each other outside of school. When we worked on our problem statement we got it done in a fashionable time frame.  We were able to answer all the question that was needed, the project abstract, problem definition, proposed solution, and our performance metrics. Next we had our requirements document.  This allowed us to describe what is in our document.  The biggest thing out of this document was the definitions. This allowed anyone who read this or any document from here on out to understand what the technical words we were talking about.  This is important because not everyone is versed in rocketry or software.  We also were able to put in a visual perspective, called a Gantt chart for the overall project. In the technology review we did some good research.  This we broke down to our individual sections.  My part for this I, was given Retrieval, Interaction modes, and Toolkit to generate the user interface (UI).  We each research three topics from the sections and picked one that worked out best for each section.  This allows the reader to see and learn more about each section and see of a rough draft of the design right before the design document.  The last document was the design document.  We took our selections from the technology review and went more in depth.   We set it up so that it was from certain viewpoints and talked about any concerns.  With the concerns we also wrote how to counter them.  In the design document certain aspects came together so we had relationships or certain sections were in the same viewpoint.

## Issues
Over the term it was not without issues.  The first two documents, the problem statement and the requirements document we got done in a couple days before it was due.  Not really to many issue with those two documents.  With the last two documents it was different story.  Both, the technology review and the design document, we ended up getting them both done the day they were due or late the night before.  With the technology review I made a mistake on the citing in latex, my teammates had to save me because I was out of town the day it was due. My teammates told me about the issues I had cited like normal MLA format, but there is a specific latex way to cite.  We also had an issue with changing a viewpoint on the design document as well as a formatting confusion.  The formatting confusion was an easy a miss understanding on the design document itself.  We just agreed to keep the good formatting that Albert had.  With the changing of the viewpoint we just decided at the last minute that the viewpoint we chose was better for our situation. We wanted to make sure that we had the correct setup for this document.  Lastly, for the issue with finishing documents at the last minute.  We decide to use the GitHub issues feature.  This allows us more internal deadlines so that we shouldn’t fall behind.

## Winter Break and Winter Term Goals
Now we finished all our documents.  We have a base idea of what we want to do for our software.  Our goal is to do some coding over the break.  For winter term we need to get the software going for the telemetry because the team is doing several tests during this time.  One on a plane and a couple test rocket launches.  

## User Interface Design
Natasha Anisimova

## Reflection
Natasha Anisimova
-----We all may want to work/ go over this

McGrath:

A retrospective is a reflection on the last development period. This will take the form of a table in your document, with three columns (use the p{0.3\linewidth} to the tabular environment for each column):
positives column: anything good that happened
deltas column: changes that need to be implemented
actions column: specific actions that will be implemented in order to create the necessary changes

