const API = "https://script.google.com/macros/s/AKfycbzYyagnuYNN8LpT2qrh_eeH6idxC0geYNYbFzt3xl-gTp9bp2pLtxt-tigoSm_CRjgX/exec";

console.log("APP JS LOADED");

//======================================================
// Global State
//======================================================

let streakCache = null;
let heatmapCache = null;


let statisticsCache = null;

let statisticsChart = null;


let categoriesCache = null;


let currentCategory = "";

let categoryData = null;

let currentStage = 0;

let currentWords = [];

let currentIndex = 0;

// لیست تغییراتی که بعداً یکجا ذخیره می‌شوند
let changedRows = [];

// لغات هر Stage داخل حافظه
let stageWords = {};


//======================================================
// Pages
//======================================================

let selectedStatisticsMonth = null;

const pageCategories =
document.getElementById("pageCategories");

const pageStages =
document.getElementById("pageStages");

const pageStudy =
document.getElementById("pageStudy");

const pageFinish =
document.getElementById("pageFinish");


const menuPractice =
document.getElementById("menuPractice");

const menuAddWord =
document.getElementById("menuAddWord");

const pageAddWord =
document.getElementById("pageAddWord");

const cmbCategory =
document.getElementById("cmbCategory");



const txtNewWord =
document.getElementById("txtNewWord");

const btnSaveWord =
document.getElementById("btnSaveWord");

const saveMessage =
document.getElementById("saveMessage");



const btnCollapse =
document.getElementById("btnCollapse");



const pageStatistics =
document.getElementById("pageStatistics");

const pageHeatmap =
document.getElementById("pageHeatmap");


const menuHeatmap =
document.getElementById("menuHeatmap");





//======================================================
// Elements
//======================================================

const categoriesDiv =
document.getElementById("categories");

const stagesDiv =
document.getElementById("stages");

const categoryName =
document.getElementById("categoryName");

const studyTitle =
document.getElementById("studyTitle");

const progress =
document.getElementById("progress");

const word =
document.getElementById("word");

const txtAnswer =
document.getElementById("txtAnswer");

const btnCheck =
document.getElementById("btnCheck");

const result =
document.getElementById("result");

const correctWord =
document.getElementById("correctWord");

const reviewButtons =
document.getElementById("reviewButtons");

const btnKnow =
document.getElementById("btnKnow");

const btnDontKnow =
document.getElementById("btnDontKnow");

const btnMaster =
document.getElementById("btnMaster");

const btnBackCategories =
document.getElementById("btnBackCategories");

const btnBackStages =
document.getElementById("btnBackStages");

const btnFinishBack =
document.getElementById("btnFinishBack");


const cmbStatisticsMonth =
document.getElementById("cmbStatisticsMonth");


const loginPage =
document.getElementById("loginPage");

const appContainer =
document.getElementById("appContainer");

const txtUsername =
document.getElementById("txtUsername");

const txtPassword =
document.getElementById("txtPassword");

const btnLogin =
document.getElementById("btnLogin");

const loginMessage =
document.getElementById("loginMessage");



const stageColors = [

    "stage-gray",     // Source
    "stage-green",    // Every Day
    "stage-blue",
    "stage-orange",
    "stage-purple",
    "stage-pink",
    "stage-cyan"

];








// ==================== sketlon
function showCategoriesSkeleton(){

    categories.style.display = "none";

    categoriesSkeleton.style.display = "grid";

    categoriesSkeleton.innerHTML = "";

    for(let i=0;i<8;i++){

        categoriesSkeleton.innerHTML += `

            <div class="skeletonCard">

                <div class="skeletonLine large"></div>

                <div class="skeletonLine small"></div>

            </div>

        `;

    }

}

function hideCategoriesSkeleton(){

    categoriesSkeleton.style.display="none";

    categories.style.display="grid";

}



//

function showStagesSkeleton(){

    stagesSkeleton.style.display = "grid";

    stages.style.display = "none";

}

function hideStagesSkeleton(){

    stagesSkeleton.style.display = "none";

    stages.style.display = "grid";

}

function showStreakSkeleton(){

    streakValue.innerHTML = `
        <div class="skeleton streakSkeleton"></div>
    `;

}


function hideStreakSkeleton(){

    streakSkeleton.style.display="none";

    streakCard.style.display="flex";

}

