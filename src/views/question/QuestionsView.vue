<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目名称">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请填充标签"
          allow-clear
        />
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #AC_Rate="{ record }">
        {{
          `${record.submitNum ? record.acceptNum / record.submitNum : "0"}% (${
            record.acceptNum
          }/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >Do it
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
// 搜索条件
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
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
const colors = [
  "red",
  "orangered",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "arcoblue",
  "purple",
  "pinkpurple",
  "magenta",
  "gray",
];
const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "AC_Rate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
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
#questionsView {
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
