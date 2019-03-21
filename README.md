# HDFSKit

### 概述

HDFSKit是一款基于Electron、Vue、NodeJS开发的HDFS GUI客户端，前端使用了ElementUI组件库，可以在hadoop集群上传、删除以及查看文件目录和文件内容。



### 注意事项

1. HDFSKit使用hadoop集群的Webhdfs API对集群进行连接和操作，所以必须启用hadoop的webhdfs服务，向namenode和datanode的`hadoop安装目录/conf/hdfs-site.xml`进行如下配置。

```xml
<property>
    <name>dfs.webhdfs.enabled</name>
    <value>true</value>
</property>
```

2. **如果在同一台MacOS或Windows中的Docker中运行hadoop集群，并且包含多个datanode，同时未使用Docker toolbox，此时HDFSKit极有可能是只能查看集群中的目录和文件，而不能进行增删改操作。。**

   原因：

​	Docker在MacOS和Windows中运行hadoop集群时，集群与宿主机不在一个网络中，集群的节点（namenode和datanode）间相互通讯经常使用50070和50075端口，此端口只暴露在集群所在的bridge网络中，宿主机无法直接访问到这些节点的50070端口。在MacOS和Windows中，我们通常的做法是将节点端口映射为宿主机端口，例如：namenode的50070端口映射到宿主机的50070端口，datanode1和datanode2的50075端口分别映射到宿主机的50075和50076端口。

​	Webhdfs API中，文件的增删改操作涉及请求重定向，当HDFSKit提交一个文件上传请求，如下：

```http
http://localhost:50070/webhdfs/v1/<PATH>?op=CREATE
```

namenode会定位到文件所在的datanode，然后将此datanode的地址放在url中返回给HDFSKit，如下：

```http
http://93bdf9e341bc:50075/webhdfs/v1/<PATH>?op=CREATE
```

其中的`93bdf9e341bc`就是datanode的container id前12位。此时HDFSKit需要直接向此datanode发送请求，从而完成对文件的操作。但是，就像上面提到的，宿主机与集群节点并不在一个网络中，无法直接通过IP地址访问到节点，所以也无法在hosts中通过增加`93bdf9e341bc`和IP的映射关系进行访问。

3. **Linux系统单机运行hadoop集群无上述问题，因为宿主机与集群节点在同一网络中，但是需要配置/etc/hosts**

```bash
# 查看集群所在网络，获取各节点IP
docker inspect network [hadoop集群所在网络]

# 得到类似如下信息
"93bdf9e341bc69d7604ac14214094059622517d09e174c139d968519c75310fd": {
    "Name": "datanode1",
    "EndpointID": "bab887d9ba35a8de9277c846f0716419e19e2345c2f6f84b45cd3ccbec275169",
    "MacAddress": "02:42:ac:12:00:08",
    "IPv4Address": "172.18.0.8/16",
    "IPv6Address": ""
},
"a2dd75ad19c1b6839421b39afbfdda5e35cf0c9c413a1e8f6706f5719e3325a3": {
    "Name": "namenode",
    "EndpointID": "0a1203c5061aef4f0956e783a6282e74d2be141b4120533cb132fffefba463be",
    "MacAddress": "02:42:ac:12:00:06",
    "IPv4Address": "172.18.0.6/16",
    "IPv6Address": ""
},

# 编辑/etc/hosts
sudo vim /etc/hosts

# hosts，将container id与ip建立映射关系
a2dd75ad19c1	172.18.0.6
93bdf9e341bc	172.18.0.8
```



### 截图 

![image-20190321165325643](https://ws1.sinaimg.cn/large/006tKfTcgy1g1aimz0rnoj316g0u0dic.jpg)

![image-20190321141252171](https://ws1.sinaimg.cn/large/006tKfTcgy1g1adzyx48nj30s90izmy5.jpg)



### 安装程序

- [Mac OS](https://github.com/tyrival/HDFSKit/releases/download/1.0/HDFSKit-1.0.dmg)
- Windows (暂不提供，可自行编译)
- Linux (暂不提供，可自行编译)
- 

### 编译

首先需要安装新版的NodeJS，进入工程安装依赖包 `npm install` ，然后可使用如下命令：

```bash
# 生成安装程序
npm run build

# 生成绿色可执行文件
npm run build:dir

# 删除构建文件
npm run build:clean
```
