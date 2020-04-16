const { Op } = require('sequelize');
const User = require('../model/user');

const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'LanYang9527';

const generate = (userInfo) => {
  return jwt.sign(userInfo, secret, {expiresIn: '24h'})  //token签名 有效期为1小时
};
// https://juejin.im/post/5a1ae1cdf265da431d3c6337
// https://segmentfault.com/a/1190000014727547
const login = async (ctx) => {
  console.log('*** login 111 ***> ', ctx.request.body);
  const { username } = ctx.request.body;
  try {
    const user = await User.getUser(username);
    console.log('*** login 222 ***> ', user);
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        ok: false,
        msg: '用户名错误',
      };
    } else {
      const token = generate({ username });
      // console.log('*** login ctrl ***> ', token);
      ctx.status = 200
      ctx.body = {
        ok: true,
        msg: '登录成功',
        token,
        data: {
          username
        }
      }
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      ok: false,
      msg: '登录失败',
    }
  }

};

const register = async (ctx) => {
    console.log('*** register ***> ', ctx.request.body);
    const { username, age, phone } = ctx.request.body;

    try {
        const res = await User.addUser(username, age, phone);
        // 返回结果
        ctx.response.status = 200;
        ctx.body = {
          ok: true,
          msg: '注册成功',
          token: generate({ username }),
          data: res
        };
    } catch (e) {
        // 返回结果
        ctx.response.status = 500;
        ctx.body = {
          ok: false,
          msg: '注册失败' + '|' + e
        }
    }
};

const users = async (ctx) => {
  try {
    const res = await User.getUsers();
    console.log(' ctrl users --> ', res);
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res;
  } catch (e) {
    // 返回结果
    ctx.response.status = 500;
    ctx.body = 'get users failed' + e;
  }
}

module.exports = {
    login,
    register,
    users
};
