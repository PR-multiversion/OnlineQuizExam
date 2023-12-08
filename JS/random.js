import db from './CommonFirebase.js'
import { ref, set,get, update} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
let generateButton = document.querySelector(".generate-button")
let joinButton = document.querySelector(".join-button")
let generate = document.querySelector(".generate")
let randomdiv = document.querySelector(".random")
let linkcont = document.querySelector(".link-cont")
let gobutton = document.querySelector(".go-button")
let genCont = document.querySelector(".gen-cont")
let joinCont = document.querySelector(".join-cont")
let joinBtn = document.querySelector(".j-btn")

generateButton.addEventListener("click", ()=>{
    joinCont.style.display = "none"
    genCont.style.display = "flex"
})
joinButton.addEventListener("click", ()=>{
    joinCont.style.display = "flex"
    genCont.style.display = "none"
})
generate.addEventListener("click", ()=>{
    linkcont.style.display = "flex"

    let UUID = Math.floor(Math.random() *1000000)
    let randomID = UUID;
    randomdiv.innerHTML = randomID

    console.log(randomID)
    localStorage.setItem("UUID",randomID)
})


gobutton.addEventListener("click",()=>{   
    window.location.href = '/OnlineQuizExam/HTML/home.html'
})

joinBtn.addEventListener("click",()=>{

    let username = document.querySelector(".username").value
    let Uid = document.querySelector(".UID").value
    if(username == "" || Uid == ""){
        alert("Please enter the correct value")
    }
    localStorage.setItem("username",username)
    localStorage.setItem("UUID",Uid)

    let arr;
let values = {
    "users":{
    }
}
get(ref(db,`${Number(Uid)}/Questions`))
    .then((snapshot) => {
    const data = snapshot.val();
    if(data != null){
        //console.log(Object.keys(data))
        arr = Object.keys(data)
        values.users[username] = {
            notCompleted: arr
        };
    }
    else{
        console.log("Invalid ID")
    }
  })
  .catch((err) => {
        console.error(err);
    });

console.log(values)
get(ref(db,`${Uid}`))
  .then((snapshot) => {
    const data = snapshot.val();
    localStorage.setItem("DateTime",data.userDT)
    let list = Object.keys(data)
    if(list.includes("users")){
        set(ref(db, `${Number(Uid)}/users/${username}`),{"notCompleted": arr}).then(() => {
            console.log("Update usernames..")
            nextPage()
          }).catch((error) => {
            alert(error);
          });
    }
    else{
        update(ref(db, `${Number(Uid)}`), values).then(() => {
            console.log("Username added..");
            nextPage()
        }).catch((error) => {
            alert(error);
        });
    }
  })
  .catch((err) => {
    console.error(err);
});
    function nextPage(){
        window.location.href = '/OnlineQuizExam/HTML/Exam.html'
    }
    setTimeout(nextPage,2000) 
})
