<template>
  <div class="flex flex-col h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 p-6">
    
    <div v-if="!started" class="flex flex-1 justify-center items-center">
      <div class="w-full max-w-md text-center">
        <input
          v-model="question"
          @keyup.enter="startChat"
          type="text"
          placeholder="Ask your first finance question..."
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="startChat"
          :disabled="!question.trim()"
          class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Start Chat
        </button>
      </div>
    </div>

 
    <div v-else class="flex flex-col flex-1">
   
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <div 
            class="max-w-xs md:max-w-md p-3 rounded-xl shadow-md"
            :class="msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 backdrop-blur-md bg-opacity-30 border border-white'"
          >
            {{ msg.content }}
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="flex mt-4">
        <input
          v-model="question"
          type="text"
          placeholder="Ask a finance question..."
          class="flex-1 p-3 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button 
          type="submit" 
          :disabled="loading || !question.trim()"
          class="bg-blue-600 text-white px-6 rounded-r-xl disabled:opacity-50"
        >
          {{ loading ? '...' : 'Send' }}
        </button>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const question = ref('');
const loading = ref(false);
const started = ref(false);
const messages = ref<{ role: string; content: string }[]>([]);

const startChat = async () => {
  if (!question.value.trim()) return;
  started.value = true;
  await sendMessage();
};

const sendMessage = async () => {
  if (!question.value.trim()) return;

  messages.value.push({ role: 'user', content: question.value });
  const currentQuestion = question.value;
  question.value = '';
  loading.value = true;

  try {
    const res = await $fetch('/api/ask', {
      method: 'POST',
      body: { question: currentQuestion }
    });
    messages.value.push({ role: 'assistant', content: res.reply || res.error || 'No reply.' });
  } catch (err: any) {
    messages.value.push({ role: 'assistant', content: err.message || 'Error occurred.' });
  } finally {
    loading.value = false;

    setTimeout(() => {
      const container = document.querySelector('.overflow-y-auto');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }
};
</script>

<style scoped>

.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
