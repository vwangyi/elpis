import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* category 分类模块 */
export const useCategoryStore = defineStore('category', () => {
  const edit = { title: '编辑', component: 'ElpisVditor' };
  const categoryList = ref([
    // {
    //   title: "推荐",
    //   component: "CardList",
    // },
    {
      title: 'Nodejs'
    },
    {
      title: 'JavaScript'
    },
    {
      title: 'TypeScript'
    },
    {
      title: 'HTML&CSS'
    },
    {
      title: 'Koa'
    },
    {
      title: 'Webpack'
    },
    {
      title: 'Vue'
    }
  ]);

  /* 切换显示编辑 */
  function toggleEdit() {
    if (categoryList.value[0].component === 'RichEditor') {
      categoryList.value.shift();
      return;
    }
    categoryList.value.unshift(edit);
  }

  return { categoryList, toggleEdit };
});
