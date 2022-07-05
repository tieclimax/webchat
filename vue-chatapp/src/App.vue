<script setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';

const socket = io('http://localhost:8080');
const joined = ref(false);
const name = ref('');
const colorName = ref('');
const messages = ref([]);
const messageText = ref('');
const typingDisplay = ref('');
const timeout = ref('');
const currentUsers = ref([]);

onBeforeMount(() => {
  socket.emit('findAllMessages', {}, (resposne) => {
    messages.value = resposne;
  });

  socket.on('message', (message) => {
    messages.value.push(message);
  });

  socket.on('typing', ({ name, isTyping }) => {
    if (isTyping.isTyping) {
      typingDisplay.value = `${name} is typing...`;
    } else {
      typingDisplay.value = '';
    }
  });

  socket.on('disconected', (name) => {
    console.log(name.name + ' is disconected');
  });
});

socket.on('active_users', (users) => {
  currentUsers.value = Object.values(users);
  console.log('active users', users);
});

const join = () => {
  socket.emit('active', { name: name.value });
  socket.emit('join', { name: name.value }, () => {
    joined.value = true;

    // random color
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#9e9e9e',
      '#607d8b',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    colorName.value = randomColor;
  });
};

const sendMessage = () => {
  if (!messageText.value) return;

  socket.emit(
    'createMessege',
    { text: messageText.value, color: colorName.value },
    () => {
      messageText.value = '';
    }
  );
};

const emitTyping = () => {
  socket.emit('typing', { isTyping: true });

  timeout.value = setTimeout(() => {
    socket.emit('typing', { isTyping: false });
  }, 3000);
};

const disconected = () => {
  socket.emit('goOffline', { name: name.value });
  joined.value = false;
  name.value = '';
};
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <div class="flex flex-col bg-gray-100 col-span-1 p-8">
      <h1 class="text-2xl font-bold mb-4">
        <i class="fas fa-users mr-2"></i>Current Users
      </h1>
      <li
        v-for="user in currentUsers"
        :key="user.id"
        class="text-gray-600 p-2 list-none font-bold flex gap-1 item-center"
      >
        <!-- <i class="fas fa-circle text-sm animate-pluse"></i> -->
        <span class="flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
          ></span>
        </span>

        {{ user }}
      </li>
    </div>
    <div
      class="flex flex-col items-center justify-between gap-4 h-screen col-span-3"
    >
      <div class="flex gap-2 items-center">
        <i class="fas fa-comments text-4xl"></i>
        <h1 class="text-4xl text-green-600 font-bold my-4">WeBChat</h1>
      </div>
      <div v-if="!joined" class="mb-auto">
        <form @submit.prevent="join" class="p-4 flex gap-4 items-center">
          <h1 class="text-lg">What your name?</h1>
          <input
            v-model="name"
            type="text"
            class="outline-red-500 p-2 border border-red-300 rounded-md"
          />
          <button
            type="submit"
            class="font-bold p-2 px-4 border border-green-400 rounded-lg bg-green-400 hover:bg-green-600 hover:text-white"
          >
            Join
          </button>
        </form>
      </div>
      <div class="container mb-auto p-4 h-[80%] overflow-y-auto" v-else>
        <div
          v-for="message in messages"
          :key="message"
          class="flex flex-col gap-y-2 my-2"
          :class="message.name === name ? 'items-end' : 'items-start'"
        >
          <span v-if="message.timestamp" class="text-sm text-gray-400">{{
            message.timestamp
          }}</span>

          <div class="flex p-2 gap-x-2 bg-gray-100 rounded-lg">
            <h1
              class="text-lg text-black font-bold"
              :style="{ color: message.color }"
            >
              [{{ message.name }}]:
            </h1>
            <h1 class="text-lg text-black">
              {{ message.text }}
            </h1>
          </div>
        </div>
      </div>

      <div
        v-if="joined"
        class="flex flex-col items-center justify-center absolute bottom-0 left-0 w-full"
      >
        <div v-if="typingDisplay" class="p-2 animate-bounce">
          <span class="text-base text-gray-400">{{ typingDisplay }}</span>
        </div>
        <hr />

        <span v-if="name" class="text-base text-gray-400"
          >current name: {{ name }}</span
        >

        <hr />
        <form
          @submit.prevent="sendMessage"
          class="p-4 flex gap-4 justify-center items-center w-full"
        >
          <label class="text-lg">Message:</label>
          <input
            v-model="messageText"
            @input="emitTyping"
            type="text"
            class="outline-red-500 p-2 border border-red-300 rounded-md w-1/2"
          />
          <button
            type="submit"
            class="font-bold p-2 px-8 font-bold border border-green-400 rounded-lg bg-green-400 hover:bg-green-600 hover:text-white duration-200 transform cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
    <div class="flex flex-col items-center col-span-1 p-8">
      <button
        v-if="joined"
        @click="disconected"
        class="my-4 p-2 border border-red-600 text-white font-bold bg-red-600 rounded-lg"
      >
        Disconected
      </button>
    </div>
  </div>
</template>

<style>
@import './assets/base.css';
</style>
