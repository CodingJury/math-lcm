const lcmTextField = document.getElementById('lcmTextField')
const lcmTable = document.getElementById('lcmTable')
const lcmDesc = document.getElementById('lcmDesc')

lcmTextField.addEventListener('keyup', e => {
  const lcmString = lcmTextField.value;
  if(!lcmString) {
    clearLCMContent();
    return;
  }

  const test = lcmString.match(/^\d+(,\d+)*$/) //comma seperated digit
  if(!!test) {
    const lcmArr = lcmString.split(',').map((elem)=>parseInt(elem))
    clearLCMContent();
    calculateLCM(lcmArr)
  }else{
    console.warn('Validation failed')
  }
})

function calculateLCM(lcmArr) {
  const minElement = Math.min(...lcmArr)
  if(minElement <= 0) {
    console.error('Every element must be greater than zero')
    return;
  }

  const maxElement = Math.max(...lcmArr)
  
  let currentLCM = lcmArr
  const dividerArr = [];
  for(let divider = 2; divider <= maxElement; divider++) {
    let count = 20;
    while(isAnyOneDivides(currentLCM, divider) && --count) {
      dividerArr.push(divider)
      insertDataIntoTable([divider, ...currentLCM])

      let newLCM = currentLCM.map((a)=>{
        if(a%divider == 0) {
          return a/divider;
        }else{
          return a;
        }
      })

      currentLCM = newLCM; 

      const isComplete = currentLCM.every((a) => a==1);
      if(isComplete) {
        insertDataIntoTable(["", ...currentLCM])
        console.log('complete')
        break;
      }
    }
    if(count == 0) {
      console.error('Max depth reached')
      clearLCMContent()
      alert('Maximum depth reached')
      return;
    }
  }
  displayLCMDesc(lcmArr, dividerArr)
}

const isAnyOneDivides = (arr, x) => arr.some((elem) => elem%x === 0)

const insertDataIntoTable = (arr) => {
  var row = lcmTable.insertRow(-1);
  for(let i = 0; i < arr.length; i++) {
    var cell = row.insertCell(i);
    cell.innerHTML = arr[i];
  }
}

const displayLCMDesc = (lcmArr, dividerArr) => {
  const lcmString = lcmArr.join(',')
  const dividerStr = dividerArr.join('x')
  const product = dividerArr.reduce((a, b)=> a*b, 1)
  lcmDesc.innerHTML = `LCM of (${lcmString}) = ${dividerStr} = ${product}`
}

const clearLCMContent = () => {
  let child = lcmTable.lastElementChild;
  while (child) {
      lcmTable.removeChild(child);
      child = lcmTable.lastElementChild;
  }

  lcmDesc.innerHTML=""
}