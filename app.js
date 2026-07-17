const API = "https://script.google.com/macros/s/AKfycbzYyagnuYNN8LpT2qrh_eeH6idxC0geYNYbFzt3xl-gTp9bp2pLtxt-tigoSm_CRjgX/exec";

let currentCategory = "";
let currentStage = 0;

let words = [];
let currentIndex = 0;

const pageCategories = document.getElementById("pageCategories");
const pageStages = document.getElementById("pageStages");
const pageStudy = document.getElementById("pageStudy");
const pageFinish = document.getElementById("pageFinish");

const categoriesDiv = document.getElementById("categories");
const stagesDiv = document.getElementById("stages");

const categoryName = document.getElementById("categoryName");
const studyTitle = document.getElementById("studyTitle");

const word = document.getElementById("word");

const txtAnswer = document.getElementById("txtAnswer");

const btnCheck = document.getElementById("btnCheck");

const result = document.getElementById("result");

const correctWord = document.getElementById("correctWord");

const reviewButtons = document.getElementById("reviewButtons");

const progress = document.getElementById("progress");

const btnKnow = document.getElementById("btnKnow");
const btnDontKnow = document.getElementById("btnDontKnow");
const btnMaster = document.getElementById("btnMaster");

const btnBackCategories = document.getElementById("btnBackCategories");
const btnBackStages = document.getElementById("btnBackStages");
const btnFinishBack = document.getElementById("btnFinishBack");



const pageAddWord = document.getElementById("pageAddWord");

const menuPractice = document.getElementById("menuPractice");
const menuAddWord = document.getElementById("menuAddWord");

const cmbCategory = document.getElementById("cmbCategory");
const txtWord = document.getElementById("txtWord");

const btnSaveWord = document.getElementById("btnSaveWord");

const saveResult = document.getElementById("saveResult");


function hidePages(){

    pageCategories.style.display="none";
    pageStages.style.display="none";
    pageStudy.style.display="none";
    pageFinish.style.display="none";
pageAddWord.style.display="none";

}

async function loadCategoryCombo(){

    cmbCategory.innerHTML="";

    const list = await get("?action=categories");

    list.forEach(c=>{

        cmbCategory.innerHTML +=
        `<option value="${c.category}">
            ${c.category}
        </option>`;

    });

}


function showAddWordPage(){

    hidePages();

    pageAddWord.style.display="block";

}

function showCategoriesPage(){

    hidePages();

    pageCategories.style.display="block";

}



function showStagesPage(){

    hidePages();

    pageStages.style.display="block";

}



function showStudyPage(){

    hidePages();

    pageStudy.style.display="block";

}



function showFinishPage(){

    hidePages();

    pageFinish.style.display="block";

}



async function get(url){

    const response = await fetch(API + url);

    return await response.json();

}



async function loadCategories(){

    showCategoriesPage();

    categoriesDiv.innerHTML="";

    const categories = await get("?action=categories");

    categories.forEach(c=>{

        categoriesDiv.innerHTML += `

        <div class="cardItem"

             onclick="openCategory('${c.category}')">

            ${c.category}

        </div>

        `;

    });

}



async function openCategory(category){

    currentCategory = category;

    categoryName.innerHTML = category;

    showStagesPage();

    const stages = await get(

        "?action=stages&category="+
        encodeURIComponent(category)

    );

let total = 0;
let ready = 0;
let source = 0;

stages.forEach(s => {

    total += s.total;
    ready += s.ready;

    if(s.stage == 0)
        source = s.total;

});

document.getElementById("totalWords").innerHTML = total;

document.getElementById("readyWords").innerHTML = ready;

let progress = total == 0
    ? 0
    : Math.round(((total - source) / total) * 100);

document.getElementById("progressPercent").innerHTML =
    progress + "%";

    stagesDiv.innerHTML="";

    stages.forEach(s=>{

        let html = `

        <div class="stageCard">

            <div class="stageTitle">

                ${s.title}

            </div>

<div class="stageCount">

    <div>

        Ready : <b>${s.ready}</b>

    </div>

    <div style="margin-top:6px;">

        Total : <b>${s.total}</b>

    </div>

</div>

        `;

        if(s.stage==0){

            html += `

            <button

                class="addButton"

                onclick="event.stopPropagation();move30();">

                Add 30 Words

            </button>

            `;

        }

        else{

            html += `

            <button

                class="addButton"

                onclick="studyStage(${s.stage})">

                Study

            </button>

            `;

        }

        html += "</div>";

        stagesDiv.innerHTML += html;

    });

}
async function move30(){

    await get(

        "?action=move30&category="+
        encodeURIComponent(currentCategory)

    );

    openCategory(currentCategory);

}



