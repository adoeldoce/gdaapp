//funkcja data dla przenoszenia
function data2() { 
    let dzis = new Date();
    let dzien = String(dzis.getDate()+1).padStart(2,'0');
    let miesiac = String(dzis.getMonth()+1).padStart(2,'0');
    let rok = dzis.getFullYear();
    document.getElementById("data").innerHTML= dzien +"-"+ miesiac +"-"+ rok;
}
window.onload = data2;
let date;
//funkcja data dla strony
async function data() { 
    let dzis = new Date();
    let dzien = String(dzis.getDate()+1).padStart(2,'0');
    let miesiac = String(dzis.getMonth()+1).padStart(2,'0');
    let rok = dzis.getFullYear();
    date = `${rok}-${miesiac}-${dzien}`
    localStorage.setItem('date',date);}

//wywołanie funkcji    
data();
getTram();
getBus(); 

//pobranie tripId po routeId
$(document).on("click", ".routeShortNameTram,.routeShortNameBus,.routeShortNameNightBus", function() {
    $('.routeShortNameTram, .routeShortNameBus, .routeShortNameNightBus').removeClass('active');
    $(this).addClass('active');
   
    let routeId = $(this).attr("value");
    let id= $(this).attr("id");
    document.getElementById("linia").style.display = "block";
    document.getElementById("linia").innerHTML = id;
    localStorage.setItem('routeTransport',routeId);
    localStorage.setItem('id',id);
    getTripId(routeId);
});

//funkcja wypisująca tramwaje
function getTram(){
fetch('https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json')
.then(response => response.json())
.then(data => {
    let name = date;
    let filteredData = data[name];
    let div;
    if(filteredData){
        routeShortNameTram ="";
        let routes = filteredData.routes;
        routes.forEach(route => {
        if(route.routeType==="TRAM"){
            div=$("<div>",
            {
                text: route.routeShortName,
                class: "routeShortNameTram",
                id: route.routeShortName,
                value: route.routeId

            }).appendTo("#tram");
        }
        });
    }
    sortTramDivs();
    
});
};
//funkcja wypisująca bus i nightbus
function getBus(){
fetch('https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json')
.then(response => response.json())
.then(data => {
    let name = date;
    let filteredData = data[name];
    if(filteredData){
        routeShortNameBus ="";
        routeShortNameNightBus ="";

        let routes = filteredData.routes;
        routes.forEach(route => {
        if(route.routeType==="BUS" && route.routeShortName.indexOf("N") !== -1){
            $("<div>",
            {
                text: route.routeShortName,
                class: "routeShortNameNightBus",
                id: route.routeShortName,
                value: route.routeId
            }).appendTo("#nocne");

            
        }
            else if(route.routeType==="BUS"){
            $("<div>",
            {
                text: route.routeShortName,
                class: "routeShortNameBus",
                id: route.routeShortName,
                value: route.routeShortName
            }).appendTo("#bus");
            
        }
        });             
    }
    sortBusDivs();
    sortNightBusDivs(); })};

//sortowanie tramwaji
function sortTramDivs() {
    // Pobierz wszystkie div'y z klasą "routeShortNameTram"
let tramDivs = $(".routeShortNameTram").get();
tramDivs.sort(function(a, b) {
    return a.id - b.id;
});
$(".routeShortNameTram").detach();
for (let i = 0; i < tramDivs.length; i++) {
    $(tramDivs[i]).appendTo("#tram");
} 
}
//sortowanie autobusów nocnych
function sortNightBusDivs() {
    // Pobierz wszystkie div'y z klasą "routeShortNameNightBus"
    let nBusDivs = $(".routeShortNameNightBus").get();
    nBusDivs.sort(function(a, b) {
        var aId = parseInt(a.id.substring(1));
        var bId = parseInt(b.id.substring(1));
        return aId - bId;
    });
    // Usuń div'y z klasą "routeShortNameNightBus" z drzewa DOM
    $(".routeShortNameNightBus").detach();
    // Dodaj div'y z powrotem do drzewa DOM w posortowanej kolejności
    for (let i = 0; i < nBusDivs.length; i++) {
        $(nBusDivs[i]).appendTo("#nocne");
    }
}
//sortowanie autobusów
function sortBusDivs() {
    // Pobierz wszystkie div'y z klasą "routeShortNameNightBus"
let busDivs = $(".routeShortNameBus").get();
busDivs.sort(function(a, b) {
    return a.id - b.id;
});
$(".routeShortNameBus").detach();
for (let i = 0; i < busDivs.length; i++) {
    $(busDivs[i]).appendTo("#bus"); } }
    let tripId=[];

