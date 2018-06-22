/**
 * 分页;
 * that type：Object page的实例
 * page type：Number 当前的页数
 * size type：Number 需要获取数据的大小
 * resData type：Array 服务端返回的数据
 * total type：Number 服务端返回的数据的大小
 * list type：Array 原始数据
 * original type: String 原始数据的属性名
 */

const pageView = (that, page, size, original, list, resData, total) => {
   // 总页数
   let totalPage = total % size == 0 ? total / size : Math.ceil(total / size) ;
   // console.log(original,list,resData)
   if(page == 1) list = [];
   
   if(page >= totalPage){
      that.setData({
         [original]: list.concat(resData),
         hasMoreData: false
      })
   }else{
      that.setData({
         [original]: list.concat(resData),
         hasMoreData: true,
         page: that.data.page + 1
      })
   }
}

export default pageView;