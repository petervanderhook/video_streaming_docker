FROM nginx:latest

# Copy the HTML files to the Nginx server root directory
COPY ./html/index.html /var/www/html/index.html

# Copy the Nginx configuration file
COPY ./site.conf /etc/nginx/conf.d/default.conf

#RUN ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/site.conf

#RUN systemctl restart nginx & ufw allow 'Nginx HTTP' & ufw allow OpenSSH & ufw enable

# Expose port 80 to the host system
EXPOSE 80

# # Start the Nginx service
CMD ["nginx", "-g", "daemon off;"]
