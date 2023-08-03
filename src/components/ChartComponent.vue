<template>
  <div class="max-w-screen-lg mx-auto p-6">
    <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
      <div class="w-full h-64">
        <canvas id="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { raceData } from "../data.js";

export default {
  name: "ChartComponent",
  data() {
    return {
      chartComponent: {
        type: "bar",
        data: {
          labels: this.dataLabels(),
          datasets: [
            {
              label: "Nombre de tour ",
              backgroundColor: "#1D63DC",
              data: this.datasets(),
              fill: true,
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.05 )",
              },
            },
          },
        },
      },
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById("chartCanvas");
      new Chart(ctx, this.chartComponent);
    },
    datasets() {
      let test = raceData.map((item) => {
        return item.slice(1, -2);
      });
      test = test.flat();
      test = this.timeToMinutes(test);
      test.sort((a, b) => a - b);
      //count every same value in array and put it in a new array
      let array = [];
      for (let i = 0; i < test.length; i++) {
        let count = 1;
        while (test[i] === test[i + 1]) {
          count++;
          i++;
        }
        array.push(count);
      }
      return array;
    },
    dataLabels() {
      let test = raceData.map((item) => {
        return item.slice(1, -2);
      });
      test = test.flat();
      test = this.timeToMinutes(test);
      let array = [...new Set(test)].sort((a, b) => a - b);
      return this.minutesToTime(array);
    },
    timeToMinutes(time) {
      for (let i = 0; i < time.length; i++) {
        let timeSplit = time[i].split(":");
        let hours = parseInt(timeSplit[0]);
        let minutes = parseInt(timeSplit[1]);
        let seconds = parseInt(timeSplit[2]);
        let totalMinutes = hours * 60 + minutes + seconds / 60;
        //means
        time[i] = Math.floor(totalMinutes);
      }
      return time;
    },
    minutesToTime(minutes) {
      for (let i = 0; i < minutes.length; i++) {
        let hours = Math.floor(minutes[i] / 60);
        let minutesLeft = minutes[i] % 60;
        let seconds = Math.round((minutesLeft - Math.floor(minutesLeft)) * 60);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        minutes[i] = hours + ":" + minutesLeft + ":" + seconds;
      }
      return minutes;
    },
  },
};
</script>
