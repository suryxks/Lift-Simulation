const floorsInput = document.getElementById('floors');
const liftInput = document.getElementById('lifts');
const formSubmitButton = document.querySelector("button[type='submit']")
const body = document.querySelector("body");
const rootElement = document.querySelector("#root");
let lifts = [];
let floors = [];
let pending = [];
formSubmitButton.addEventListener('click', (e) => {
    e.preventDefault()
    const numberOfFloors = Number(floorsInput.value);

    rootElement.innerHTML = '';
    lifts = [];
    floors = [];
    const numberOfLifts = Number(liftInput.value);
    if (!numberOfFloors || !numberOfLifts) {
        alert('please enter number of lifts and floors')
    }
    generateFloorsAndlift(numberOfLifts, numberOfFloors);
})


const generateFloorsAndlift = (liftCount, floorCount) => {
    generateFloors(floorCount);
    generateLifts(liftCount)
}
const clickHandler = (event) => {
    const buttonId = (event.target.id);
    const floorNumber = Number(buttonId.charAt(buttonId.length - 1));
    pending.push(floorNumber)
}
const findNearestlift = (lifts, destinationFloor) => {
    let nearestLiftDistance = floors.length;
    let nearestliftId
    for (let liftIndex = 0; liftIndex < lifts.length; liftIndex++) {
        const lift = lifts[liftIndex];
        if (Math.abs(lift.currentFloor - destinationFloor) < nearestLiftDistance && lift.isActicve === false) {
            nearestLiftDistance = Math.abs(lift.currentFloor - destinationFloor);
            nearestliftId = lift.id;
        }
    }
    return nearestliftId;
}

const moveLift = (from, to, liftId) => {
    const lift = lifts.find(lift => lift.id === liftId);
    const distance = -1 * (to) * 160;
    const time = Math.abs(from - to) * 2;
    const leftDoor = document.querySelector(`#left-door${liftId}`)
    const rightDoor = document.querySelector(`#right-door${liftId}`)
    setTimeout(() => {
        lift.currentFloor = to;
        leftDoor.style.transform = `translateX(-100%)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `translateX(100%)`
        rightDoor.style.transition = `transform 2.5s`

    }, time * 1000)

    lift.isActicve = true;

    setTimeout(() => {
        leftDoor.style.transform = `translateX(0)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `translateX(0)`
        rightDoor.style.transition = `transform 2.5s`;

    }, time * 1000 + 2500)
    setTimeout(() => {
        lift.isActicve = false;;
    }, time * 1000 + 5000)
    lift.domElement.style.transform = `translateY(${distance}px)`;
    lift.domElement.style.transition = `transform ${time}s`
}
const generateFloors = (floorCount) => {

    for (let index = 0; index < floorCount; index++) {
        const floor = document.createElement("div");
        floor.classList.add('floor')
        floor.id = `floor${floorCount - index - 1}`
        const buttonsContainer = document.createElement("div");
        const UpButton = document.createElement("button");
        UpButton.innerText = 'Up'

        UpButton.classList.add('up');
        UpButton.id = `up${floorCount - index - 1}`
        UpButton.addEventListener('click', clickHandler)
        const downButton = document.createElement("button");
        downButton.classList.add('down');
        downButton.addEventListener('click', clickHandler)
        downButton.id = `down${floorCount - index - 1}`;
        downButton.innerText = 'Down'
        buttonsContainer.classList.add("buttons-wrapper");
        buttonsContainer.appendChild(UpButton);
        buttonsContainer.appendChild(downButton);
        floor.appendChild(buttonsContainer)
        rootElement.appendChild(floor)
        floors.push(floor)

    }
}
const generateLifts = (liftCount) => {
    for (let index = 0; index < liftCount; index++) {
        //generate lifts
        const floor0 = document.querySelector("#floor0");
        const lift = document.createElement("div");
        const leftDoor = document.createElement("div");
        const rightDoor = document.createElement("div");
        leftDoor.classList.add("door");
        leftDoor.classList.add("door-left");
        rightDoor.classList.add("door");
        rightDoor.classList.add("door-right")
        leftDoor.id = `left-door${index}`;
        rightDoor.id = `right-door${index}`;
        lift.appendChild(leftDoor);
        lift.appendChild(rightDoor);
        lift.classList.add('lift')
        lift.id = `lift${index}`;
        lift.style.left = `${100+index*100}px`
        const liftState = {
            id: index,
            isActicve: false,
            currentFloor: 0,
            domElement: lift,
            innerHtML: ``,
        }
        floor0.appendChild(lift);
        lifts.push(liftState)
    }

    setInterval(() => {
        scheduleLift()
    }, 100)
}
const scheduleLift = () => {
    if (pending.length === 0) return;
    const floor = pending.shift();
    const nearestliftId = findNearestlift(lifts, floor);
    const nearestLift = lifts.find(lift => lift.id === nearestliftId);
    if (!nearestLift) {
        pending.unshift(floor);
        return;
    }
    moveLift(nearestLift.currentFloor, floor, nearestliftId);
}