function getTripId(routeId){
    fetch('https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/b15bb11c-7e06-4685-964e-3db7775f912f/download/trips.json')
    .then(response => response.json())
    .then(data => {
    let filteredData = data[date].trips.filter(item => item.routeId === parseInt(routeId) && item.type==="MAIN");
    tripId[0] = filteredData.map(item => item.tripId);
    console.log(tripId);
    getStop(routeId, tripId);
    })
    .catch(error => console.error(error));
} 

function getStop(routeId, tripIds) {
    tripIds.forEach(tripId => {
        let ulr=`https://ckan2.multimediagdansk.pl/stopTimes?date=${date}&routeId=${routeId}`
        fetch(ulr)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let filteredData = data.stopTimes.filter(item => item.tripId === tripId[0] && item.passenger === true);
            let uniqueStopId = [...new Set(filteredData.map(item => item.stopId))];
            let stopIdValue = uniqueStopId.map(stopId => {
                return {stopIdValue: stopId}
            });
            let filteredData2 = data.stopTimes.filter(item => item.tripId === tripId[1] && item.passenger === true);
            let uniqueStopId2 = [...new Set(filteredData2.map(item => item.stopId))];
            let stopIdValue2 = uniqueStopId2.map(stopId => {
                return {stopIdValue2: stopId}
            });
            let uniqueStopIdValue2 = [...new Set(stopIdValue2.map(item => item.stopIdValue2))];
            let uniqueStopIdValue = [...new Set(stopIdValue.map(item => item.stopIdValue))];
            getStopName(uniqueStopIdValue,uniqueStopIdValue2);
        })
        .catch(error => console.error(error));  
    });
}
//funkcja wypisująca stop name
function getStopName(stopIdValue, stopIdValue2, tripId) {
    fetch('https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json')
    .then(response => response.json())
    .then(data => {
        let name = date;
        let stops = data[name].stops;
        let lastStop;
        let lastStop2;
        
        document.getElementById("pierwsza").innerHTML = " ";

        document.getElementById("druga").innerHTML = " ";
        stopIdValue.forEach(stopId => {
        let stop = stops.find(stop => stop.stopId === stopId);
        if (stop) {
            lastStop = stop.stopName;
            $("<li>",{
                text: stop.stopDesc + " " + stop.stopCode,
                class: "stopName",
                id: stop.stopId,
                value: stop.stopName,
                stopCode: stop.stopCode

        }
).appendTo("#pierwsza");
    }
    });
    
    stopIdValue2.forEach(stopId => {
        let stop = stops.find(stop => stop.stopId === stopId);
        if (stop) {
            lastStop2  = stop.stopName;
            $("<li>",{
                text: stop.stopDesc + " " + stop.stopCode,
                class: "stopName",
                id: stop.stopId,
                value: stop.stopName,
                stopCode: stop.stopCode
            }).appendTo("#druga");
        }
    });
   document.getElementById("kierunek1").innerHTML = "Kierunek: " + lastStop;
   document.getElementById("kierunek2").innerHTML = "Kierunek: " + lastStop2;
    $("html, body").animate({
        scrollTop: $("#linia").offset().top - ($(window).height()/12)
    }, 500);
    $('.stopName').click(function(){
        let id= $(this).attr("id");
        let value = $(this).attr("value");
        let stopCode = $(this).attr("stopCode")
        localStorage.setItem("stopId",id);
        localStorage.setItem('stopName',value);
        localStorage.setItem('stopCode',stopCode);
        window.open('index2.html', '_blank');
        });
})
.catch(error => console.error(error));}
