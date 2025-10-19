<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartRef = ref<HTMLCanvasElement | null>(null);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Revenue",
      data: [1000, 1200, 900, 1500, 2000],
      borderColor: "blue",
      backgroundColor: "lightblue",
      tension: 0.4
    }
  ]
};

onMounted(() => {
  if (chartRef.value) {
    new Chart(chartRef.value, {
      type: "line",
      data,
      options: { responsive: true }
    });
  }
});
</script>
