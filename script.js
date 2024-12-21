var fullScreenElem = document.getElementById("body");

/* Function to open fullscreen mode */
function openFullscreen() {
  if (fullScreenElem.requestFullscreen) {
    fullScreenElem.requestFullscreen();
  } else if (fullScreenElem.webkitRequestFullscreen) { /* Safari */
    fullScreenElem.webkitRequestFullscreen();
  } else if (fullScreenElem.msRequestFullscreen) { /* IE11 */
    fullScreenElem.msRequestFullscreen();
  }
}

/* Array modification diagram

unshift -> [array] <- push
shift   <- [array] -> pop

cause I didnt know about two of these lol
*/

var slices = [
    { label: "Person 1", color: getFestiveColor(), gifts: 3, id: "p1"},
    { label: "Person 2", color: getFestiveColor(), gifts: 5, id: "p2"},
    { label: "Person 3", color: getFestiveColor(), gifts: 4, id: "p3"},
    { label: "Person 4", color: getFestiveColor(), gifts: 4, id: "p4"},
];

var chosenLast = [];

document.addEventListener("DOMContentLoaded", () => {
    const wheel = document.getElementById("wheel");
    
    updateList();
    updateSlices();
});

async function spinTheWheel() {
    const chosenSlice = getWeightedRandom();

    if (chosenLast.length > 2) {chosenLast.pop();}
    chosenLast.unshift(chosenSlice);

    console.log(slices.indexOf(chosenSlice) + " | length: " + slices.length + " | name: " + chosenSlice.label);

    document.getElementById("wheelMessage").innerHTML = chosenSlice.label;

    const wheel = document.getElementById("wheel");
    const landingRotation = (slices.indexOf(chosenSlice) + 0.5 + Math.random()) / (slices.length * -1); //(3 - 0.5) + 0.2)/ -4
    console.log(landingRotation * 4);

    // Remove any previously applied animation and set css variables
    wheel.style.animation = 'none';
    document.documentElement.style.setProperty("--startRot", `${lastRotation * 360}deg`);
    document.documentElement.style.setProperty("--endRot", `${landingRotation * 360}deg`);


    // Trigger whatever a reflow is
    void wheel.offsetWidth; // This forces a reflow somehow

    // apply spin animation again
    wheel.style.animation = 'spin 8s cubic-bezier(0.05, 0, 0, 1) forwards';
    
    //set the last roation
    lastRotation = landingRotation;

    await new Promise(resolve => setTimeout(resolve, 8000)); //wait 8s

    const wheelMessage = document.getElementById("wheelMessage");
    wheelMessage.style.animation = 'none';
    void wheelMessage.offsetWidth; // This forces a reflow somehow
    wheelMessage.style.animation = 'message-grow 0.5s cubic-bezier(0.8, 0, 0, 1) 1s forwards';

    await new Promise(resolve => setTimeout(resolve, 1500)); //wait 1.5s

    chosenSlice.gifts--;
    if (chosenSlice.gifts == 0) {
        slices.splice(slices.indexOf(chosenSlice), 1) //remove from the list
        updateSlices();
    }
    updateList();
}

function updateList() {
    let peopleContainer = document.querySelector('.people');
    peopleContainer.innerHTML = '';

    slices.forEach((slice, index) => {
        addNewPerson(index + 1, slice.color, false, slice.gifts, slice.label)
    });
}

function updateSlices() {
    document.getElementById('wheel').innerHTML = ''; //reset the slices to add new ones

    if (slices.length == 0) {
        document.getElementById('wheel').innerHTML = 'Theres nobody on the wheel!';
    } else if (slices.length == 1) {
        document.getElementById('wheel').innerHTML = `Theres only ${slices[0].label} on the wheel!`;
    } else {
        const totalSlices = slices.length;
        const angle = 360 / totalSlices;
        const sliceWidth = Math.tan((angle / 2) * (Math.PI / 180)) * 50; // calculate the neccisary width to fill the whole space
    
        slices.forEach((slice, index) => {
            const sliceDiv = document.createElement("div");
            sliceDiv.classList.add("slice");
            sliceDiv.style.setProperty("--angle", `${angle}deg`);
            sliceDiv.style.setProperty("--i", index);
            sliceDiv.style.setProperty("--slice-width", `${sliceWidth}%`);
            sliceDiv.style.setProperty("--slice-color", slice.color);
            sliceDiv.style.backgroundColor = slice.color;
            sliceDiv.style.transform = `rotate(${index * angle}deg)`;
        
            // add the text to each slice
            const span = document.createElement("span");
            span.innerText = slice.label;
            sliceDiv.appendChild(span);
        
            wheel.appendChild(sliceDiv);
        });
    }
}

