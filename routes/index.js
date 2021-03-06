const router = require('koa-router')();
const UserController = require('../controllers/user');

// index
router.get('/', async (ctx, next) => {
    ctx.body = '<h1>koa2 index</h1>';
});

// 用户注册
router.post('/register', UserController.register);
// 用户登录
router.post('/login', UserController.login);
// 查询用户列表
router.get('/users', UserController.users);

module.exports = router;
