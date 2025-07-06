# Use a base image that includes both Node.js and Python
FROM node:20-python

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json, and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy requirements.txt and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Expose the port your Node.js server listens on (Render's default is 8080)
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "start"]
