<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="staffTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{scope.row.gender}}</template>
        </el-table-column>
        <el-table-column label="职称" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="科室" align="center">
          <template slot-scope="scope">{{scope.row.dept_id}}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.role_id}}</template>
        </el-table-column>
        <el-table-column label="挂号级别" align="center">
          <template slot-scope="scope">{{scope.row.registration_rank_id}}</template>
        </el-table-column>
        <el-table-column label="是否排班" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.skd_flag">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleSelectRole(scope.$index, scope.row)">分配角色
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="staff"
               ref="adminForm"
               label-width="150px" size="small">
        <el-form-item label="用户名：">
          <el-input v-model="staff.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="staff.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="staff.password"  type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="职称：">
          <el-input v-model="staff.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="staff.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否排班：">
          <el-radio-group v-model="staff.skd_flag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="staff.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allocDialogVisible"
      width="30%">
      <el-select v-model="allocRoleId" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, createStaff, updateStaff, updateStatus, deleteStaff, getRoleByStaff, allocRole} from '@/api/user'
import { fetchALLRoleList } from '@/api/role';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};

const defaultStaff = {
  id: null,
  username: null,
  name: null,
  password: null,
  gender: null,
  skd_flag: null, //是否参与排班
  title: null,
  dept_id: null,
  role_id: null,
  registration_rank_id: null, //挂号级别id
  status: 1
};
export default {
  name: 'staffList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false, //对话框是否可见
      staff: Object.assign({}, defaultStaff),
      isEdit: false, //是否编辑
      allocDialogVisible: false,
      allocRoleId:null,
      allRoleList:[],
      allocStaffId:null
    }
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created() {
    this.getList();
    this.getAllRoleList();
  },
  methods: {
    // 将搜索框复位
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.staff = Object.assign({},defaultStaff);
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, {status: row.status}).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
        this.getList();
      });
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStaff(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.staff = Object.assign({},row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateStaff(this.staff.id,this.staff).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else {
          createStaff(this.staff).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        }
      })
    },
    // 给用户分配角色
    handleAllocDialogConfirm(){
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("StaffId", this.allocStaffId);
        params.append("roleId", this.allocRoleId);
        allocRole(params).then(response => {
          this.$message({
            message: '分配成功！',
            type: 'success'
          });
          this.allocDialogVisible = false;
        })
      })
    },
    //处理查询角色
    handleSelectRole(index,row){
      this.allocStaffId = row.id;
      this.allocDialogVisible = true;
      this.getRoleListByAdmin(row.id);
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    // 获取角色列表
    getAllRoleList() {
      fetchALLRoleList().then(response => {
        this.allRoleList = response.data;
      });
    },
    // 获取角色列表, 根据 staff id
    getRoleListByAdmin() {
      getRoleByStaff(adminId).then(response => {
        let allocRoleList = response.data;
        this.allocRoleId=[];
        if(allocRoleList!=null&&allocRoleList.length>0){
          this.allocRoleId = allocRoleList[0].id
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>
