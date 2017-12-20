<template>
  <div>
    <span class="btn-span" @click="handleUpload">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-daoru"></use>
      </svg>导入
    </span>
    <form name="form1" id="form1">
      <input id="excel-upload-input" name="file" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChange($event)">
    </form>
  </div>
</template>

<script>
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        url: 'api/admin/customers',
        loading: false,
        file: null,
        excelData: {
          header: null,
          results: null
        }
      }
    },
    methods: {
      generateDate({
        header,
        results
      }) {
        this.excelData.header = header
        this.excelData.results = results
        this.loading = false
        this.$emit('on-selected-file', this.excelData)
      },
      handleUpload() {
        document.getElementById('excel-upload-input').click()
      },
      handkeFileChange(e) {
        let self = this
        this.file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', this.file);
        if(self.$router.history.current.fullPath === '/device-device') { //设备管理导入路径
          self.url = "api/admin/devices"
        }
        if(self.$router.history.current.fullPath === '/device-electricalControlledDevice') { //导入网关地址
          self.url = "api/admin/devices/ap"
        }

        self.$axios.post(self.url, formData, {
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            if(JSON.stringify(res.data.data).indexOf("message") > -1) {
              let str = '<p style="line-height:30px">提示：</p>'
              for(let i in res.data.data) {
                console.log('57', res.data.data[i])
                if(res.data.data[i].message) {
                  str += "<p>" + res.data.data[i].message + ",</p>"
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    message: str,
                    type: 'error'

                  });
                }
              }
            }else {
              self.$message.success("导入成功")
              self.$emit('getdata',{})
            }

          } else {
            self.$message.error("导入失败")
          }
          document.getElementById('excel-upload-input').value = "";//执行导入操作后清空input[file]的值
        })

      },
      /*fixdata(data) {
        return data
      },*/

      get_header_row(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r /* start in the first row */
        for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          var cell = sheet[XLSX.utils.encode_cell({
            c: C,
            r: R
          })] /* find the cell in the first row */
          var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if(cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      }
    }
  }
</script>

<style scoped>
  div {
    display: inline-block;
    /*margin-left:10px;*/
  }
  
  #excel-upload-input {
    display: none;
    z-index: -9999;
  }
  
  .btn-span {
    height: 36px;
    display: inline-flex;
    align-items: center;
    vertical-align: bottom;
    font-size: 14px;
    margin-left: 20px;
    cursor: pointer;
  }
  
  .btn-span>span {
    vertical-align: bottom;
  }
  
  .btn-span .icon {
    font-size: 20px;
    margin-right: 4px;
  }
</style>