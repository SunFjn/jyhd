以下的这些需要配置到json表中

assets/configs.obj
assets/as.obj
assets/mb.obj
assets/ss.obj
assets/icon/activity_preview/*.png
assets/icon/expression/*.png

js/main.js

res/atlas/*.png

res/skeleton/zhujue/nanzhu.png
res/skeleton/zhujue/nanzhu.sk
res/skeleton/zhujue/nvzhu.png
res/skeleton/zhujue/nvzhu.sk

SourceDirectory web.jyhd.ssche.cn 打包时才会用到这2个文件夹

SourceDirectory 目录的文件夹来获取哪些文件需要放到app本地(打包时就要放进去的)，
上面的几个文件则首次不需要放到安卓本地，但是需要写入版本配置文件中
****删除该目录资源需谨慎

SourceDirectory 目录的文件一般不会变动，如果变动了需要先执行 GetDestAssetsNames.js文件


web.jyhd.ssche.cn 文件夹则是要给到打包人员的资源（打包时需要放入app的初始资源），需要加上配置文件信息，只需要在打包时候才给（大小保持在15m左右）
****该目录下资源随时可以清理删除（最好不用了就清理掉）

后期更新只需要根据 Filenames.json 生成版本配置文件即可



