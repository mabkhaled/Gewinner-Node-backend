# Base image
FROM rasa/rasa:3.6.20-full

# Set the working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install any additional dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your Rasa project files to the Docker container
COPY . .

# Expose the port Rasa will run on
EXPOSE 5005

# Command to start Rasa
CMD ["run", "--enable-api", "--cors", "*", "--debug", "--port", "5005"]