//






//======================================================
// Helpers
//======================================================

function hidePages(){

    pageCategories.style.display = "none";
    pageStages.style.display = "none";
    pageStudy.style.display = "none";
    pageFinish.style.display = "none";
    if(pageAddWord)
        pageAddWord.style.display = "none";
    if(pageStatistics)
        pageStatistics.style.display="none";
    if(pageHeatmap)
        pageHeatmap.style.display="none";

}

function showCategoriesPage(){

    hidePages();

    pageCategories.style.display = "block";

}

function showStagesPage(){

    hidePages();

    pageStages.style.display = "block";

}

function showStudyPage(){

    hidePages();

    pageStudy.style.display = "block";

}

function showFinishPage(){

    hidePages();

    pageFinish.style.display = "block";

}


function showAddWordPage(){

    hidePages();

    pageAddWord.style.display = "block";

}


function showStatisticsPage(){

    hidePages();

    pageStatistics.style.display="block";

    loadStatistics();

}

//======================================================
// API
//======================================================

async function get(url){
    //showLoading();

    try{

    const response =
    await fetch(API + url);

    return await response.json();

    }
    finally{

       // hideLoading();

    }

}





async function post(data){

    showLoading();

    try{

    const form = new URLSearchParams();

    Object.keys(data).forEach(key=>{

        form.append(key,data[key]);

    });

    const response = await fetch(API,{

        method:"POST",

        body:form

    });

    return await response.json();


    }
    finally{

        hideLoading();

    }

}


//======================================================
// Categories
//======================================================

async function loadCategories(){
    
    showCategoriesPage();
    
    showCategoriesSkeleton();
    showStreakSkeleton();
    

    categoriesDiv.innerHTML = "";

    cmbCategory.innerHTML = "";

    // اگر قبلاً دریافت نشده، از سرور بگیر
    if(categoriesCache == null){

        categoriesCache = await get("?action=categories");

    }

    // از اینجا به بعد فقط از کش استفاده کن

    
    

    categoriesCache.forEach(c=>{

        // کارت‌های Practice

        categoriesDiv.innerHTML += `

        <div class="cardItem"
             onclick="openCategory('${c.category}')">

            ${c.category}

        </div>

        `;

        // ComboBox مربوط به Add Word

        cmbCategory.innerHTML += `

            <option value="${c.category}">
                ${c.category}
            </option>

        `;

    });


    loadStreak();
    hideCategoriesSkeleton();
    hideStreakSkeleton();

}



//======================================================
// Open Category
//======================================================

async function openCategory(category){

    currentCategory = category;

    categoryName.innerHTML = category;

    showStagesPage();
    showStagesSkeleton();
    showSummarySkeleton();

    const response = await get(
        

        "?action=categoryData&category=" +
        encodeURIComponent(category)

    );
    console.log(response);

    if(!response.success){

        alert("Error loading category");

        return;

    }

    categoryData = response;

    stageWords = {};

    for(let i=0;i<=6;i++){

        stageWords[i] = [];

    }
hideStagesSkeleton();
hideSummarySkeleton();
    categoryData.words.forEach(w=>{

        if(!stageWords[w.stage])

            stageWords[w.stage] = [];

        stageWords[w.stage].push(w);

    });

    renderStages();

}



function showSummarySkeleton(){

    summarySkeleton.style.display = "grid";

    summaryCard.style.display = "none";

    

}


function hideSummarySkeleton(){

    summarySkeleton.style.display = "none";

    summaryCard.style.display = "grid";

}
//======================================================
// Render Stages
//======================================================


