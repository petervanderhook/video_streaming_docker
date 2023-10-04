# Ubuntu file system Dockerfile
FROM ubuntu:20.04

# Install required packages
RUN apt-get update && \
    apt-get install -y \
        samba \
        nfs-kernel-server \
        nfs-common

# Create a shared directory for the file system
RUN mkdir /mnt/data

# Expose the shared directory as a volume
VOLUME /mnt/data

# Start the Samba service
CMD service smbd start

