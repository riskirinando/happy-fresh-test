# BMI (Body Mass Index) Calculator
Node.js REST API service endpoint that calculates body mass index (BMI) and its meaning (i.e. underweight, normal, or overweight) depending on the given query string parameters. The accepted query string parameters are `weight` and `height` (e.g. `?height=167&weight=70`).


This project also includes the followings:
- Docker
  - `Dockerfile` use to build docker container image of the application (docker image available from https://hub.docker.com/r/ibnuzamra/bmi-calculator)
- Jenkins CI/CD pipeline
  - `Jenkinsfile` that use for defines the CI/CD pipeline using Jenkins
- Kubernetes
  - `k8s/bmi-calculator` directory which includes the `Deployment`, `Service`, and `ConfigMap` resources to deploy the application on kubernetes cluster
  - `k8s/ingress` directory to deploy kubernetes NGINX ingress controller and resource for host-based routing
  - `k8s/efk` directory to deploy EFK (ElasticSearch, Fluentd, Kibana, and APM) stack for application logging on kubernetes
  - `k8s/prometheus-grafana` directory to deploy Prometheus and Grafana for monitoring on kubernetes

## Assumptions

The BMI calculator application assumes the followings:
- Accepted routes:
  - `GET /?height=<height>&weight=<weight>` for calculating BMI and its meaning
    - `height (cm)` should be a positive **integer** >= 1 and <= 350
    - `weight (kg)` could be a floating point number > 0 and <= 800 
    - BMI value is returned as floating point number rounded to 1 decimal place
    - Label (underweight (`this.bmi < 18.5`), normal (`this.bmi >= 18.5 && this.bmi < 25`), and overweight (`this.bmi >= 25`)) is calculated based on the BMI value
  - `GET /metrics` for consumption by Prometheus

## Getting Started

### Access the BMI calculator (online)
```
# Calculate BMI for weight (70 kg) and height (167 cm)
curl "http://bmi.konservatif.xyz/?height=167&weight=70"

# Output
{"success":true,"bmi":25.1,"label":"overweight"}
```

### Run on Docker
```
docker run -d -p 3000:3000 --name bmi-calculator ibnuzamra/bmi-calculator:latest
curl "http://localhost:3000/?height=167&weight=70"
```

### Run on Kubernetes
```
# Create the resources
kubectl apply -f https://raw.githubusercontent.com/ibnuzamra/bmi-calculator/main/k8s/bmi-calculator/1-bmi-calculator-cm.yaml
kubectl apply -f https://raw.githubusercontent.com/ibnuzamra/bmi-calculator/main/k8s/bmi-calculator/2-bmi-calculator-deployment.yaml
kubectl apply -f https://raw.githubusercontent.com/ibnuzamra/bmi-calculator/main/k8s/bmi-calculator/3-bmi-calculator-svc.yaml

# Access the service
curl "http://bmi.konservatif.xyz/?height=167&weight=70"
```

### Access Monitoring and Logging
```
#Monitoring
http://grafana.konservatif.xyz/

#Logging
http://kibana.konservatif.xyz/
```
