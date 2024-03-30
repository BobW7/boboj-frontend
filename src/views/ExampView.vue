<template>
  <div class="example">
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
  </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const codeValue = ref();
const mdValue = ref();
const onCodeChange = (v: string) => {
  codeValue.value = v;
};
const onMdChange = (v: string) => {
  mdValue.value = v;
};
</script>
