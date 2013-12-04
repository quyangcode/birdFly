

function PageList(pageSize,index,totalItem,valueList){
    //每页大小
    this.pageSize = pageSize;
    //总记录数
    this.totalItem = totalItem;
    //实际对象列表
    this.valueList = valueList;
    this.index = index;
    this.getIndex = function(){
        if(this.index <= 0){
            return 1;
        }else if(this.index > this.getTotalPage() && this.getTotalPage() > 0){
            return this.getTotalPage();
        }else{
            return this.index;
        }
    };
    this.getStartItem = function(){
        var startItem = this.index * this.pageSize - this.pageSize;
        if(startItem >= this.totalItem){
            startItem = this.getTotalPage() * this.pageSize  - this.pageSize;
            if(startItem < 0){
                return 0;
            }
        }
        return startItem;
    };
    this.getTotalPage = function(){
        if (this.totalItem > 0) {
            return parseInt(this.totalItem / this.pageSize) + (this.totalItem % this.pageSize > 0 ? 1 : 0);
        }
        return 0;
    };
    this.isFirst = function(){
        return this.index <= 1;
    };
    this.isEnd = function(){
        return this.index * this.pageSize >= this.totalItem;
    };
}

module.exports = PageList;


