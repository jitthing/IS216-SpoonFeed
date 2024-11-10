<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  mealHistory: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  // Group meals by date
  const mealsByDate = props.mealHistory.reduce((acc, meal) => {
    // Use ISO string for consistent date formatting
    const date = new Date(meal.dateLogged).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    }
    acc[date].calories += meal.calories || 0
    acc[date].protein += meal.protein || 0
    return acc
  }, {})

  // Sort dates properly using ISO format
  const dates = Object.keys(mealsByDate).sort()

  return {
    // Format dates for display
    labels: dates.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: 'Calories (kcal)',
        data: dates.map((date) => mealsByDate[date].calories),
        borderColor: '#517470',
        tension: 0.1
      },
      {
        label: 'Protein (g)',
        data: dates.map((date) => mealsByDate[date].protein),
        borderColor: '#acbaa1',
        tension: 0.1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        font: {
          size: 14 // Larger y-axis labels
        },
        callback: function (value) {
          if (value >= 1000) {
            return value / 1000 + 'k'
          }
          return value
        }
      },
      title: {
        display: true,
        text: 'Amount',
        font: {
          size: 16 // Y-axis title
        }
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 10,
        font: {
          size: 14 // Larger x-axis labels
        }
      },
      title: {
        display: true,
        text: 'Date',
        font: {
          size: 16 // X-axis title
        }
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 15
      }
    },
    title: {
      display: true,
      text: 'Macro Overview',
      font: {
        size: 16 // Larger legend text
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
  margin: 20px 0;
}
</style>
