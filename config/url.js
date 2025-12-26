let env = process.env.NODE_ENV
const PRO_URL = 'http://api.9mededu.com/mtt_teacher/'
const PRO_URL2 = 'http://api.9mededu.com/mtt_teacher2/'
// const TEST_URL = 'http://api.9mededu.com/mtt_teacher_test/'
const TEST_URL = 'http://api.9mededu.com/mtt_teacher_test/'
const TEST_XG_URL = 'http://api.9mededu.com/mtt_teacher_test2/'


// const DEV_URL = 'http://api.9mededu.com/mtt_teacher2/'
// const DEV_URL = 'http://api.9mededu.com/mtt_teacher_test/'
// const DEV_URL = 'http://192.168.3.11:5588/mtt_teacher_dev/'
const DEV_URL = "http://api.9mededu.com/mtt_teacher_test2/"
// const DEV_URL = 'http://192.168.6.200:5011/mtt_teacher/'
// const DEV_URL = 'http://api.9mededu.com/mtt_teacher_test/'
// const DEV_URL = 'http://192.168.6.93:5511/mtt_teacher_dev/'

export default env == 'production' ? PRO_URL : env == 'production2' ? PRO_URL2 : env == 'testing' ? TEST_URL : env == 'testxg' ? TEST_XG_URL : DEV_URL