function renderStages(){

    stagesDiv.innerHTML = "";

    let total = 0;
    let ready = 0;
    let source = 0;

    categoryData.stages.forEach(s=>{

        total += s.total;
        ready += s.ready;

        if(s.stage == 0)
            source = s.total;

    });

    document.getElementById("totalWords").innerHTML = total;
    document.getElementById("readyWords").innerHTML = ready;

    document.getElementById("progressPercent").innerHTML =
        total==0
        ? "0%"
        : Math.round(((total-source)/total)*100)+"%";


    const colors=[
        "stage-source",
        "stage-green",
        "stage-blue",
        "stage-purple",
        "stage-pink",
        "stage-orange",
        "stage-gold"
    ];


    const subtitles=[
        "New words waiting",
        "Review every day",
        "Review every 2 days",
        "Review every 8 days",
        "Review every 16 days",
        "Review every 32 days",
        "Review every 64 days"
    ];


    categoryData.stages.forEach(s=>{

        const percent =
            s.total==0
            ? 0
            : Math.round((s.ready/s.total)*100);

        let button="";

        if(s.stage==0){

            button=`

                <button
                    class="stageButton ${colors[s.stage]}"
                    onclick="move30()">

                    + Add 30 Words

                </button>

            `;

        }
        else{

            button=`

                <button
                    class="stageButton ${colors[s.stage]}"
                    onclick="studyStage(${s.stage})">

                    ▶ Start Study

                </button>

            `;

        }

const colorClass = stageColors[s.stage];

const disabledClass =
s.ready == 0
    ? "stageDisabled"
    : "";

stagesDiv.innerHTML += `

<div class="stageCard ${colorClass} ${disabledClass}">

            <div class="stageBadge">

                ${s.stage}

            </div>

            <div class="stageContent">

                <div class="stageHeader">

                    <div>

                        <div class="stageTitle">

                            ${s.title}

                        </div>

                        <div class="stageSubtitle">

                            ${subtitles[s.stage]}

                        </div>

                    </div>

                    <div class="stagePercent">

                        ${percent}%

                    </div>

                </div>


                <div class="progressBar">

                    <div
                        class="progressFill"
                        style="width:${percent}%">

                    </div>

                </div>


                <div class="stageFooter">

                    <div class="stageInfo">

                        🔥 Ready

                        <b>${s.ready}</b>

                    </div>

                    <div class="stageInfo">

                        📚 Total

                        <b>${s.total}</b>

                    </div>

                    ${button}

                </div>

            </div>

        </div>

        `;

    });

}



//======================================================
// Move 30
//======================================================

async function move30(){

    const res = await get(

        "?action=move30&category=" +

        encodeURIComponent(currentCategory)

    );

    if(!res.success){

        alert("Move failed");

        return;

    }

    await openCategory(currentCategory);

}


//======================================================
// Study Stage
//======================================================

function studyStage(stage){

currentStage = stage;

document.getElementById("studyPath").innerHTML =
    currentCategory + " › " +
    categoryData.stages[stage].title;




    currentStage = stage;

    currentWords =

        stageWords[stage]

        .filter(w => w.ready);

    currentIndex = 0;

    showStudyPage();

    showWord();

}




//======================================================
// Save New Word
//======================================================

async function saveWord(){

    const front = txtFront.value.trim();
    const back = txtBack.value.trim();

    if(front=="" || back==""){

        alert("Please enter both Front and Back.");

        return;

    }

    const response = await get(

        "?action=saveWord" +

        "&category=" +
        encodeURIComponent(cmbCategory.value) +

        "&front=" +
        encodeURIComponent(front) +

        "&back=" +
        encodeURIComponent(back)

    );

    if(response.success){

        saveMessage.innerHTML = "✅ Saved.";

        txtFront.value = "";
        txtBack.value = "";

        txtFront.focus();

    }
    else{

        saveMessage.innerHTML = "❌ " + response.message;

    }

}

//======================================================
// Show Word
//======================================================

function showWord(){
    wordCard.classList.remove(
    "cardCorrect",
    "cardIncorrect"
);

    if(currentIndex >= currentWords.length){

		finishStudy();

        return;

    }

    const w = currentWords[currentIndex];

    studyTitle.innerHTML = currentCategory;

    progress.innerHTML =
        (currentIndex + 1) +
        " / " +
        currentWords.length;

    word.innerHTML = w.Front;

    txtAnswer.value = "";

    txtAnswer.focus();

    result.innerHTML = "";

    result.className = "result";

    correctWord.innerHTML = "";

    reviewButtons.style.display = "none";

}



//======================================================
// Check Answer
//======================================================

