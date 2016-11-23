/**
 * Created by kk on 2016/11/23.
 */

var AStar = drogon.Class.extend({
    ctor: function(){
        this.openList = [];
        this.closeList = [];
    },
    //查找核心算法
    _search: function(srcNode, destNode){
        this.openList.push(srcNode);
        var resultList = [];
        var isFind = false;
        var node;
        while((node = this.findBest(this.openList))){
            //判断是否找到目标点
            if(this.isSameNode(node, destNode)){
                isFind=true;
                break;
            }

            var _this = this;
            this.traverse(node, function(newNode, cost){
                _this.checkNode(newNode, destNode, cost);
            })

            //从开启列表中删除
            this.openList.splice(this.openList.indexOf(node),1);
            //添加到关闭列表中
            this.closeList.push(node);
        }
        if(isFind){
            this.getPath(resultList, node);
        }
        return resultList;
    },
    //查询此路(x,y)是否能走通
    checkNode: function(node, eNode, cost){
        //查找地图中是否能通过
        if(!this.isMapCanThrough(node)){
            this.closeList.push(node);
            return false;
        }
        //查找关闭列表中是否存在
        if(this.isListContains(this.closeList, node)!=-1){
            return false;
        }
        //查找开启列表中是否存在
        var index = this.isListContains(this.openList, node);
        if(index > -1){
            //G值是否更小，即是否更新G，F值
            if((node.parent.g+cost)< this.openList[index].g){
                this.countG(node, eNode, cost);
                this.countF(node);
                this.openList[index]=node;
            }
        }else{
            //添加到开启列表中
            node.parent = node.parent;
            this.count(node, eNode, cost);
            this.openList.push(node);
        }
        return true;
    },
    //从终点往返回到起点
    getPath: function(resultList,node){
        if(node.parent!=null){
            this.getPath(resultList, node.parent);
        }
        resultList.push(node);
    },
    //节点比较类
    compare: function(o1, o2) {
        return o1.f-o2.f;
    },
    //计算G,H,F值
    count: function(node, eNode, cost){
        this.countG(node, cost);
        this.countH(node, eNode);
        this.countF(node);
    },
    //virtual function
    findBest: function(list){
    },
    //virtual function
    traverse: function(node, callback){
    },
    //virtual function
    isSameNode: function(node, eNode){
    },
    //virtual function
    isMapCanThrough: function(node){
    },
    //virtual function
    isListContains: function(list, node){
    },
    //virtual function
    countG: function(node, cost){
    },
    //virtual function
    countH: function(node, eNode){
    },
    //virtual function
    countF: function(node){
    },
});

