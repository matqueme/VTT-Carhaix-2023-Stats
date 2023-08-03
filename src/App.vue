<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="flex justify-between items-center shadow-md px-6 py-3 relative">
      <h1 class="text-2xl font-semibold dark:text-gray-100">
        6h VTT Carhaix 2023 - Race Statistics
      </h1>
      <button
        @click="toggleDarkMode"
        class="text-gray-600 hover:text-gray-800 dark:text-gray-300"
      >
        <font-awesome-icon
          :icon="darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"
        />
      </button>
      <div
        class="absolute w-full h-0.5 bottom-0 left-0 dark:bg-gray-300 dark:opacity-20"
      ></div>
    </div>

    <div class="text-center text-2xl font-semibold p-6 dark:text-gray-100">
      Statistiques
    </div>

    <chart-component :isDark="darkMode" />

    <div class="text-center text-2xl font-semibold p-6 dark:text-gray-100">
      Résultats
    </div>

    <div class="max-w-screen-lg mx-auto p-6 text-black dark:text-white">
      <div
        class="bg-white shadow-md dark:bg-gray-800 rounded-lg overflow-x-auto"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index"
                class="px-3 py-4 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase cursor-pointer relative"
                @click="column.key !== 'position' && sortTable(column)"
              >
                {{ column.label }}
                <span v-if="sortColumn === column.key" class="absolute right-3">
                  <font-awesome-icon
                    :icon="
                      sortDirection === 'asc'
                        ? 'fa-solid fa-caret-down'
                        : 'fa-solid fa-caret-up'
                    "
                  ></font-awesome-icon>
                </span>
                <span
                  v-else-if="column.key != 'position'"
                  class="absolute right-3"
                >
                  <font-awesome-icon
                    icon=" fa-solid fa-sort"
                  ></font-awesome-icon>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in sortedData"
              :key="index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4">
                {{ index + 1 }}{{ ordinalSuffix(index + 1) }}
              </td>
              <td class="px-6 py-4">{{ row[0] }}</td>
              <td class="px-6 py-4">
                {{ row[row.length - 2] + " " + row[row.length - 1] }}
              </td>
              <td class="px-6 py-4">{{ bestLap(row) }}</td>
              <td class="px-6 py-4">{{ calculateAverageTime(row) }}</td>
              <td class="px-6 py-4">{{ row.length - 3 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { raceData } from "./data.js";
import ChartComponent from "./components/ChartComponent.vue";

export default {
  components: {
    ChartComponent,
  },
  data() {
    return {
      columns: [
        { key: "position", label: "Position" },
        { key: "dossard", label: "Dossard" },
        { key: "name", label: "NOM Prénom" },
        { key: "meilleur_temps", label: "Meilleur temps lors du tour" },
        { key: "temps_moyen", label: "Temps moyen" },
        { key: "tours", label: "Tours" },
      ],
      data: raceData,
      sortColumn: "",
      sortDirection: "asc",
      darkMode: false,
      chartData: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Sales",
            backgroundColor: "#f87979",
            data: [40, 20, 30, 10, 50],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    if (localStorage.theme === "dark") {
      this.toggleDarkMode();
    }
    this.sortColumn = "dossard"; // Set the default sorting column
  },
  computed: {
    sortedData() {
      return [...this.data];
    },
  },
  methods: {
    ordinalSuffix(number) {
      const lastDigit = number % 10;
      if (lastDigit === 1) {
        return "st";
      } else if (lastDigit === 2) {
        return "nd";
      } else if (lastDigit === 3) {
        return "rd";
      } else {
        return "th";
      }
    },
    bestLap(row) {
      return (
        row.slice(1, -2).sort()[0] +
        " - Tour " +
        row.indexOf(row.slice(1, -2).sort()[0])
      );
    },
    calculateAverageTime(row) {
      const times = row.slice(1, -2);
      const totalSeconds = times.reduce(
        (acc, time) => acc + this.timeToSeconds(time),
        0
      );
      const averageSeconds = totalSeconds / times.length;
      return this.secondsToTime(averageSeconds);
    },
    // Helper functions
    timeToSeconds(time) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    },
    // Helper functions
    secondsToTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.round(seconds % 60);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },
    // Toggle dark mode
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.darkMode
        ? ((document.documentElement.style.colorScheme = "dark"),
          document.documentElement.classList.add("dark"),
          (localStorage.theme = "dark"))
        : ((document.documentElement.style.colorScheme = "light"),
          document.documentElement.classList.remove("dark"),
          (localStorage.theme = "light"));
    },
    // Sort the table based on the selected column and direction
    sortTable(column) {
      if (this.sortColumn === column.key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column.key;
        this.sortDirection = "asc";
      }

      this.data.sort((a, b) => {
        if (column.key === "dossard") {
          return this.sortDirection === "asc" ? a[0] - b[0] : b[0] - a[0];
        } else if (column.key === "name") {
          return this.sortDirection === "asc"
            ? (a[a.length - 2] + " " + a[a.length - 1]).localeCompare(
                b[b.length - 2] + " " + b[b.length - 1]
              )
            : (b[b.length - 2] + " " + b[b.length - 1]).localeCompare(
                a[a.length - 2] + " " + a[a.length - 1]
              );
        } else if (column.key === "meilleur_temps") {
          return this.sortDirection === "asc"
            ? this.bestLap(a).localeCompare(this.bestLap(b))
            : this.bestLap(b).localeCompare(this.bestLap(a));
        } else if (column.key === "temps_moyen") {
          return this.sortDirection === "asc"
            ? this.calculateAverageTime(a).localeCompare(
                this.calculateAverageTime(b)
              )
            : this.calculateAverageTime(b).localeCompare(
                this.calculateAverageTime(a)
              );
        } else if (column.key === "tours") {
          return this.sortDirection === "asc"
            ? a.length - 3 - (b.length - 3)
            : b.length - 3 - (a.length - 3);
        }
      });
    },
  },
};
</script>
