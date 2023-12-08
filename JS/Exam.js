import db from './CommonFirebase.js'
import {ref, set,get, update} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
let randomID = localStorage.getItem("UUID");

let username = localStorage.getItem("username")
let usr = document.querySelector(".username")
usr.innerHTML = username
let duration = 0;

let Durationleft = document.querySelector(".Durationleft")
let livecont = document.querySelector(".livecont")
let resultcont = document.querySelector(".result")

get(ref(db,`${randomID}/Questions`))
  .then((snapshot) => {
    const data = snapshot.val();
    duration = Object.keys(data).length - 1
    let H = Object.keys(data).length / 60
    H = H.toFixed(0)
    let M = Object.keys(data).length % 60
    Durationleft.innerHTML = `${H}:${M}`
    Starting()
  })
  .catch((err) => {
    console.error(err);
});

let expiredCont = document.querySelector(".expired")
let queAnsCont = document.querySelector(".qn-ans-cont")

let timeleft = document.querySelector(".timeleft")
let intervalId;

let questionCont = document.querySelector(".question")
let OptionA = document.querySelector(".a")
let OptionB = document.querySelector(".b")
let OptionC = document.querySelector(".c")
let OptionD = document.querySelector(".d")
let radioButtons = document.getElementsByName("answerOption")

let randomQuestion = 0;

let date = localStorage.getItem("DateTime")

const dateObject1 = new Date(date);
const year = dateObject1.getFullYear();
let month = dateObject1.getMonth() + 1; 
let day = dateObject1.getDate();
let hour = dateObject1.getHours();
let minutes = dateObject1.getMinutes();

let StartingTime = document.querySelector(".StartingTime")
let startHour = ((hour % 12) || 12)
StartingTime.innerHTML = `${startHour+":"+ minutes}`
let dateObject = new Date();
const todayY = dateObject.getFullYear();
const todayM = dateObject.getMonth() + 1;
const todayD = dateObject.getDate();

let newHour = 0
let newMinutes = 0;
let notCompleted;

const startTime = new Date(year, month, day, hour, minutes, 0, 0); 
const currentTime = new Date();
currentTime.setFullYear(year, month, day);  
currentTime.setSeconds(0, 0);

//Main of the exam

function Starting(){
    if(day == todayD && month == todayM && year == todayY){
        
        if(currentTime >= startTime) //check at the midnight
        {
            let addH = duration / 60
            addH = addH.toFixed(0)
            newHour = ((Number(hour) + Number(addH)) % 12 || 12)
            newHour = newHour % 12 
            let addM = duration % 60
            newMinutes = minutes + addM

            if(newMinutes >= 60){
                let addHour = newMinutes / 60
                addHour = addHour.toFixed(0)
                console.log(addHour)
                console.log(newHour) 
                newHour = ((Number(newHour) + Number(addHour)) % 12 || 12)
                console.log(newHour) 
                newMinutes = newMinutes % 60
            }
            let nowH = ((dateObject.getHours() % 12 )|| 12)
            nowH = nowH % 12
            let nowM = dateObject.getMinutes()
    
            if((nowH < newHour) || (nowH == newHour && nowM <= newMinutes)){
                expiredCont.style.display = "none"
                queAnsCont.style.display = "flex"
                livecont.style.display = "flex"

                startDynamicCountdown();
                displayQuestions();
                setTimeout(notCompletedQuestion,2000)
            }
            else{
                expiredCont.style.display = "flex"
                queAnsCont.style.display = "none"
                expiredCont.innerHTML = "Exam Finished!."
                get(ref(db,`${randomID}/users/${username}`))
                .then((snapshot) => {
                    const data = snapshot.val();
                    let list =  Object.keys(data)
                    if(list.includes("completed")){
                        expiredCont.style.display = "none"
                        resultcont.style.display = "block"
                        result()
                    }
                }).catch((err) => {
                        console.error(err);
                    });
            }
        }
        else{
            expiredCont.style.display = "flex"
        expiredCont.innerHTML = "Exam not yet started"
        }
    }
    else{
        expiredCont.style.display = "flex"
        expiredCont.innerHTML = "Exam expired"
    }
}