function checkAnswer(){

    const answer =
        txtAnswer.value
            .trim()
            .toLowerCase();

    const correct =
        currentWords[currentIndex]
            .Back
            .trim()
            .toLowerCase();

    if(answer == correct){

        result.innerHTML = "✅ Correct";

        result.className =
            "result correct";

        correctWord.innerHTML = "";


        wordCard.classList.remove("cardIncorrect");
        wordCard.classList.add("cardCorrect");

    }
    else{

    result.innerHTML = "❌ Incorrect";

    result.className = "result incorrect";

    compareResult.innerHTML =

    buildCompare(

        answer,

        currentWords[currentIndex].Back

    );

    wordCard.classList.remove("cardCorrect");
    wordCard.classList.add("cardIncorrect");

}
    reviewButtons.style.display = "grid";



}



//======================================================
// Update Word
//======================================================

function updateWord(type){

    const w =
        currentWords[currentIndex];

    const oldStage =
        Number(w.stage);

    let stage = oldStage;

    switch(type){

        case "know":

            stage++;

            break;

        case "dontknow":

            stage = 1;

            break;

        case "master":

            stage = 6;

            break;

    }

    if(stage > 6)

        stage = 6;

    if(stage < 0)

        stage = 0;


    // تغییر داخل حافظه

    w.stage = stage;

    w.ready = false;


    // ثبت برای ذخیره گروهی

    changedRows.push({

        row: w.row,

        stage: stage

    });


    // حذف از Stage فعلی

    stageWords[oldStage] =
        stageWords[oldStage]
            .filter(x => x.row != w.row);


    // اضافه به Stage جدید

    stageWords[stage].push(w);


    // بروزرسانی آمار

    categoryData.stages[oldStage].total--;

    categoryData.stages[stage].total++;

    categoryData.stages[oldStage].ready--;

    renderStages();


    currentIndex++;

    showWord();

}



//======================================================
// Batch Save
//======================================================

async function saveChanges(){

    if(changedRows.length == 0)
        return;

    const response = await post({

        action:"saveChanges",

        category:currentCategory,

        items:JSON.stringify(changedRows)

    });

    if(response.success){

        changedRows = [];

    }
    else{

        alert("Error saving changes.");

    }

}



//======================================================
// Back Buttons
//======================================================

function backToCategories(){

    loadCategories();

}


async function backToStages(){

    await saveChanges();

    await openCategory(currentCategory);

}



//======================================================
// Finish
//======================================================

async function finishStudy(){

    await saveChanges();

    await openCategory(currentCategory);

}



//======================================================
// Save Current Session
//======================================================

function saveSession(){
    console.log({
    category: currentCategory,
    stage: currentStage,
    index: currentIndex
});

    if(!currentCategory || currentCategory.trim() == "")
        return;

    sessionStorage.setItem(

        "studySession",

        JSON.stringify({

            category:currentCategory,

            stage:currentStage,

            index:currentIndex,

            changedRows:changedRows

        })

    );

}



//======================================================
// Restore Session
//======================================================
async function restoreSession(){

    const json =
        sessionStorage.getItem("studySession");

    if(!json)
        return;

    const s = JSON.parse(json);

    if(!s.category || s.category.trim()=="")
        return;

    currentCategory = s.category;

    currentStage = s.stage;

    changedRows = s.changedRows || [];

    await openCategory(currentCategory);

    currentWords =
        stageWords[currentStage]
        .filter(w=>w.ready);

    if(s.index < currentWords.length){

        currentIndex = s.index;

        showStudyPage();

        showWord();

    }

}



//======================================================
// Auto Save Session
//======================================================

window.addEventListener(

    "beforeunload",

    function(){

        saveSession();

    }

);





//======================================================
// Events
//======================================================

// Check
btnCheck.addEventListener("click",checkAnswer);

// Enter = Check
txtAnswer.addEventListener("keydown",function(e){

    if(e.key=="Enter"){

        e.preventDefault();

        if(reviewButtons.style.display=="grid"){

            updateWord("know");

        }
        else{

            checkAnswer();

        }

    }

});

// Review Buttons
btnKnow.addEventListener("click",function(){

    updateWord("know");

});

btnDontKnow.addEventListener("click",function(){

    updateWord("dontknow");

});

btnMaster.addEventListener("click",function(){

    updateWord("master");

});

// Back Buttons
btnBackCategories.addEventListener(

    "click",

    backToCategories

);

btnBackStages.addEventListener(

    "click",

    backToStages

);

btnFinishBack.addEventListener(

    "click",

    backToStages

);


//======================================================
// Keyboard Shortcuts
//======================================================

