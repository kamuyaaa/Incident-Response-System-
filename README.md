# Incident Response Management System

## Overview
This project is a collaborative group system designed to support effective **incident response and management**.  
The system allows incidents to be reported, tracked, analyzed, and resolved while ensuring accountability, security, and timely response.

To support teamwork and code quality, the project integrates a **CI/CD pipeline** that automates testing and deployment.

---

## Features
- Incident reporting and tracking
- Role-based access (e.g. Administrator, Responder)
- Incident status updates and escalation
- Notification and alert mechanisms
- Secure data handling
- Automated testing and deployment (CI/CD)

---

## Technology Stack
- **Backend:** Node.js / Express 
- **Frontend:** React
- **Database:** MongoDB 
- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions
- **Deployment:** Render 

---

## CI/CD Pipeline
Our Incident Response System uses a professional DevOps pipeline to ensure code quality and system availability. We have integrated GitHub Actions for testing and Render for automated deployment.

1. **Continuous Integration (CI)** with GitHub Actions
We use GitHub Actions as our automated quality controller. Every time we push code or open a pull request, the system triggers our verification suite.
Automated Testing: The pipeline launches a virtual environment to install dependencies and run our security and logic checks.
Status Gate: Our repository is configured so that code cannot be merged into the develop or main branches unless the CI checks return a green status.
Conflict Prevention: By running these checks on every feature branch, we identify and resolve integration issues before they affect the rest of the team.

2. **Continuous Delivery (CD)** with Render
Once our code has been verified by the CI suite and merged into the main branch, our CD pipeline takes over to update the live system.
Verified Deployment: We use the "After CI checks pass" setting in Render. This ensures that only code that has successfully passed all GitHub Actions tests is allowed to go live.
Automated Updates: Render automatically detects successful merges to the main branch and pulls the latest code to restart our production server.
Environment Management: We use environment variables within the CD pipeline to manage sensitive credentials and port configurations, keeping our secrets out of the public source code.

3. **Pipeline Flow Summary**
Developer: Pushes code to a feature branch.
GitHub Actions (CI): Runs automated checks and reports a pass/fail status.
Team: Reviews the pull request and merges it into the main branch once the status is green.
Render (CD): Receives the signal that the CI passed on the new main branch code.
Production: The live application is updated automatically with zero manual intervention.

## Branching Strategy
- `main` – Stable production-ready code
- `develop` – Active development branch
- `feature/*` – Feature-specific branches

Direct commits to `main` are not allowed.

---

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/incident-response-system.git