var GridAStar = (function(){
    //节点类
    var Node = drogon.Class.extend({
        ctor: function(x, y, parent){
            this.x = x;
            this.y = y;
            this.parent = parent;//父节点
            this.g = 0; //当前点到起点的移动耗费
            this.h = 0;//当前点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
            this.f = 0; //f=g+h
        },
        toString: function(){
            return "("+this.x+","+this.y+","+this.f+")";
        },
    });

    var GridAStar = AStar.extend({
        ctor: function(options){
            this._super();
            this.map = options.map;
            this.row = options.row;
            this.column = options.column;
            this.COST_STRAIGHT = options.COST_STRAIGHT;
            this.COST_DIAGONAL = options.COST_DIAGONAL;
        },
        //从起点(x1,y1)查找目标(x2,y2),（-1：错误，0：没找到，1：找到了）
        search: function(x1,y1,x2,y2){
            if(x1 < 0 || x1 >= this.row || x2 < 0 || x2 >= this.row || y1 < 0 || y1 >= this.column || y2 < 0 || y2 >= this.column){
                return -1;
            }
            if(this.map[x1][y1] == 0 || this.map[x2][y2] == 0){
                return -1;
            }
            var srcNode = new Node(x1, y1, null);//起点
            var dstNode = new Node(x2, y2, null);//目标

            var resultList = this._search(srcNode, dstNode);
            if(resultList.length == 0){
                return 0;
            }
            console.log(resultList);
            for(var i = 0; i < resultList.length; i++){
                this.map[resultList[i].x][resultList[i].y] = 2;
            }
            return 1;
        },
        findBest: function(list){
            if(list.length === 0)
                return null
            var node = list[list.length-1];
            for(var i = list.length-2; i >= 0; i--)
                if(list[i].f < node.f)
                    node = list[i];
            return node;
        },
        traverse: function(node, callback){
            //上
            if((node.y-1)>=0){
                var newNode = new Node(node.x,node.y-1, node);
                callback(newNode, this.COST_STRAIGHT)
            }

            //下
            if((node.y+1)< this.column){
                var newNode = new Node(node.x,node.y+1, node);
                callback(newNode, this.COST_STRAIGHT);
            }

            //左
            if((node.x-1)>=0){
                var newNode = new Node(node.x-1,node.y, node);
                callback(newNode, this.COST_STRAIGHT);
            }
            //右
            if((node.x+1)< this.row){
                var newNode = new Node(node.x+1,node.y, node);
                callback(newNode, this.COST_STRAIGHT);
            }

            //左上
            if((node.x-1)>=0&&(node.y-1)>=0){
                var newNode = new Node(node.x-1,node.y-1, node);
                callback(newNode, this.COST_DIAGONAL);
            }

            //左下
            if((node.x-1)>=0&&(node.y+1)< this.column){
                var newNode = new Node(node.x-1,node.y+1, node);
                callback(newNode, this.COST_DIAGONAL);
            }

            //右上
            if((node.x+1)< this.row&&(node.y-1)>=0){
                var newNode = new Node(node.x+1,node.y-1, node);
                callback(newNode, this.COST_DIAGONAL);
            }

            //右下
            if((node.x+1)< this.row&&(node.y+1)< this.column){
                var newNode = new Node(node.x+1,node.y+1, node);
                callback(newNode, this.COST_DIAGONAL);
            }
        },
        isSameNode: function(node, eNode){
            return node.x==eNode.x&&node.y==eNode.y
        },
        isMapCanThrough: function(node){
            return this.map[node.x][node.y]!=0
        },
        //集合中是否包含某个元素(-1：没有找到，否则返回所在的索引)
        isListContains: function(list, node){
            var i,n;
            for(i=0;i< list.length;i++){
                n=list[i];
                if(n.x==node.x&&n.y==node.y){
                    return i;
                }
            }
            return -1;
        },
        //计算G值
        countG: function(node,cost){
            if(node.parent == null){
                node.g = cost;
            }else{
                node.g = node.parent.g+cost;
            }
        },
        //计算H值
        countH: function(node,eNode){
            node.fh= (Math.abs(node.x-eNode.x)+Math.abs(node.y-eNode.y))*10;
        },
        //计算F值
        countF: function(node){
            node.f = node.g+node.h;
        }
    })
    return GridAStar;
})();

var test = function(){
    var map=[//地图(1可通过 0不可通过)
        [1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,0,1,0,1,1,1],
        [1,1,0,1,0,1,0,1,1,1],
        [1,1,1,1,0,1,0,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1]];
    var COST_STRAIGHT = 10;//垂直方向或水平方向移动的路径评分
    var COST_DIAGONAL = 14;//斜方向移动的路径评分
    var row=6;//行
    var column=10;//列
    var astar = new GridAStar({
        map: map,
        COST_STRAIGHT: COST_STRAIGHT,
        COST_DIAGONAL: COST_DIAGONAL,
        row: row,
        column: column,
    });
    var flag= astar.search(3, 2, 3, 8);
    if(flag==-1){
        alert("传输数据有误！");
    }else if(flag==0){
        alert("没找到！");
    }else{
        var str = "";
        for(var x=0;x< 6;x++){
            for(var y=0;y< 10;y++){
                if(map[x][y]==1){
                    str += "* ";
                }else if(map[x][y]==0){
                    str += "W ";
                }else if(map[x][y]==2){//输出搜索路径
                    str += "a ";
                }
            }
            str += "\n";
        }
        console.log(str);
    }
}
test();