//Timer
function startDynamicCountdown() {

    let currentSeconds = new Date().getSeconds();
    let remainingSeconds = 60 - currentSeconds;
    displayTime(remainingSeconds);
  
    intervalId = setInterval(() => {
    remainingSeconds--;
    displayTime(remainingSeconds);

    let nowH = ((new Date().getHours() % 12 )|| 12)
    nowH = nowH % 12
    let nowM = new Date().getMinutes()

      if (remainingSeconds <= 0) {
        currentSeconds = new Date().getSeconds();
        remainingSeconds = 60 - currentSeconds;
        
        if((nowH < newHour) || (nowH == newHour && nowM <= newMinutes)){
            displayQuestions();
            setTimeout(notCompletedQuestion,2000)
        }
        else{
            clearInterval(intervalId)
            livecont.style.display = "none"
            expiredCont.style.display = "flex"
            queAnsCont.style.display = "none"
            expiredCont.innerHTML = "Exam Finished!."
            alert("Waiting for your result..")
            result()
        }

      }
    }, 1000);
  }
  
  function displayTime(seconds) {
    timeleft.innerHTML = `${seconds} S`
  }

  //DisplayQuestions
  function displayQuestions(){
    let randomIndex = 0;
    
    get(ref(db,`${randomID}/users/${username}`))
    .then((snapshot) => {
    const data = snapshot.val();
    if(data != null){
        notCompleted = data.notCompleted
        randomIndex = Math.floor(Math.random()*(notCompleted.length))
        randomQuestion = notCompleted[randomIndex]
        fetchdata()
    }
    else{
        console.log("Invalid ID")
    }
  })
  .catch((err) => {
        console.error(err);
    });
    
    async function fetchdata(){
        try{
            get(ref(db,`${randomID}/Questions/${randomQuestion}`))
            .then((snapshot) => {
                const data = snapshot.val();
                
                if(data != null){
                    questionCont.innerHTML = data.Question
                    OptionA.innerHTML = data.Options.a
                    OptionB.innerHTML = data.Options.b
                    OptionC.innerHTML = data.Options.c
                    OptionD.innerHTML = data.Options.d
                }
                else{
                    console.log("Invalid ID")
                }
            })
            .catch((err) => {
                console.error(err);
            });
        }
        catch(err) {
            console.error(err)
        }
    }
    
}

//NotcompletedQuestion 
async function notCompletedQuestion(){
    try{
        let array;
        get(ref(db,`${randomID}/users/${username}`))
        .then((snapshot) => {
            const data = snapshot.val();
            array = data.notCompleted;

            if(array != undefined){
                let indexToRemove = array.indexOf(randomQuestion);
                if (indexToRemove !== -1) {
                array.splice(indexToRemove, 1);
                }
                
                update(ref(db, `${randomID}/users/${username}`), {"notCompleted": array}).then(() => {
                }).catch((error) => {
                    alert(error);
                });
    
            }
            
        }).catch((err) => {
                console.error(err);
            });
    }
    catch(err){
        console.error(err)
    }
}

//Save Button 

let savebutton = document.querySelector(".savebutton")
 savebutton.addEventListener("click", () =>{
    let selectedValue = null;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.id;
      break;
    }
  }

  let list;
  get(ref(db,`${randomID}/users/${username}`))
        .then((snapshot) => {
            const data = snapshot.val();
            list =  Object.keys(data)
            completedUpdate();
        }).catch((err) => {
                console.error(err);
            });
    notCompletedQuestion()

    let values= {
        "completed":{    
        }
    }
    values.completed[randomQuestion] = {
        "option": selectedValue
    }

    //completed questions
   async  function completedUpdate(){
        if(list.includes("completed")){
            set(ref(db, `${randomID}/users/${username}/completed/${randomQuestion}`),{"option": selectedValue}).then(() => {
            }).catch((error) => {
                alert(error);
            });
        }
        else{
            update(ref(db, `${randomID}/users/${username}`),values).then(() => {
            }).catch((error) => {
                alert(error);
            });
        }
    } 
    alert("Saved successfully!")
 })

 //Result 

 function result(){
    let totalDb;
        get(ref(db,`${randomID}`))
        .then((snapshot) => {
        const data = snapshot.val();
        if(data != null){
            totalDb = data 
            mark(totalDb);
        }
        else{
            console.log("Invalid ID")
        }
        })
        .catch((err) => {
            console.error(err);
        });

        function mark(object){
            
            let questions = object.Questions
            let answers = object.users[username].completed
            let questionKeys = Object.keys(questions)
            let answerKeys = Object.keys(answers)
            let count = 0
            for(let i=0; i< questionKeys.length; i++){
                if(answerKeys.includes(questionKeys[i])){
                    let index = answerKeys.indexOf(questionKeys[i])
                    if(answers[answerKeys[index]].option == questions[answerKeys[index]].Answer){
                        count++
                        displayResult("correctAns",index)
                    }
                    else{
                        displayResult(null,index)
                    }
                }
                else{
                    displayResult("NotSelected",i)
                }
            }
            function displayResult(value,i){
                let qcont = document.createElement("div")
                qcont.className = "qCont"
                let ques = document.createElement("div")
                ques.className = "ques"
                let correctans = document.createElement("div")
                correctans.className = "correctans"
                let wrongans = document.createElement("div")
                wrongans.className = "wrongans"
                ques.innerHTML = questions[answerKeys[i]].Question
                    correctans.innerHTML = questions[answerKeys[i]].Options[questions[answerKeys[i]].Answer]
                    wrongans.innerHTML = questions[answerKeys[i]].Options[answers[answerKeys[i]].option]
                if(value == "NotSelected"){
                    ques.innerHTML = questions[questionKeys[i]].Question
                    correctans.innerHTML = questions[questionKeys[i]].Options[questions[questionKeys[i]].Answer]
                    wrongans.innerHTML = "Not Selected"
                }
                if(value == "correctAns"){
                    wrongans.style.backgroundColor = "green"
                }
                qcont.appendChild(ques)
                qcont.appendChild(correctans)
                qcont.appendChild(wrongans)
                resultcont.appendChild(qcont)
            }
        }
 }