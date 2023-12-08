import db from './CommonFirebase.js'
import {ref, set,get, update} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

let randomID = localStorage.getItem("UUID");

let question = document.getElementById("qn")
let option1 = document.getElementById("a")
let option2 = document.getElementById("b")
let option3 = document.getElementById("c")
let option4 = document.getElementById("d")
let answer = document.getElementById("ans")

let addButton = document.querySelector(".add-button")

addButton.addEventListener("click", ()=>{
    if(question.value == ""  || option1.value == "" || option2.value == "" || option3.value == "" || option4.value == ""){
        alert("Please enter the value in all field")
    }
    else{
        console.log("Random"+randomID)
        get(ref(db, `${randomID}/Questions`))
        .then((snapshot) => {
            const data = snapshot.val();
            let id = 1;

            if(data != null){
                console.log("Not NULL "+Object.keys(data).length); 
                id = Object.keys(data).length +1
            }
            let values = {
                "Question": question.value,
                "Options":{
                    "a": option1.value,
                    "b": option2.value,
                    "c": option3.value,
                    "d": option4.value
                },
                "Answer": answer.value
            }
            set(ref(db, `${randomID}/Questions/${id}`),values).then(() => {
                alert(`${id} question with answer added`);
              }).catch((error) => {
                alert(error);
              });

        })
        .catch((err) => {
            console.error(err);
        });
    }
})

let submitbutton = document.querySelector(".submit-button ")
let questioncont = document.querySelector(".question-cont")
let timingcont = document.querySelector(".timing-cont")

let savebutton = document.querySelector(".save-button")
let durationValue = document.querySelector(".durationValue")
let dateInp = document.getElementById("timer")


submitbutton.addEventListener("click", () =>{
    get(ref(db,`${randomID}/Questions`))
  .then((snapshot) => {
    const data = snapshot.val();
    if(data != null){
        questioncont.style.display = "none"
        timingcont.style.display = "flex"
        Timeduration()
    }
    else{
        alert("Add enough of questions with answer to submit!")
    }
  })
  .catch((err) => {
    console.error(err);
});
})

savebutton.addEventListener("click", () =>{
    console.log(dateInp.value)
    let dateObject = new Date(dateInp.value);
    let values = {"userDT":`${dateObject}`}
    localStorage.setItem("DateTime", dateObject)
    get(ref(db,`${randomID}`))
  .then((snapshot) => {
    const data = snapshot.val();
    update(ref(db, `${randomID}`), values).then(() => {
    questioncont.style.display = "block"
    timingcont.style.display = "none"
    }).catch((error) => {
        alert(error);
    });
  })
  .catch((err) => {
    console.error(err);
});
})

function Timeduration(){
    get(ref(db,`${randomID}/Questions`))
  .then((snapshot) => {
    const data = snapshot.val();
    durationValue.innerHTML = `${data.length-1} Minutes`
  })
  .catch((err) => {
    console.error(err);
});
}

let leftarrowbtn = document.getElementById("leftarrow")
    leftarrowbtn.addEventListener("click",()=>{
        questioncont.style.display = "block"
        timingcont.style.display = "none"
})

let totalquestioncont = document.querySelector(".total-question")
let questionbtn = document.querySelector(".questionbtn")
questionbtn.addEventListener("click",()=>{
   totalquestioncont.style.display = "block"
   questioncont.style.display = "none"
    let object;
    get(ref(db,`${randomID}/Questions`))
  .then((snapshot) => {
    const data = snapshot.val();
    if(data!=null){
        object = data
        allQuestions(object)
    }
    else{
        totalquestioncont.innerHTML = "No questions"
    }
  })
  .catch((err) => {
    console.error(err);
});
function allQuestions(data){
    let length = Object.keys(object).length
    for(let i=1;i<=length;i++){
        let questions = document.createElement("div")
        questions.className = "questions"
        questions.id = i

        let question = document.createElement("div")
        question.className = "questions"
        let questionView = document.createElement("div")
        questionView.className = "question-view"
        questionView.innerHTML = data[i].Question

        let optionView = document.createElement("div")
        optionView.className = "option-view"

        let div1 = document.createElement("div")
        let opt1 = document.createElement("span")
        opt1.className = "opt"
        opt1.innerHTML = "A"
        let optans1 = document.createElement("span")
        optans1.className = "opt-ans"
        optans1.innerHTML = data[i].Options.a
        div1.appendChild(opt1)
        div1.appendChild(optans1)

        let div2 = document.createElement("div")
        let opt2 = document.createElement("span")
        opt2.className = "opt"
        opt2.innerHTML = "B"
        let optans2 = document.createElement("span")
        optans2.className = "opt-ans"
        optans2.innerHTML = data[i].Options.b
        div2.appendChild(opt2)
        div2.appendChild(optans2)

        let div3 = document.createElement("div")
        let opt3 = document.createElement("span")
        opt3.className = "opt"
        opt3.innerHTML = "C"
        let optans3 = document.createElement("span")
        optans3.className = "opt-ans"
        optans3.innerHTML = data[i].Options.c
        div3.appendChild(opt3)
        div3.appendChild(optans3)

        let div4 = document.createElement("div")
        let opt4 = document.createElement("span")
        opt4.className = "opt"
        opt4.innerHTML = "D"
        let optans4 = document.createElement("span")
        optans4.className = "opt-ans"
        optans4.innerHTML = data[i].Options.d
        div4.appendChild(opt4)
        div4.appendChild(optans4)

        optionView.append(div1, div2, div3, div4)

        let answerView = document.createElement("div")
        answerView.className = "answer-view"
        let answer = document.createElement("div")
        answer.className = "answer"
        answer.innerHTML = data[i].Options[data[i].Answer]
        answerView.appendChild(answer)

        questions.append(questionView, optionView, answerView)
        totalquestioncont.appendChild(questions)
    }
}
})
let createbtn = document.querySelector(".create")
createbtn.addEventListener("click",()=>{
    totalquestioncont.style.display = "none"
    questioncont.style.display = "block"
})