# Oxoron.github.io

LT learning materials

Github pages link: https://oxoron.github.io/NounPlurals.html

# How to run locally

Docker image : https://hub.docker.com/_/httpd

Docker build command (execute on the location of index.html): `docker build --no-cache -t my-apache2 .`

Docker run command: `docker run -dit --name LtMaterial -p 8080:80 my-apache2`

Then run: http://localhost:8080/

Don't forget to update browser cache! 
