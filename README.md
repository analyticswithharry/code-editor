#### Code Editor

A professional code and comment editor with syntax highlighting, theme switching, and image export features.
How to Use

Paste Code: Enter your code in the provided textarea.

Add Watermark: Optionally, add a comment or watermark in the input field below the textarea.

##### Customize Appearance:

Theme: Toggle between light (🌕) and dark (🌑) modes using the toolbar buttons.
Background Color: Select a custom background color for the preview using the color picker.
Font: Choose a font from the dropdown (e.g., San Francisco, Helvetica).
Language: Select a programming language for syntax highlighting (e.g., JavaScript, Python) or use "Auto".
Font Size: Adjust the font size via the dropdown (12px to 24px).
Bold/Italic: Toggle bold (𝐁) or italic (𝐈) formatting for the code preview.


Generate Preview: Click "Generate Preview" to display the formatted code with syntax highlighting.

Export: Export the preview as an image by clicking "Export PNG" or "Export JPG".

##### Setup

Install Dependencies:
```
npm install
```


Run Locally:
```
node server.js
```
Access at http://localhost:3000.


Deploy to Netlify

Push to GitHub:
```
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

#####  Deploy on Netlify:

1. Go to Netlify.

2. Click Add new site > Import an existing project.

3. Connect to GitHub and select your repository.

4. Set Publish directory: public.

5. Click Deploy site.



##### Notes

server.js is for local development only; Netlify serves static files from public/.

Requires express for the local server.

Analytics: Tracks the number of previews generated (displayed in the analytics section).

Support: Contact hemantthapa1998@gmail.com for assistance.
