## How to Build

#### For production

1. You should manually change the .env.production "REACT_APP_EXTENSION_ID" variable to => "bdogiafgildacfheaaenopoofinjknkb".

2. Then run the command npm run build:packed in the root directory

3. You should see a "packed" directory in the root directory with the build output

#### For local development

1. Make sure you have the "REACT_APP_EXTENSION_ID" set to "enkbjolcglilknggjlngokegcfgpebnl"

2. Run the command npm run build:unpacked in the root directory

## How to Deploy

#### To Production

1. One you have your packed directory after the build, zip that folder

2. Go to https://chrome.google.com/u/1/webstore/devconsole/85aefddc-bc96-40dc-a072-7aa9f20caee2?hl=en. If you don't have access, request it to alejo@novolabs.xyz

3. Click on the button "+ New item" at the top right corner

4. Drop the zipped packed folder and complete the form requested on the chrome dev dashboard

## How to Debug (Background service)

## How to inject script
