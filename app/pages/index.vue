<template>
  <div class="p-10 space-y-6 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold text-center">AI Financial Assistant</h1>

    <!-- AI Input Section -->
    <div class="space-y-2">
      <input
        v-model="question"
        type="text"
        placeholder="Ask a finance question..."
        class="border p-2 w-full rounded"
      />
      <button @click="askAI" class="bg-blue-600 text-white px-4 py-2 rounded">
        Ask AI
      </button>
      <div v-if="reply" class="p-4 bg-gray-100 rounded">{{ reply }}</div>
      <div v-if="error" class="p-4 bg-red-100 rounded">{{ error }}</div>
    </div>

    <!-- Chart Section
    <h2 class="text-2xl font-bold mt-6">Revenue Chart</h2>
    <client-only>
      <LineChart />
    </client-only> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LineChart from "@/components/LineChart.vue";

const question = ref("");
const reply = ref("");
const error = ref("");

const askAI = async () => {
  reply.value = "";
  error.value = "";

  try {
    const res = await $fetch("/api/ask", {
      method: "POST",
      body: { question: question.value },
    });
    if (res.reply) reply.value = res.reply;
    else error.value = "No reply from AI";
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
