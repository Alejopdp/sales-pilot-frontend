## General

-   Production ID => gjobfjilbclolpaeinpedbhbehdcpebj
-   Staging ID => bdogiafgildacfheaaenopoofinjknkb

## How to Build

#### For production

1. You should manually change the `.env.production` "REACT_APP_EXTENSION_ID" variable to => "gjobfjilbclolpaeinpedbhbehdcpebj". Also change the "REACT_APP_WS_API_URL" y "REACT_APP_API_URL" variables to the production URLs

2. Then run the command `npm run build:packed` in the root directory

3. You should see a "packed" directory in the root directory with the build output

#### For local development

1. Make sure you have the "REACT_APP_EXTENSION_ID" set to "enkbjolcglilknggjlngokegcfgpebnl"

2. Run the command `npm run build:unpacked` in the root directory

## How to Deploy

1. Once you've made and tested all your release changes, go to `/manifest.json` and update the "version" field.

2. Also update the "version" field in `/package.json` to match the manifest

3. Build for production

4. Once you have your packed directory after the build, zip that folder

5. Go to https://chrome.google.com/u/1/webstore/devconsole/85aefddc-bc96-40dc-a072-7aa9f20caee2?hl=en. If you don't have access, request it to alejo@novolabs.xyz

6. Click on the button "+ New item" at the top right corner

7. Drop the zipped packed folder and complete the form requested on the chrome dev dashboard

8. Execute the following commands to tag the new version in Github
   `git tag vx.x.x`
   `git push origin vx.x.x`

## How to Debug (Background service)

## How to inject script
