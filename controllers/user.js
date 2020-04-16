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

const login = async (ctx) => {
    let userToken = {
        name: 'kenan'
    };
    const token = generate(userToken);
    // console.log('*** login ctrl ***> ', token);
    ctx.body = {
        message: '获取token成功',
        code: 200,
        token
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
