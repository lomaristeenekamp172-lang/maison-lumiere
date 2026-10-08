# Maison Lumière Candles

Static site plus one Netlify Function that stores shop photos in Netlify Blobs.

## Deploy
1. Create a GitHub repository and upload every file in this folder (keep the folder structure).
2. In Netlify: Add new site, Import from Git, pick the repository. Build settings are read from netlify.toml.
3. In Site configuration, Environment variables, add OWNER_CODE with your private owner code, then redeploy.
4. Open the site, go to Photos, tap Owner access and enter the code to add or delete photos.

Visitors can see photos but cannot change them. The code is checked on the server and is never in the page.
