import { ref, computed } from "vue";
import { defineStore } from "pinia";
import IndexedDB from "@/utils/IndexedDB";

/* note 笔记模块 */
export const useNoteStore = defineStore("note", () => {
  const elpis = new IndexedDB();
  const list = ref([]); // 列表
  const note = ref({}); // 笔记详情

  const note1 = {
    id: 1,
    note_id: crypto.randomUUID().replace(/-/g, ""),
    title: "",
    author_id: "",
    category_id: "",
    content: "",
    create_time: +new Date(),
    update_time: +new Date()
  };

  /* 增 */
  async function create(data) {
    // 对elpis库的note表 进行新增一条数据
    await elpis.create("note", data);
  }

  /* 删 */
  async function remove(noteId) {}

  /* 改 */
  async function update() {}

  /* 查列表 */
  async function findAll() {
    const res = await elpis.findAll("note");
    console.log("查询数据库 note列表", res.target.result);
    list.value = res.target.result;
  }

  /* 查详情 */
  async function findOne() {}

  return {
    list,
    note,
    create,
    remove,
    update,
    findAll,
    findOne
  };
});
