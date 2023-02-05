
const date=localStorage.getItem('date');
const routeId=localStorage.getItem('routeTransport');
const stopId=parseInt(localStorage.getItem('stopId'));
const id=localStorage.getItem('id');
const stopName=localStorage.getItem('stopName');
const stopCode=localStorage.getItem('stopCode');
document.getElementById("znak").innerHTML=id;
document.getElementById("przystanek").innerHTML="Przystanek: "+stopName+" "+stopCode;
console.log(stopName);

class Schedule {
    constructor() {
      this.arrivalTimes = [];
      this.uniqueArrivalTimes = [];
      this.parentDiv = document.querySelector(".timetable-time");
    }
  
    fetchData() {
        let url = `https://ckan2.multimediagdansk.pl/stopTimes?date=${date}&routeId=${routeId}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let stops = data.stopTimes;
          stops.forEach(item => {
            if (item.stopId === stopId) {
              this.arrivalTimes.push(item.arrivalTime);
            }
          });
          this.arrivalTimes.sort();
          this.formatData();
          this.createDivs();
        });
    }
  
    formatData() {
      let formattedArrivalTimes = [];
      this.arrivalTimes.forEach(item => {
        let time = item.split("T")[1];
        formattedArrivalTimes.push(time);
      });
  
      let finalArrivalTimes = [];
      formattedArrivalTimes.forEach(item => {
        let parts = item.split(":");
        finalArrivalTimes.push(`${parts[0]}:${parts[1]}`);
      });
  
      this.uniqueArrivalTimes = [...new Set(finalArrivalTimes)];
    }
  
    createDivs() {
        this.uniqueArrivalTimes.forEach(time => {
            let parts = time.split(":");
            let hour = parts[0];
            let minute = parts[1];
          
            let hourDiv = document.querySelector(`li[data-hour="${hour}"]`);
          
            if (!hourDiv) {
            hourDiv = document.createElement("li");
            hourDiv.classList.add("timetable-time-hour");
            hourDiv.setAttribute("data-hour", hour);
            
            let hourName = document.createElement("div");
            hourName.classList.add("timetable-hour-name");
            hourName.innerHTML = hour;
            hourDiv.appendChild(hourName);
            
            let minuteList = document.createElement("ul");
            minuteList.classList.add("timetable-min");
            hourDiv.appendChild(minuteList);
        
            this.parentDiv.appendChild(hourDiv);
            }
          
            let minuteDiv = document.createElement("li");
            minuteDiv.classList.add("minute");
            minuteDiv.innerHTML = minute;
            hourDiv.querySelector(".timetable-min").appendChild(minuteDiv);
          });
          
    }
  }

  const schedule = new Schedule();
  schedule.fetchData();

