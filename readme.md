Design:

Broad Overview: Dungeon is a web-browser 3d turn-based RPG in which you control a group of adventurers built from user-created parts, as they explore user-created areas, encountering user-created characters, and finding user-created items.

Experience other people's creations, and share your own in turn.



Distinguishing Technical Features: Dungeon has a simple lighting system. Lighting and shadows are entirely baked into areas and are per triangle of geometry. Dynamic objects such as characters and other moveable objects don't cast any shadows and their lighting depends on their location against the baked-in lighting.

If feasible, include hair and clothing physics.



Within webgl canvas:

Webgl Canvas Setup:



state\[0]: A menu with Dungeon written over a text entry box (file name) and three buttons: Create New User File, Load User File, Exit.

state\[1]: (from Create New User File button). See note 0 below for reference, uses the blob method to download a new file to the Downloads

&#x09;directory with the name set in the file name field. See note 1 for the reasoning behind this.

&#x09;Reverts to state\[0].

state\[2]: (from Load User File button). See note 1 below for reasoning, and note 2 for implementation details, uses the filereader api to

&#x09;upload the file into browser-controlled RAM. This is done by way of a system dialog, so there needs to be a check done on the

&#x09;validity of the file before anything else is done. If the file is valid proceed to state\[4], if not, proceeed to state\[5].

state\[3]: (from Exit button). See note 3 for details on using a canvas pseudo-button as a hyperlink. Returns to the main page of the website.







Note 0: function downloadFile(content, fileName, contentType) {

&#x20; // 1. Create a Blob with your string or binary content

&#x20; const blob = new Blob(\[content], { type: contentType });



&#x20; // 2. Generate a local Object URL pointing to the Blob data

&#x20; const url = URL.createObjectURL(blob);



&#x20; // 3. Create a temporary, hidden anchor element

&#x20; const anchor = document.createElement("a");

&#x20; anchor.href = url;

&#x20; anchor.download = fileName; // Suggests the default filename to the browser



&#x20; // 4. Append to DOM, trigger the download, and remove it immediately

&#x20; document.body.appendChild(anchor);

&#x20; anchor.click();

&#x20; document.body.removeChild(anchor);



&#x20; // 5. Release memory by revoking the Object URL after a tiny delay

&#x20; setTimeout(() => URL.revokeObjectURL(url), 100);

}



// Example usage for a plain text file:

downloadFile("Hello, World!", "example.txt", "text/plain");



// Example usage for a JSON file:

const jsonData = JSON.stringify({ name: "AI", status: "active" });

downloadFile(jsonData, "data.json", "application/json");







Note 1: In order to support all browsers, and be more secure, browsers shouldn't read and write directly from files. Instead, if a file needs to be created,

it's made in RAM controlled by the browser, and then downloaded like any other file. The user is automatically given the option to approve or reject it,

like any other file.

When it comes to loading a file, the file is read into browser-controlled RAM, and any necessary modifications are also made in browser-controlled RAN. Then

when the user wants to do a backup onto their own system, the same procedure as above is used.

For file creation and writing, see Note 0. For file reading and opening, see Note 2.







Note 2: // 1. Select the DOM elements

const fileInput = document.getElementById('fileInput');

const output = document.getElementById('output');



// 2. Listen for the user to select a file

fileInput.addEventListener('change', function(event) {

&#x20; const file = event.target.files\[0];

&#x20; 

&#x20; // Exit if the user cancelled the selection

&#x20; if (!file) {

&#x20;   return;

&#x20; }



&#x20; // 3. Create a instance of FileReader

&#x20; const reader = new FileReader();



&#x20; // 4. Listen for the file reading process to complete

&#x20; reader.addEventListener('load', function(loadEvent) {

&#x20;   // The file content is stored in the event target's result

&#x20;   const fileContent = loadEvent.target.result;

&#x20;   

&#x20;   // Display the text on the page

&#x20;   output.textContent = fileContent;

&#x20; });



&#x20; // 5. Listen for potential errors during reading

&#x20; reader.addEventListener('error', function() {

&#x20;   console.error('Error reading the file:', reader.error);

&#x20; });



&#x20; // 6. Start reading the file as plain text

&#x20; reader.readAsText(file);

});







Note 3: <!DOCTYPE html>

<html lang="en">

<head>

&#x20;   <meta charset="UTF-8">

&#x20;   <title>Canvas Hyperlink Button</title>

&#x20;   <style>

&#x20;       canvas {

&#x20;           border: 1px solid #ccc;

&#x20;           cursor: default;

&#x20;       }

&#x20;   </style>

</head>

<body>



<canvas id="myCanvas" width="400" height="200"></canvas>



<script>

const canvas = document.getElementById('myCanvas');

const ctx = canvas.getContext('2d');



// Define the pseudo-button dimensions and destination

const button = {

&#x20;   x: 100,

&#x20;   y: 75,

&#x20;   width: 200,

&#x20;   height: 50,

&#x20;   text: "Visit Open AI",

&#x20;   url: "https://openai.com"

};



// Function to draw the button

function drawButton(isHovered = false) {

&#x20;   ctx.clearRect(0, 0, canvas.width, canvas.height);

&#x20;   

&#x20;   // Draw button background (changes color on hover)

&#x20;   ctx.fillStyle = isHovered ? '#0056b3' : '#007BFF';

&#x20;   ctx.fillRect(button.x, button.y, button.width, button.height);

&#x20;   

&#x20;   // Draw button text

&#x20;   ctx.fillStyle = '#FFFFFF';

&#x20;   ctx.font = '20px sans-serif';

&#x20;   ctx.textBaseline = 'middle';

&#x20;   ctx.textAlign = 'center';

&#x20;   ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);

}



// Helper to check if mouse is inside the button boundaries

function isMouseInside(mouseX, mouseY) {

&#x20;   return mouseX >= button.x \&\& 

&#x20;          mouseX <= button.x + button.width \&\& 

&#x20;          mouseY >= button.y \&\& 

&#x20;          mouseY <= button.y + button.height;

}



// Get correct mouse coordinates relative to the canvas

function getMousePos(e) {

&#x20;   const rect = canvas.getBoundingClientRect();

&#x20;   return {

&#x20;       x: e.clientX - rect.left,

&#x20;       y: e.clientY - rect.top

&#x20;   };

}



// Listen for mouse movement to change cursor style (pointer like a link)

canvas.addEventListener('mousemove', (e) => {

&#x20;   const pos = getMousePos(e);

&#x20;   if (isMouseInside(pos.x, pos.y)) {

&#x20;       canvas.style.cursor = 'pointer';

&#x20;       drawButton(true); // Redraw with hover state

&#x20;   } else {

&#x20;       canvas.style.cursor = 'default';

&#x20;       drawButton(false); // Redraw with normal state

&#x20;   }

});



// Listen for clicks to navigate

canvas.addEventListener('click', (e) => {

&#x20;   const pos = getMousePos(e);

&#x20;   if (isMouseInside(pos.x, pos.y)) {

&#x20;       // Acts like a hyperlink

&#x20;       window.open(button.url, '\_blank'); 

&#x20;       // Use window.location.href = button.url; to open in the same tab

&#x20;   }

});



// Initial draw

drawButton();

</script>



</body>

</html>

