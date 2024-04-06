<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题目ID">
        <a-input v-model="searchParams.questionId" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="language" label="编程语言">
        <a-select
          :style="{ width: '320px' }"
          v-model="searchParams.language"
          placeholder="请选择编程语言"
          allow-clear
        >
          <a-option>cpp</a-option>
          <a-option>java</a-option>
          <a-option>python</a-option>
          <a-option>go</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
// 搜索条件
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    console.log(res);
  } else {
    message.error("加载失败！" + res.message);
  }
};

/**
 * 监听下面函数中所有变量的变化，如果有变化都会重新执行（分页时用到）
 * 这里loadData中的变量就是searchParams。value
 */
watchEffect(() => {
  loadData();
});

onMounted(() => {
  loadData();
});
const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "题目ID",
    dataIndex: "questionId",
  },
  {
    title: "提交者ID",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];
const onPageChange = (page: number) => {
  // 直接修改分页请求参数中的current字段，这将会被watchEffect()监听到
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const router = useRouter();

/**
 * 确认搜索
 */
const doSearch = () => {
  //需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  // 这里不需要在执行loadData的原因是watchEffect()监听了searchParams的变化，会自动刷数据
  // loadData();
};

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = async (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: auto;

  .arco-input-wrapper {
    width: 300px;
  }

  .arco-input-tag.arco-input-tag-size-medium {
    font-size: 14px;
  }
}
</style>
