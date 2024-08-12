const lcmTextField = document.getElementById('lcmTextField')
const lcmTable = document.getElementById('lcmTable')
const lcmDesc = document.getElementById('lcmDesc')

// UTILS FUNCTIONS
const successResponse = (data) => ({status: true, data})
const errorResponse = (message = "ERROR OCCURED") => ({status: false, message})
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }

// MAIN FUNCTIONS
document.addEventListener('DOMContentLoaded', () => { LCM() })
lcmTextField.addEventListener('keyup', e => { LCM(); })

function LCM() {
  const preResponse = LCM_pre()

  console.log(preResponse)

  if(preResponse['status']) {
    const numbers = preResponse['data']['numbers'];
    const mainResposne = LCM_main(numbers)
    if(mainResposne['status']) {
      LCM_post(numbers, mainResposne['data'])
    }
  } else {
    lcmDesc.innerHTML = preResponse['message'];
  }

}

function LCM_pre() {
  clearLCMContent()
  const input = lcmTextField.value;

  const numbers = input.split(',').map(Number)
  if(numbers.some(isNaN) || numbers.length < 2) {
    
    return errorResponse("Please enter atleast 2 valid numbers")
  }

  if(!numbers.every(num => num > 0)) {
    return errorResponse("Every number must be greater than 0")
  }

  return successResponse({numbers});
}

function LCM_main(numbers) {
  let result = numbers[0];
  let steps = [];
  let divisors = [];

  // Find the LCM and record steps
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }

  // Find common divisors
  let tempNumbers = [...numbers];
  let divisor = 2;

  while (tempNumbers.some(num => num > 1)) {
    if (tempNumbers.some(num => num % divisor === 0)) {
      divisors.push(divisor);
      steps.push([divisor, ...tempNumbers]);

      tempNumbers = tempNumbers.map(num => (num % divisor === 0 ? num / divisor : num));
    } else {
      divisor++;
    }
  }

  if(tempNumbers.every(num => num == 1)) {
    steps.push([null, ...tempNumbers]);
  }

  return successResponse({ steps, divisors, result })
}

function LCM_post(numbers, { steps, divisors, result }) {
  const lcmString = numbers.join(',')
  const dividerStr = divisors.join('x')
  lcmDesc.innerHTML = `LCM of (${lcmString}) = ${dividerStr} = ${result}`

  // for (let i = 0; i < steps.length; i++) {
  //   insertDataIntoTable(steps[i])
  // }
  
  steps.forEach(step => {
    insertDataIntoTable(step)
  });
}

const insertDataIntoTable = (arr) => {
  var row = lcmTable.insertRow(-1);
  for(let i = 0; i < arr.length; i++) {
    var cell = row.insertCell(i);
    cell.innerHTML = arr[i];
  }
}

const clearLCMContent = () => {
  let child = lcmTable.lastElementChild;
  while (child) {
    lcmTable.removeChild(child);
    child = lcmTable.lastElementChild;
  }

  lcmDesc.innerHTML=""
}