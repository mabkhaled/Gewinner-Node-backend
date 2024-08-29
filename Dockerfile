# Use the official Rasa image from Docker Hub
FROM rasa/rasa:latest-full

# Set the working directory
WORKDIR /app

# Copy your Rasa project files into the Docker container
COPY . /app

# Install any dependencies you have listed in requirements.txt
RUN pip install -r requirements.txt

# Expose the port that Rasa will run on
EXPOSE 5005

# Command to run the Rasa server
CMD ["rasa", "run", "--enable-api", "--cors", "*"]
