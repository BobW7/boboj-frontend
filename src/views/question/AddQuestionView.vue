<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请填充标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item :field="form.answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item
            field="judgeConfig.timeLimit"
            validate-trigger="input"
            extra="时间限制"
            :rules="[{ required: true, message: '请配置时间限制' }]"
            hide-label
          >
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="medium"
            />
          </a-form-item>
          <a-form-item
            field="judgeConfig.memoryLimit"
            validate-trigger="input"
            extra="空间限制"
            :rules="[{ required: true, message: '请配置空间限制' }]"
            hide-label
          >
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入空间限制"
              mode="button"
              min="0"
              size="medium"
            />
          </a-form-item>
          <a-form-item
            field="judgeConfig.memoryLimit"
            validate-trigger="input"
            extra="堆栈限制"
            :rules="[{ required: true, message: '请配置堆栈限制' }]"
            hide-label
          >
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="medium"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例 ${index + 1}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请添加输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例 ${index + 1}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请添加输出用例"
              />
            </a-form-item>
            <a-button
              @click="handleDelete(index)"
              :style="{ marginBottom: '20px' }"
              type="dashed"
              status="danger"
              >删除
            </a-button>
          </a-space>
        </a-form-item>
        <div>
          <a-button type="dashed" status="success" @click="handleAdd"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit" style="min-width: 200px"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

/**
 * 提交表单到后端接口
 */
const doSubmit = async () => {
  console.log(form);
  const res = await QuestionControllerService.addQuestionUsingPost(form);
  if (res.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败," + res.description);
  }
};
/**
 * 添加判题用例
 */
const handleAdd = () => {
  form.judgeCase.push({
    input: "",
    output: "",
  });
};
/**
 * 删除判题用例
 * @param index
 */
const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};
/**
 * 表单原始结构
 */
const form = reactive({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeCase: [],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
});
const onContentChange = (value: string) => {
  form.content = value;
};
const onAnswerChange = (value: string) => {
  form.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  .arco-input-wrapper {
    width: 300px;
  }

  .arco-input-tag.arco-input-tag-size-medium {
    font-size: 14px;
    width: auto;
  }
}
</style>
