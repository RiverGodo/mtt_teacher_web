var path = require('path')

module.exports = {
    base:{
        path: path.resolve(__dirname,'../server/dist'),
        assetsPath:'static'
    },
    dev:{
        publicPath:'/',
        port: 9999
    },
    prod:{
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/mtt_teacher_web/dist/'
    },
    prod2:{
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/mtt_teacher_web2/dist/'
    },
    test: {
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/mtt_teacher_web_test/dist/',
    },
    testxg: {
       // publicPath:'/',
       publicPath:'http://sfile.9mededu.com/mtt_teacher_test_web_xg/dist/', 
    }
}
