<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <MdViewer :value="question.content || ''" />
              <a-descriptions title="Limits:" :column="{ xs: 1, md: 3, lg: 4 }">
                <a-descriptions-item label="时间限制(ms):">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="空间限制(kb):">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制:">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解"> 题解区</a-tab-pane>
          <a-tab-pane key="comment" title="评论"> 评论区</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="language" label="编程语言">
            <a-select
              :style="{ width: '320px' }"
              v-model="form.language"
              placeholder="请选择 ..."
              allow-clear
            >
              <a-option>cpp</a-option>
              <a-option>java</a-option>
              <a-option>python</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-button
          type="primary"
          status="success"
          @click="doSubmit"
          loading:false
          long
          style="min-width: 200px"
          >提交
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionSubmitAddRequest,
  QuestionControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const form = ref<QuestionSubmitAddRequest>({
  language: "",
  code: "",
});
const changeCode = (value: string) => {
  form.value.code = value;
};
/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败！" + res.message);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: auto;

  .arco-input-wrapper {
    width: 300px;
  }

  .arco-input-tag.arco-input-tag-size-medium {
    font-size: 14px;
  }
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
