let env = process.env.NODE_ENV 
console.log(env)
export default env == 'production' ? '.sw.9mededu.com' : env == 'production2' ? '.sw2.9mededu.com' :env == 'testing' ? '.mtt.physicianedu.com' : env == 'testxg' ? '.mtt2.physicianedu.com' : '.mtt.physicianedu.com'