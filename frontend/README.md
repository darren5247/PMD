# Piano Music Database _(PMD)_ - Front End Website
**Piano Music Database - Find the perfect piece.**

_PWA/Website: [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [TypeScript](https://typescriptlang.org), [Strapi](https://strapi.io), [PostgreSQL](https://postgresql.org), [Typesense](https://typesense.org), [Brevo](https://brevo.com), [GitHub](https://github.com)_

[![Deploy Prod](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-prod.yml/badge.svg?branch=prod&event=push)](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-prod.yml)[![Deploy Staging](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-staging.yml/badge.svg?branch=staging&event=push)](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-staging.yml)[![Deploy Dev](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-dev.yml/badge.svg?branch=dev&event=push)](https://github.com/pianomusicdb/pmdWEB/actions/workflows/deploy-dev.yml)

---

## Repository Description 
This repository holds the files for the Front End Website of Piano Music Database.  
The website is a "[Next.js](https://nextjs.org) with [Tailwind CSS](https://tailwindcss.com) in [TypeScript](https://typescriptlang.org)" PWA/website. The files are managed and deployed from a [GitHub](https://github.com). The search engine is powered by [Typesense](https://typesense.org) and the data is collected in a [Strapi](https://strapi.io) API.

## Technology Overview
- Fast, responsive, and accessible "[Next.js](https://nextjs.org) with [Tailwind CSS](https://tailwindcss.com) in [TypeScript](https://typescriptlang.org)" PWA/website
- Robust database/API using [Strapi](https://strapi.io) with [TypeScript](https://typescriptlang.org) powered by a [PostgreSQL](https://postgresql.org) database
- Powerful search engine using [Typesense](https://typesense.org)
- Emails using [Brevo](https://brevo.com)
- Continuous integration and continuous delivery/deployment using [GitHub](https://github.com)
- Compatible with most desktop (PC/Mac/Linux) and mobile (iOS/Android/other) internet browsers

---

## Relevant Links
- Frontend Homepage: [PianoMusicDatabase.com](https://PianoMusicDatabase.com)
- Frontend Search: [PianoMusicDatabase.com/search](https://PianoMusicDatabase.com/search)

---

## Copyright Information
**Copyright 2021-2025 Piano Music Database TM**

**Some rights reserved.**

Use of [Piano Music Database’s code](https://github.com/pianomusicdb/pmdWEB "pmdWEB GitHub Repository") is strictly forbidden.

**Font Used:**
- [Montserrat](https://github.com/JulietaUla/Montserrat) by [Julieta Ulanovsky](https://github.com/JulietaUla) (Copyright 2010-2021 Julieta Ulanovsky) (SIL Open Font License 1.1)

---

## Local Development

### Setup Instructions

1. Clone repository to local folder

2. Install all dependencies in that folder  
    `npm install`

3. Build to test for errors ***(build often!)***  
    `npm run build --clean`  
    *`.env` file should be created to show more data when running locally.*  

    `npm run build-no-sitemaps --clean`  
    *Build without sitemaps to save time!*  

4. Run the local development server  
    `npm run dev`  
    *`.env` file should be created to show more data when running locally.*  

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

6. Stop the server  
    `CTRL+C`  
    `Y`

---

## Production Deployment

1. Setup remote server with SSH Key for root access

2. Configure DNS to point to new server
    1. "A" record, `@.pianomusicdatabase.com` host, `xxx.xxx.xxx.xxx` ipv4
    2. "A" record, `www.pianomusicdatabase.com` host, `xxx.xxx.xxx.xxx` ipv4

3. Log into Server IP using the root user via SSH

4. Update System  
    `sudo apt update`  
    `sudo apt upgrade -y`

5. Create New User  
    ```sudo adduser {{NONROOT_SUDO_USER``` *(Enter a secure password)*   
    ```sudo usermod -aG sudo {{NONROOT_SUDO_USER}}``` 

6. Log into `{{NONROOT_SUDO_USER}}`

7. Install NVM  
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`

8. Reload shell configuration  
    `source ~/.bashrc`

9. Install Node.js  
    `nvm install 18`  
    `nvm use 18 `  
    `nvm alias default 18`

10. Install Nginx  
    `sudo apt install nginx -y`

11. Configure Nginx for pmdWEB  
    `sudo nano /etc/nginx/sites-available/pmdWEB-prod`
    ```
    server {
        server_name pianomusicdatabase.com www.pianomusicdatabase.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```  
    `CTRL + x` and `y` and `ENTER` to exit nano

12. Enable site in Nginx  
    `sudo ln -s /etc/nginx/sites-available/pmdWEB-prod /etc/nginx/sites-enabled/`    
    `sudo nginx -t`  
    `sudo systemctl restart nginx`  
    `sudo systemctl enable nginx`

13. Install PM2  
    `npm install -g pm2`

14. Install Certbot for SSL  
    `sudo apt install certbot python3-certbot-nginx -y`

15. Apply Certbot SSL to URLs and Setup auto-renew  
    `sudo certbot --nginx ` 
    ```
    echo "0 0,12 \* \* \* root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() \* 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
    ```

16. Clone prod branch of the [pmdWEB repository](https://github.com/pianomusicdb/pmdWEB) into ```/home/{{NONROOT_SUDO_USER}}/```  
    ```
    git clone --single-branch --branch prod https://pianomusicdb:ACCESSKEYHERE@github.com/pianomusicdb/pmdWEB.git pmdWEB-prod
    ```  
17. Enter git cloned folder  
    `cd pmdWEB-prod`

18. Adjust env vars for production use

19. Install npm dependencies  
    `npm install`

20. Run a Build  
    `npm run build`

21. Start pmdWEB in pm2  
    `pm2 start npm --name "pmdWEB-prod" -- run start`
    `pm2 start npm --name "pmdWEB-staging" -- run start -- --port=3002` (for branches)

22. Setup PM2 Startup Script and Save  
    `pm2 startup`  
    `pm2 save`

23. Check the frontend is running by going to [https://pianomusicdatabase.com](https://pianomusicdatabase.com)