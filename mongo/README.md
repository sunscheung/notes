## 打开mongo配置cmd
##数据文件 services.msc
dbpath=D:\mongodb\data\db  
##日志文件
logpath=D:\mongodb\data\log\db.log  
## 创建用户
db.createUser(
     {
       user:"admin",
       pwd:"admin",
       roles:[{role:"root",db:"admin"}]
     }
  )

db.createUser(
     {
       user:"admin",
       pwd:"admin888",
       roles:[{role:"readWrite",db:"nodercms"}]
     }
  )

:: 定位到D盘
d:
:: 切换到mongodb的数据库目录
cd mongodb\data\db
:: 删除数据库锁定记录文件
if exist mongod.lock del mongod.lock missing
:: 切换到mongodb的bin目录
cd ..\..\bin
:: 配置mongodb的文档存储目录
mongod --dbpath "D:\mongodb\data\db"
:: 切换到mongodb的bin目录
cd mongod\bin
mongod.exe