document.addEventListener(

    "keydown",

    function(e){

        // فقط داخل صفحه مطالعه

        if(pageStudy.style.display!="block")
            return;

        // اگر داخل تکست باکس تایپ می‌کنیم
        // فقط Enter مجاز باشد

        if(

            document.activeElement===txtAnswer &&

            e.key!="Enter"

        ){

            return;

        }

        switch(e.key){

            case "1":

                updateWord("know");

                break;

            case "2":

                updateWord("dontknow");

                break;

            case "3":

                updateWord("master");

                break;

        }

    }

);


//======================================================
// Start
//======================================================

window.addEventListener("load", async function(){





        await restoreSession();



});

menuPractice.addEventListener("click",function(){

    document
    .querySelectorAll(".menuItem")
    .forEach(item=>{
        item.classList.remove("active");
    });

    menuPractice.classList.add("active");

    loadCategories();
    closeSidebar();

});


menuAddWord.addEventListener("click",function(){

    document
    .querySelectorAll(".menuItem")
    .forEach(item=>{
        item.classList.remove("active");
    });

    menuAddWord.classList.add("active");

    showAddWordPage();
    closeSidebar();

});


menuStatistics.addEventListener("click",function(){

    document
    .querySelectorAll(".menuItem")
    .forEach(item=>{
        item.classList.remove("active");
    });

    menuStatistics.classList.add("active");

    showStatisticsPage();
    closeSidebar();

});


menuHeatmap.addEventListener("click",()=>{


    document
    .querySelectorAll(".menuItem")
    .forEach(item=>{

        item.classList.remove("active");

    });


    menuHeatmap.classList.add("active");


    showHeatmapPage();
    closeSidebar();


});


btnSaveWord.addEventListener(

    "click",

    saveWord

);





btnCollapse.onclick = function(){

    document.body.classList.toggle("sidebarCollapsed");

};

function closeSidebar(){

    console.log("Closing Sidebar...");

    sidebar.classList.add("collapsed");

    console.log(sidebar.className);

    overlay.classList.remove("show");

}

function showLoading(){

    const loading = document.getElementById("loading");

    if(loading){

        loading.style.display = "flex";

    }

}

function hideLoading(){

    const loading = document.getElementById("loading");

    if(loading){

        loading.style.display = "none";

    }

}


async function loadStatistics(){

    if(statisticsCache == null){

        const response =
            await get("?action=statistics");

        statisticsCache = response.data.map(item=>{


function faToEn(str){

    const map = {

        '۰':'0',
        '۱':'1',
        '۲':'2',
        '۳':'3',
        '۴':'4',
        '۵':'5',
        '۶':'6',
        '۷':'7',
        '۸':'8',
        '۹':'9'

    };

    return str.replace(/[۰-۹]/g, d => map[d]);

}


const shamsi =
convertToShamsi(item.date);

const parts =
faToEn(shamsi).split("/");

    return{

        ...item,

        shamsiYear:
        Number(parts[0]),

        shamsiMonth:
        Number(parts[1]),

        shamsiDay:
        Number(parts[2]),

        shamsi:
        shamsi

    };

});
console.log(statisticsCache[0]);
loadStatisticsMonths();

    }

    renderStatistics();

}


function renderStatistics(){


    const ctx =
    document
    .getElementById("statisticsChart")
    .getContext("2d");




    console.log("Original statistics:", statisticsCache);

//---
const filteredData =
statisticsCache.filter(item=>{

    const key =
        item.shamsiYear +
        "/" +
        String(item.shamsiMonth).padStart(2,"0");

    return key == selectedStatisticsMonth;

});

  const parts =
selectedStatisticsMonth.split("/");
const chartData =
fillMissingShamsiChartDays(
    filteredData,
    Number(parts[0]),
    Number(parts[1])
);
console.log("selected month:", selectedStatisticsMonth);
console.log("filteredData:", filteredData);
console.log("chartData:", chartData);

const labels =
chartData.map(x=>String(x.date));



  

// const chartData =
// fillMissingDays(
//     filteredData,
//     Number(parts[0]),
//     Number(parts[1]) - 1
// );




const values =
chartData.map(x=>x.count);



    if(statisticsChart){

        statisticsChart.destroy();

    }


    statisticsChart =
    new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Reviewed Words",

                data:values,

                

            }]

        },

