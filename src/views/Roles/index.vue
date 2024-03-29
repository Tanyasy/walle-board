<template>
  <el-button class="add-button" type="primary" @click="showAddDialog">新增角色</el-button>
  <div class="table">
    <el-table
        stripe
        :data="state.tableData"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
    >
      <el-table-column
          prop="create_time"
          label="日期"
          width="250"
      >
        <template #default="scope">
          <div>
            <i class="Time"></i>
            <span style="margin-left: 10px">{{ dateFormat(scope.row.create_time) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="角色名"
          width="180"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="role_name"
          label="权限"
          show-overflow-tooltip
      >
        <template #default="scope">
          {{ showPermission(scope.row.permissions) }}
        </template>
      </el-table-column>
      <el-table-column
          align="right"
          fixed="right"
          label="操作"
          width="150"
      >
        <template #default="scope">
          <el-button
              size="small"
              @click="showEditDialog(scope.row)"
          >编辑
          </el-button>

          <el-popconfirm
              title="确定删除吗？"
              @confirm="deleteItem(scope.row)"
          >
            <template #reference>
              <el-button
                  size="small"
                  type="danger"
              >删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :title="state.title"
        v-model="editDialogVisible"
        width="32%"

        center>
      <div class="edit-name">
        <span>角色名称: </span>
        <el-input
            prefix-icon="User"
            v-model="state.editItem.name">
        </el-input>
      </div>
      <el-transfer
          v-model="state.itemIDList"
          :props="{
                      key: 'id',
                      label: 'name'
                    }"
          :data="state.itemList"/>
      <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
      </template>

    </el-dialog>

    <div class="page">
      <el-pagination
          background
          :page-sizes="state.pageArray"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="state.currentPage"
          :total="state.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {ref, reactive, onMounted} from "vue";
import {ElMessage} from "element-plus";
import req from "../../http/http";

export default {
  name: "index",
  setup() {
    const currentPage = ref(0);
    const limit = ref(10);
    const visible = ref(false);
    const editDialogVisible = ref(false);
    const state = reactive({
      itemList: [],
      itemIDList: [],
      tableData: [],
      value: "",
      title: "新增角色",

      editItem: {},
      currentPage: 0,
      limit: 10,
      total: 0,
      pageArray: [5, 10, 20, 50, 100],
    });

    function getItems() {
      req(
          "get",
          "role?page=" + state.currentPage + "&limit=" + state.limit
      ).then((response) => {
        state.tableData = response.data
        state.total = response.count
        editDialogVisible.value = false
      });
    }

    function addItem() {
      req(
          "post",
          "role/one",
          JSON.stringify(state.editItem)
      ).then((response) => {
        ElMessage.success({
          message: "新增角色" + response.name + "成功",
          type: "success",
        });
        getItems();
      });
    }

    function updateItem() {
      req(
          "post",
          "role/one",
          JSON.stringify(state.editItem)
      ).then((response) => {
        ElMessage.success({
          message: "修改角色" + response.name + "成功",
          type: "success",
        });
        getItems();
      });
    }

    function deleteItem(item) {
      req("delete", "role/" + item.id).then((response) => {
        ElMessage.success({
          message: "删除角色" + response.name + "成功",
          type: "success",
        });
        getItems();
      });
    }

    function getPermission() {
      req("get", "permission").then((response) => {
        state.itemList = response.data
      });
    }

    function handleSubmit() {
      state.editItem.permissions = state.itemIDList
      if (state.title === "新增角色") {
        addItem()
      } else {
        updateItem()
      }
    }

    function getIds(itemList) {
      let result = []
      itemList.forEach((item) => {
        result.push(item.id)
      })
      return result
    }

    function showAddDialog() {
      state.title = "新增角色"
      state.editItem.id = ""
      state.editItem.name = ""
      state.editItem.codename = ""
      state.itemIDList = []
      editDialogVisible.value = true
    }

    function showEditDialog(item) {
      state.title = "编辑角色"
      state.editItem.id = item.id
      state.editItem.name = item.name
      state.editItem.codename = item.codename
      state.itemIDList = getIds(item.permissions)

      editDialogVisible.value = true
    }


    const dateFormat = (dateStr) => {
      return dateStr.replace("T", " ");
    };


    const handleSizeChange = (size) => {
      state.limit = size;
      getItems();
    };

    const handleCurrentChange = (page) => {
      if (page) {
        state.currentPage = page;
        getItems();
      }
    };

    const showPermission = (permissionList) => {
      let permissionStr = ""

      for (const i in permissionList) {
        permissionStr += (permissionList[i].name + " | ")
      }
      return permissionStr.slice(0, -2)
    }


    onMounted(() => {
      getItems();
      getPermission();
    });

    return {
      currentPage,
      state,
      limit,
      visible,
      editDialogVisible,
      deleteItem,
      showAddDialog,
      showEditDialog,
      dateFormat,
      handleSubmit,
      handleSizeChange,
      handleCurrentChange,
      showPermission,
      getIds
    }
  },
};
</script>

<style lang="scss" scoped>
.table {
  font: 15px/1.5 tahoma, arial, \5b8b\4f53;
  margin: 10px 20px;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /*box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);*/
  /*height: 680px;*/
  padding: 10px;
  /*background-color: rgba(0, 0, 0, .1);*/
  .page {
    margin-left: 50%;
    margin-top: 20px;
  }

  .el-dialog__body {
    span {
      margin-right: 10px;
    }

    .el-input {
      width: 75%;
    }

    .edit-name {
      margin-bottom: 10px;

    }
  }
}

.add-button {
  margin-left: 20px;
}
</style>