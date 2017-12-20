/**
 * New node file
 */
/*
 * 
 {
  url:self.url.maintainOrderList,
  params:v, 
  pageIndex:self.cur_page - 1,
  pageSize:self.page_size,
 }
 * */
const getData = (self,option) => {
//let self = self;
console.log('common15',self)
  self.$axios.get(option.url, {
    params: {
      params: option.params,
      pageIndex: option.pageIndex,
      pageSize: option.pageSize
    },
    headers: { //get添加请求头
      'Auth-Token': sessionStorage.getItem('spaceflight_token')
    }
  }).then((res) => {
    if(res.data.success) {
      self.totalCount = res.data.data.recordCount
      self.tableData = res.data.data.records;
      console.log(res.data.data)
    } else if(res.data.code == 200) {
      self.$router.push('/login')
    } else {
      self.$message.error(res.data.message)
    }
  })
}

export {
  getData
}