options:{

    responsive:true,

    

    plugins:{

        legend:{

            display:true,

            labels:{

                font:{

                    family:"Segoe UI",

                    size:10

                }

            }

        }

    },


    scales:{

        x:{

            ticks:{

                font:{

                    family:"Segoe UI",

                    size:12

                }

            }

        },


        y:{

            ticks:{

                font:{

                    family:"Segoe UI",

                    size:13

                }

            }

        }

    }

}

    });

}

document
.getElementById("menuStatistics")
.addEventListener("click",()=>{

    showStatisticsPage();

});


function convertToShamsi(date){

    const d = new Date(date);

    return new Intl.DateTimeFormat(
        'fa-IR-u-ca-persian',
        {
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        }
    ).format(d);

}


function showHeatmapPage(){

    hidePages();

    pageHeatmap.style.display="block";

    loadHeatmap();

}


async function loadHeatmap(){

    if(heatmapCache==null){

        const response =
            await get("?action=statistics");


        heatmapCache =
            response.data;

    }


    renderHeatmap();

}


function renderHeatmap(){

console.log("selectedStatisticsMonth =", selectedStatisticsMonth);

console.log("heatmapCache =", heatmapCache);



    const container =
    document.getElementById("heatmapContainer");


    container.innerHTML="";


const filteredData =
heatmapCache.filter(item=>{

    const shamsi =
        new Intl.DateTimeFormat(
            'en-US-u-ca-persian',
            {
                year:"numeric",
                month:"numeric",
                day:"numeric"
            }
        ).formatToParts(new Date(item.date));


    let jy, jm;


    shamsi.forEach(x=>{

        if(x.type==="year")
            jy = Number(x.value);

        if(x.type==="month")
            jm = Number(x.value);

    });


    const key =
        jy +
        "/" +
        String(jm).padStart(2,"0");


    return key === selectedStatisticsMonth;

});


console.log("filteredData =", filteredData);


const parts =
selectedStatisticsMonth.split("/");


const fullData =
fillMissingShamsiDays(
    filteredData,
    Number(parts[0]),
    Number(parts[1])
);


        fullData.forEach(item=>{


        const date =
        convertToShamsi(item.date);


        const box =
        document.createElement("div");


        box.className="heatBox";


    //     box.innerHTML = 
    // new Intl.DateTimeFormat(
    //     'fa-IR-u-ca-persian',
    //     {
    //         day:'numeric'
    //     }
    // ).format(new Date(item.date));

box.innerHTML = item.date;


        box.title =
        date + " : " + item.count + " words";


        let level="";


        if(item.count==0)

            level="level0";

        else if(item.count<10)

            level="level1";

        else if(item.count<30)

            level="level2";

        else if(item.count<50)

            level="level3";

        else

            level="level4";


        box.classList.add(level);


        container.appendChild(box);
        console.log("box created", box);


    });


}
function fillMissingDays(data){

    const result=[];

    const map={};

    data.forEach(x=>{

        map[x.shamsiDay]=Number(x.count);

    });

    const maxDay=Math.max(

        ...data.map(x=>x.shamsiDay)

    );

    for(let i=1;i<=maxDay;i++){

        result.push({

            day:i,

            count:map[i]||0

        });

    }

    return result;

}

function convertToShamsiDay(date){

    const d = new Date(date);


    return new Intl.DateTimeFormat(
        'fa-IR-u-ca-persian',
        {
            day:'numeric'
        }
    ).format(d);

}


async function loadStreak(){


    if(streakCache==null){

        const response =
        await get("?action=statistics");


        streakCache =
        response.data;

    }


    calculateStreak();

}

function calculateStreak(){


    const days = {};


    streakCache.forEach(item=>{


        if(item.count > 0){

const d = new Date(item.date);

const key = localDateKey(d);

days[key] = true;

            days[key] = true;

        }

    });



    let streak = 0;


    let current = new Date();

    current.setHours(0,0,0,0);



    console.log("days object:", days);

console.log(
    "current local:",
    current
);

console.log(
    "current iso:",
    current.toISOString().split("T")[0]
);

    while(true){


 const key = localDateKey(current);



        if(days[key]){


            streak++;


            current.setDate(
                current.getDate()-1
            );


        }
        else{

            break;

        }

    }



    document
    .getElementById("streakValue")
    .innerHTML =
    streak + " Days";


}


