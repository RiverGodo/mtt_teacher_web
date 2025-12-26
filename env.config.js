module.exports = {
  apps: [{
      // 生产环境
      name: "mtt_teacher_web",
      // 项目启动入口文件
      script: "./server/prod.js",
      // 项目环境变量
      env: {
          "NODE_ENV": "production",
          "PORT": 8011
      }
  },
  {
      // 生产环境
      name: "mtt_teacher_web2",
      // 项目启动入口文件
      script: "./server/prod2.js",
      // 项目环境变量
      env: {
          "NODE_ENV": "production2",
          "PORT": 8014
      }
  }, 
  {
      // 测试环境
      name: "mtt_teacher_web_test",
      script: "./server/test.js",
      env: {
          "NODE_ENV": "test",
          "PORT": 8511
      }
  },
  {
      //学格测试环境
      name: "mtt_teacher_test_web_xg",
      script: "./server/testxg.js",
      env:{
        "NODE_ENV": "testxg",
        "PORT": 8513
      }
  }
  ]
}