var settingsOpen = false;

function openSettings() {
    const settings = document.getElementById("settings");
    void settings.offsetWidth; // This forces a reflow somehow
    settings.style.transform = 'translate(-50%, -50%)';
    settingsOpen = true;
}

function closeSettings() {
    const settings = document.getElementById("settings");
    void settings.offsetWidth; // This forces a reflow somehow
    if (settingsOpen) {settings.style.transform = 'translate(-50%, 70%)';};
}

var lastRotation = 0; //store where the wheel landed last so we can set the animation to start there. from 0-1

function closeMessage() {
    const wheelMessage = document.getElementById("wheelMessage");
    wheelMessage.style.animation = 'none';
    void wheelMessage.offsetWidth; // This forces a reflow somehow
    wheelMessage.style.animation = 'message-grow 0.5s cubic-bezier(0.8, 0, 0, 1) 0s reverse';
}

function updatePersonColor(pColorSelector) {
    const personDiv = pColorSelector.parentElement;
    const color = pColorSelector.value;

    let IDToFind = personDiv.getAttribute('id');

    // Find the slice with id 'p3' and update its properties
    const personToUpdate = slices.find(slice => slice.id === IDToFind);

    if (personToUpdate) {
        personToUpdate.color = color;

        // Log to verify the update
        console.log("Updated " + personToUpdate.label + " with " + color);
    } else {
        console.log(`No person found with id '${IDToFind}'.`);
    }

    updateSlices();
}

function updatePersonName(pNameInput) {
    const personDiv = pNameInput.parentElement;
    const name = pNameInput.value;

    let IDToFind = personDiv.getAttribute('id');

    // Find the slice with id 'p3' and update its properties
    const personToUpdate = slices.find(slice => slice.id === IDToFind);

    if (personToUpdate) {
        personToUpdate.label = name;

        // Log to verify the update
        console.log("Updated " + personToUpdate.label + " with the new name");
    } else {
        console.log(`No person found with id '${IDToFind}'.`);
    }

    updateSlices();
}

function updatePersonGiftNumber(pGiftNumInput) {
    const personDiv = pGiftNumInput.parentElement;
    const numGifts = Number(pGiftNumInput.value);

    let IDToFind = personDiv.getAttribute('id');

    // Find the slice with id 'p3' and update its properties
    const personToUpdate = slices.find(slice => slice.id === IDToFind);

    if (personToUpdate) {
        personToUpdate.gifts = numGifts;

        // Log to verify the update
        console.log("Updated " + personToUpdate.label + " to have " + numGifts + " gifts");
    } else {
        console.log(`No person found with id '${IDToFind}'.`);
    }

    updateSlices();
}

var idStartNum = 5;