function loadStatisticsMonths(){

    cmbStatisticsMonth.innerHTML = "";

    const months = [];

    statisticsCache.forEach(item=>{

        const key =
            item.shamsiYear +
            "/" +
            String(item.shamsiMonth).padStart(2,"0");

        if(!months.includes(key))
            months.push(key);

    });

    months.sort();

    months.forEach(key=>{

        const parts = key.split("/");

        const title =
            parts[0] +
            " / " +
            parts[1];

        cmbStatisticsMonth.innerHTML += `

            <option value="${key}">

                ${title}

            </option>

        `;

    });

    selectedStatisticsMonth =
        cmbStatisticsMonth.value;

}

cmbStatisticsMonth.onchange=function(){

    selectedStatisticsMonth=this.value;

    renderStatistics();

    renderHeatmap();

};


function showLogin(){

    loginPage.style.display="flex";

    appContainer.style.display="none";

}


function showApp(){

    loginPage.style.display="none";

    appContainer.style.display="block";
    closeSidebar(); 

}


async function login(){

    const result =
    await post({

        action:"login",

        username:txtUsername.value,

        password:txtPassword.value

    });


if(result.success){

    sessionStorage.setItem("logged","1");

    showApp();

    closeSidebar();

    loadCategories();

}
    else{

        loginMessage.innerHTML=

            "Wrong username or password";

    }

}

btnLogin.onclick = login;

txtPassword.onkeydown=function(e){

    if(e.key=="Enter")

        login();

};


txtUsername.onkeydown=function(e){

    if(e.key=="Enter")

        login();

};

if(sessionStorage.getItem("logged")){

    showApp();

    loadCategories();

}
else{

    showLogin();

}




function buildCompare(user,correct){

    const max=Math.max(
        user.length,
        correct.length
    );

    let html="";

    for(let i=0;i<max;i++){

        const u=user[i] || "";
        const c=correct[i] || "";

        if(u===c){

            html+=`

            <div class="letterBox">

                <div class="letter correct">

                    ${u}

                    <div class="icon correct">

                        ✓

                    </div>

                </div>

            </div>

            `;

        }

        else{

            html+=`

            <div class="letterBox">

                <div class="letter wrong">

                    ${u}

                    <div class="icon wrong">

                        ✕

                    </div>

                </div>

                <div class="correctHint">

                    ${c}

                </div>

            </div>

            `;

        }

    }

    return html;

}



function fillMissingShamsiDays(data, jy, jm){

    const result = [];

    const map = {};


    data.forEach(item=>{

        const parts =
            new Intl.DateTimeFormat(
                'en-US-u-ca-persian',
                {
                    year:"numeric",
                    month:"numeric",
                    day:"numeric"
                }
            ).formatToParts(new Date(item.date));


        let day;


        parts.forEach(p=>{

            if(p.type==="day")
                day = Number(p.value);

        });


        map[day] = item.count;


    });



    // تعداد روزهای ماه شمسی
    let days;


    if(jm <= 6)
        days = 31;
    else if(jm <= 11)
        days = 30;
    else
        days = 30; // فعلا برای سادگی



    for(let i=1;i<=days;i++){

        result.push({

            date:
                i,

            count:
                map[i] || 0

        });

    }


    return result;

}



function fillMissingShamsiChartDays(data, jy, jm){

    const result = [];

    const map = {};


    data.forEach(item=>{

        const parts =
        new Intl.DateTimeFormat(
            'en-US-u-ca-persian',
            {
                day:"numeric"
            }
        ).formatToParts(new Date(item.date));


        let day = 0;


        parts.forEach(p=>{

            if(p.type==="day")
                day = Number(p.value);

        });


        map[day] = item.count;

    });



    let days;


    if(jm <= 6)
        days = 31;
    else
        days = 30;



    for(let i=1;i<=days;i++){

        result.push({

            date:i,

            count:
            map[i] || 0

        });

    }


    return result;

}



function localDateKey(date){

    const y = date.getFullYear();

    const m = String(date.getMonth()+1)
        .padStart(2,"0");

    const d = String(date.getDate())
        .padStart(2,"0");

    return `${y}-${m}-${d}`;

}