async function studyStage(stage){

    currentStage = stage;

    words = await get(

        "?action=words&category="+
        encodeURIComponent(currentCategory)+
        "&stage="+stage

    );

    currentIndex = 0;

    showStudyPage();

    showWord();

}



function showWord(){

    if(currentIndex >= words.length){

        showFinishPage();

        return;

    }

    const w = words[currentIndex];

    studyTitle.innerHTML = currentCategory;

    progress.innerHTML =
        (currentIndex+1)+" / "+words.length;

    word.innerHTML = w.word;

    txtAnswer.value="";

    txtAnswer.focus();

    result.innerHTML="";

    correctWord.innerHTML="";

    reviewButtons.style.display="none";

}



function checkAnswer(){

    const answer =
        txtAnswer.value.trim().toLowerCase();

    const correct =
        words[currentIndex].word.trim().toLowerCase();

    if(answer==correct){

        result.innerHTML="✅ Correct";

        result.className="result correct";

        correctWord.innerHTML="";

    }

    else{

        result.innerHTML="❌ Incorrect";

        result.className="result incorrect";

        correctWord.innerHTML=
            "Correct Answer : <b>"+
            words[currentIndex].word+
            "</b>";

    }

    reviewButtons.style.display="grid";

}



btnCheck.onclick=function(){

    checkAnswer();

};



txtAnswer.addEventListener(

    "keydown",

    function(e){

        if(e.key=="Enter")

            checkAnswer();

    }

);
async function updateWord(type){

    const w = words[currentIndex];

    await get(

        "?action=update" +

        "&category=" + encodeURIComponent(currentCategory) +

        "&row=" + w.row +

        "&type=" + type

    );

    currentIndex++;

    showWord();

}



btnKnow.onclick = function(){

    updateWord("know");

};



btnDontKnow.onclick = function(){

    updateWord("dontknow");

};



btnMaster.onclick = function(){

    updateWord("master");

};



btnBackCategories.onclick = function(){

    loadCategories();

};



btnBackStages.onclick = function(){

    openCategory(currentCategory);

};



btnFinishBack.onclick = function(){

    openCategory(currentCategory);

};



document.addEventListener("keydown",function(e){

    if(reviewButtons.style.display!="grid")
        return;

    if(e.key=="1")
        updateWord("know");

    if(e.key=="2")
        updateWord("dontknow");

    if(e.key=="3")
        updateWord("master");

});

menuPractice.onclick=function(){

    menuPractice.classList.add("active");
    menuAddWord.classList.remove("active");

    loadCategories();

};

menuAddWord.onclick=async function(){

    menuAddWord.classList.add("active");
    menuPractice.classList.remove("active");

    showAddWordPage();

    await loadCategoryCombo();

    txtWord.focus();

};


btnSaveWord.onclick=async function(){

    const category=cmbCategory.value;

    const word = txtWord.value.trim().toLowerCase();

    if(word=="")
        return;

    await get(

        "?action=saveWord"+

        "&category="+
        encodeURIComponent(category)+

        "&word="+
        encodeURIComponent(word)

    );

    saveResult.innerHTML=
        "✅ Saved successfully.";

    txtWord.value="";

    txtWord.focus();

};

loadCategories();