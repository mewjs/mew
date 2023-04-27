SonarQube 的 Mew 插件更新
===

利用 SonarQube 的 eslint 相关插件，替换规则之后重新打包，可以在不影响其他功能的情况下，使 mew 支持 SonarQube 里面展示规则。


## 开发

SonarQube eslint 插件下载地址：[github](https://github.com/SonarSource/SonarJS/releases/tag/6.2.2.13315)

编译打包：

> npm run build

将生成的 `sonar-javascript-plugin-6.2.2.13315.jar` 替换到 SonarQube 服务的：

> /opt/sonarqube/extensions/plugins/sonar-javascript-plugin-6.2.2.13315.jar

重启服务完成更新。

**注意：不同版本的 SonarQube 文件路径可能不一样，需要仔细检查，原理一样。**

## 测试

测试环境：http://sonarqube.test-knode.fun/

更新测试环境插件：

```bash
ssh al-bj-knode-test02
cd /apps/home/worker/opt/sonarquobe/extensions/plugins
# 上传 sonar-javascript-plugin-6.2.2.13315.jar 包到当前目录，并替换
```

重启测试环境：

https://test-rancher.baijia.com/p/c-t5zgb:p-p85d8/workload/deployment:knode-fearch:sonarqube

重新部署。


## 发布

联系 sonarqube2 服务管理员 `liufei06` 完成上线替换。

线上访问地址：https://sonarqube2.baijia.com/