function addNewPerson(number, color, fromButton, numGifts, name) {
    if (!name) {
        if (!number) {
            idStartNum++;
            number = idStartNum;

        }

        name = "Person " + (slices.length + 1);
    }

    if (!color) {
        color = getFestiveColor();
    }

    if (!numGifts) {
        numGifts = 1;
    }

    let peopleContainer = document.querySelector('.people'); 
    
    let newPerson = document.createElement('div');
    newPerson.classList.add('person');
    newPerson.innerHTML = `
        <input class="p-name" type="text" maxlength="10" placeholder="Name" onchange="updatePersonName(this)">
        <input class="p-input" type="color" onchange="updatePersonColor(this)">
        <input class="p-input" type="number" placeholder="#" onchange="updatePersonGiftNumber(this)">
        <button class="p-delete" onclick="deletePerson(this)">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;
    
    peopleContainer.appendChild(newPerson);
    newPerson.id = "p" + number;

    if (fromButton) {
        // Trigger whatever a reflow is
        void newPerson.offsetWidth; // This forces a reflow somehow
        newPerson.style.animation = 'deletePinch 0.2s reverse';
    };

    // Update the input fields' IDs and placeholders
    let newNameInput = newPerson.querySelector('.p-name');
    let newColorInput = newPerson.querySelector('.p-input[type="color"]');
    let newNumGiftsInput = newPerson.querySelector('.p-input[type="number"]');
    let deleteButton = newPerson.querySelector('.p-delete');

    // Clear the input values
    newNameInput.value = name;
    newColorInput.value = color;
    newNumGiftsInput.value = numGifts;

    if (fromButton) {
        slices.push({ label: name, color: color, gifts: 1, id: "p" + number},);
    }

    updateSlices()
}

async function deletePerson(deleteButton) {

    const personDiv = deleteButton.parentElement;

    // Remove any previously applied animation and set css variables
    personDiv.style.animation = 'none';

    // Trigger whatever a reflow is
    void personDiv.offsetWidth; // This forces a reflow somehow
    personDiv.style.animation = 'deletePinch 0.2s forwards';

    await new Promise(resolve => setTimeout(resolve, 200)); //wait 0.5s

    personDiv.remove(); // Removes the entire 'person' div

    const sliceElement = slices.find(slice => slice.id === personDiv.getAttribute('id'));
    slices.splice(slices.indexOf(sliceElement), 1);

    updateSlices();
}

function resetWheel() {
    //set rotation to zero and 

    slices = [
        { label: "Person 1", color: getFestiveColor(), gifts: 3, id: "p1"},
        { label: "Person 2", color: getFestiveColor(), gifts: 5, id: "p2"},
        { label: "Person 3", color: getFestiveColor(), gifts: 4, id: "p3"},
        { label: "Person 4", color: getFestiveColor(), gifts: 4, id: "p4"},
    ];

    updateSlices();
    updateList();
}

function getFestiveColor() {
    const festiveColors = ['#0e4e3d', '#424e3a', '#ad7757', '#915b42', '#302f36', '#6e332d', '#a51b1f', '#6d4832', '#84863a', '#3e4b37', '#bf3b4c', '#834f59', '#3e5330', '#ab0203', '#077e66', '#bf9f70', '#122e12', '#f5614e', '#cb241e', '#33a65f', '#118a5f', '#225e6f'];
    const randomElement = festiveColors[Math.floor(Math.random() * festiveColors.length)];
    return randomElement;
}

function getWeightedRandom() {
    let weights = [];
    slices.forEach((slice) => {
        let numGifts = slice.gifts;
        if (slice === chosenLast[0]) {
            numGifts *= 0.4;
        } else if (slice === chosenLast[1]) {
            numGifts *= 0.7;
        }
        weights.push(numGifts);
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const normalizedWeights = weights.map(weight => weight / totalWeight);

    let cumulativeWeights = [];
    normalizedWeights.reduce((sum, weight) => {
        sum += weight;
        cumulativeWeights.push(sum);
        return sum;
    }, 0);

    const random = Math.random();
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random <= cumulativeWeights[i]) {
            return slices[i];
        }
    }
}

// Snow from https://codepen.io/radum/pen/xICAB

(function () {

    var COUNT = 300;
    var masthead = document.querySelector('.sky');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;
    var i = 0;
    var active = false;
  
    function onResize() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#FFF';
  
      var wasActive = active;
      active = width > 600;
  
      if (!wasActive && active)
        requestAnimFrame(update);
    }
  
    var Snowflake = function () {
      this.x = 0;
      this.y = 0;
      this.vy = 0;
      this.vx = 0;
      this.r = 0;
  
      this.reset();
    }
  
    Snowflake.prototype.reset = function() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.vy = 1 + Math.random() * 3;
      this.vx = 0.5 - Math.random();
      this.r = 1 + Math.random() * 2;
      this.o = 0.5 + Math.random() * 0.5;
    }
  
    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';
  
    var snowflakes = [], snowflake;
    for (i = 0; i < COUNT; i++) {
      snowflake = new Snowflake();
      snowflake.reset();
      snowflakes.push(snowflake);
    }
  
    function update() {
  
      ctx.clearRect(0, 0, width, height);
  
      if (!active)
        return;
  
      for (i = 0; i < COUNT; i++) {
        snowflake = snowflakes[i];
        snowflake.y += snowflake.vy;
        snowflake.x += snowflake.vx;
  
        ctx.globalAlpha = snowflake.o;
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
  
        if (snowflake.y > height) {
          snowflake.reset();
        }
      }
  
      requestAnimFrame(update);
    }
  
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  
    onResize();
    window.addEventListener('resize', onResize, false);
  
    masthead.appendChild(canvas);
  })();
  