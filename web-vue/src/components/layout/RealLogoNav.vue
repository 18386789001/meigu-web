<template>
  <nav style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #000000; border-bottom: 1px solid rgba(255, 255, 255, 0.08); z-index: 99999; display: flex; align-items: center; justify-content: space-between; padding: 0 32px;">

    <!-- 左侧Logo和菜单 -->
    <div style="display: flex; align-items: center; gap: 48px;">
      <!-- Logo区域 - 使用提供的base64图片 -->
      <div @click="goHome" style="display: flex; align-items: center; cursor: pointer;">
        <img
          :src="logoBase64"
          alt="MSX Logo"
          style="height: 32px; width: auto;"
        />
      </div>

      <!-- 导航菜单 -->
      <div style="display: flex; gap: 32px;">
        <span
          v-for="item in leftMenuItems"
          :key="item.key"
          :style="getMenuItemStyle(item.route)"
          @click="goTo(item.route)"
          @mouseover="handleHover($event, true)"
          @mouseout="handleHover($event, false)"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- 右侧功能菜单 -->
    <div style="display: flex; align-items: center; gap: 24px;">
      <!-- 功能图标 -->
      <div style="display: flex; align-items: center; gap: 16px;">
        <!-- 网络图标 -->
        <div
          @click="handleNetwork"
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>

        <!-- 钱包图标 -->
        <div
          @click="handleWallet"
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            <rect x="3" y="11" width="18" height="8" rx="1" ry="1"/>
          </svg>
        </div>

        <!-- 设置图标 -->
        <div
          @click="handleSettings"
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"/>
          </svg>
        </div>
      </div>

      <!-- SOL标识 -->
      <div style="padding: 6px 12px; background: rgba(255, 255, 255, 0.08); border-radius: 6px; color: rgba(255, 255, 255, 0.8); font-size: 12px; font-weight: 600; letter-spacing: 1px;">
        SOL
      </div>

      <!-- 连接钱包按钮 -->
      <button
        @click="connectWallet"
        style="height: 36px; padding: 0 16px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;"
        @mouseover="$event.target.style.background='#a8e628'"
        @mouseout="$event.target.style.background='#bcff2f'"
      >
        Connect Wallet
      </button>
    </div>

  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 您提供的logo base64数据
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQIAAABaCAYAAABT5Vh+AAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAtcSURBVHgB7Z2NlRu3EYA/+6WA6yBIBT5XkHUFcSoQXIHkCghVYLkCbipQUgGvAycVkB1IHVxuvNwn6o4kBsDsD0/zvTdPT8ddYBY/g8FggQXHcRzHcRzHcRzHcRzHcZwb467xd8dxLvA96yc8ye5Jfs5cJ7//cbzecZwC1mwIZITfPMn+STrlPffH6zc4jnPzdAwd+vFEYuae+Oz6EgPiON80a/MIxAv4jWEqEGgjHNPZ4tMFx7kZ3j7JJ74e1Vs8gufeQe5+x3EWJDCM3I8ZiZl0oiKNj7h34DgvWHpqIEE9ifR3zIOsLHgw0XFWQsfLYOAcHsHz6ULAcZzZPQLLYGArgcEYbHGD4DizIW75tWDg3B6BBxMdZ0YCumDgkoZglC3uHTjfIFNPDWRJcM5gYCsRDyY6jhkdgwF4NBKZUoRMnne0TT08mOg4RozBwEdDEYNyr8w/UL4akZPfcIPgOGrGNXpLLyBRRzLUY/QOIo7jXCRgEww8lR02ew0+Guu1xb0Dx3lBbn9AjRcQsSVi76m8w3FeEd9RR8cQWe+w43cGl/4z9oRj2m+w4/AkPx3/XQt3XD6p6cAyhAt/P2CHPLPEkf5xzO+el2Xx+ZinyH+e5IE2HYLyugN2XKvfqfI8yxTBQBmtO+ahwz6YKAZxLcekJS7r+Rvz85bL+lh4VR3Dc9V6pTvqPdAPyjz22LUPzUqcZX5n6ZgmGLhEJ0rYGgMpl8jyJK7r2TEfgesdNFFPwDb+s6cu9qNdIrcwwhtlXoEJiVBVwJdkx/JBt4B9kDN3ruLUJPINfi7Dm+skiTo6bONSp7KhjFCgS0c9QZlHYmJ64NFA1hhoi9h5OluWJZHXcY4pwkahR6KcN1BVL1Mag3fKdPfUG+G9Iv2PzEAPVYX6vJOs9cjxgN0zLklCp2fHdASlDoky7oHHmaR0sNJOU2qM8EaR7p6ZPOweqC1UUbLjNmh9KWrLsiT0dTKVUdaWX0JPwD7Ie03Ecy0pn7sC/Tr0dMo0Z5uS9tQVaGI+LyBi98JP4nUbApEpXMkNZW1jinSlE388ph8ZRneJ8O8K0ijVT+iU6e7R9YmAzrgkZqSnrBCl0LX7A6yIfCnoSDuB8lFoy7IkyvS1HElCYd4JPdp6kA5/l9GxV6b1B+VolxQ1RnirSGfPzPSsvzNEXhZ2oJ2IviEu9ewjibLOqNnVqUVbRqWGQBsbKJnX5wJ8O+oHMu2S4psraUTF/ZZ1p6bn9gzBKBvaCejKYKlnH0mUdcax0beyqcg3KdPWROVrniGeSWdPezwroFtSvNSRAzqjusjqW09ZJcuDzL2mHrmuT6CdyPVK2rIsifIO2dqoQmWeSZl+Yjr9R1e+ZafrObRLirsz9+4U921ZiJ66yhaFA/MQmUcfmYMmVlZBRxJ19dTiZu4r80zK9HtFWpE6pC7fMU1AW7ukeGrENorrpbwDC9FTV9mj4pHpicyrT+BlJ9iyLIn6etpRzqYhv6TMQxOAW+NuUO2S4miEg+JakbmD8F/RU1/hpw0tMB2xUJ+tkT7SCD9x+4agtEOFxrySLhvVM+1Z58tqHfq+sceuzCajp90QjLJhGmKFLp+wDSZuWZZE3vjlyiMo8tGMdrm8Ejoiurrcsk5joF1SzEnNcqY5HTYPM8oe+7cNY6M+gXYWddvIG4JIvmFqGlxuK3pS6JLQcUdZPUbWhejfepCvVfs0IWD/mucWuweMBvpIA1/rfggNibwh0DTMdCWPDp0hSQ15PGdHeceRaU5gHQSm/bjPIpzOiS1EKi3STlyZPkuQ0DUo8VxydXjOu8lNCU6nFgk7Q9Cy4UgM0zuW99a0S4rP5QMrJmAbNxBpfROwM9Zny4rcMSUJnSEQcg1zz0vvKDcliAW6JMqo7UjPn0meYSmjsKNc35vwUCPTHP21Fn1u7aDShL6jCrvM9afbZiN5w1miS8L++Uo7WWReY1+yS/GRGxuI5OGsIqOnlRSoI2DvrbToMyeJMkMQyE8ROvLxoXPlk7A3BGBv7CWtLfPV78/o9FrFKkENgXUFEzum8VbW7KolygyBkGuYUoa54GKs0CVRT2Aw9ntsDcIcr8WX6HxL3ugLEvbBxJYKSoa6jPpE1kmivMMKLR7dh0pdEu2IUY7Ynj25YTo2hbosssPQkoC9e95RT8D2o6wiW9ZXSYk6Q1A6dz01ineVuiRsCdgZhSlGYu2U4LnseAVE7Ny3SDsRe3cysh4S9WXYUf78oUGXxHQEhmeVlaga79R6JA60tbs5DpydnICNdxCxIfB6g4mJtjIsmSIk2nTJ3W9JpNxT2GGHxTcYOlaAxbproM0qRmyJ2AcTO5Yl0V6G2q/ptOqSmJ9AWZ1bBIY3BfnlynyyQPX3yutkzrSlbdQ7PMnfnuQ966DHXp833D7/5Pr3J+W3n7hNDk/y45P8S3l96ypCIG/wpDx/R5fWZFMErSEQIm3fihtJDB3w36yDxKDPAUc4cN04vue2y0o63jt0H9sN1COjt2Z68f6oz4Pi2shES4olhkAIDJ7BnnbvQEaeX1hHozowGINfcYMgSKzg4czfe5Z/9106WEcbYgQ0XsFfqUemBCFzTc+X8pS+oDFOmnSLKTUEI4HBGGxoo2dwM7Wu2tRIpaxJnyX56Yz8yrKIqy4xDBlpO9r4L9MRyY/cB772vJ7//xJiCLcsRM/1IIbFG1kd1wM5kXmJvL7vGkTmI2EXLOx4GfVvDZ5pNjElygno2k28cP9Oca+Iabyg1iM4JTAsj2xpc1keWF8wUQJLa4llfItIR5cGf84DCMe/1xqDvyuu0bjqz9Hsou2Pcg7tFEEMWYcRFoZgJGIbTHxgeT5T1xgcG8azBC5xf7wmUMYbdF5s6fRhQ36p/cD1KVbu91Nk8DVZUrQ0BEJgUG5HezBR5qRLBhMDNobNqeeguCbwZQdhrhNKp5HO2qPL+wE9kndSXJdbnhV6dJ5owGiK8BemoWOonESbq98zVEZiPqSxvGW68+4dPdJ2OuW18SgHhpH8f3zpcFKPPxzT0tZpScA4oPue4Xv0XoYMgvfkB9TI8KyzrOb0tL0RlbPUGubolB2v+7PokflI2ATirM+60LbZgJ6tMs1SOnT6Nu+NsJ4anCMwzOO2tCk75Vz9NCgVcNZEYtqlvnOUTEnFe4yK62rexnxA99Zh85LiHIZgJLLOOXfky6m3zvoYX2l+YB5+KcgroPNsWt7GTMp7O2bYpRixdb2sPlneQsD2QIu5Xe9zJF7f1KAkzRYR97r0fZi9It0d7XTon6NjYiLrOqi0Bcl3TacoWZF43YZACNhvI99RPjBtFOnusRvwtLESyXPyeFpgXQeVltJhf1KRlMdaVhcSr98QjATazi2UgUDqrqOcTplHxI6SU6SKpwjfUUfAPrDWM93OtnH92DIOIAEsefHjgfUQuF4novNcL0gFrutywK6uu6P8cJLvqXEeXwwblxUfaCuLe/LGf8zPkoC+zz0wIwl77yBiy8/Yf+sg4TjOVwTs52xb2r2NgH0w0NoLcpxXR8R+5N1Qx1tsg4E1EWXH+WYJLHsw6LgJxTL/NQUDHeemkA4pHdhyRM51xoD9kmCH4zjNJOw6ZszkFY3y8WCg40xAwCZoFzP5RIM8dngw0PkGmWOvwYHlzxbIIWu+8k6A6HnAcZxJCdQHE2Mm7ViZrgcDHWchOsqDiTGTZixMb48HAx3nT+bchnzKA8seVCr5/si6Xg92nG+agG7tP2bSiYo0dngw0HFesJRHcMqBYXSeMpjowUDHuSECl4OJMXNvvHCfHILiwUDHuUEiL4OJUXGPBwMd5xWSqDMEcp97AY7zigjozimQ3yUYaHF0uuM4K+Wu8XfHcRzHcRzHcRzHcRzHcRzHca7xfwlOiowWAkrsAAAAAElFTkSuQmCC'

// 英文菜单项
const leftMenuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: 'Crypto', route: '/market' },
  { key: 'invite', label: 'Invite', route: '/invite' },
  { key: 'rewards', label: 'Rewards', route: '/rewards' }
]

const getMenuItemStyle = (routePath) => {
  const isActive = route.path === routePath || route.path.startsWith(routePath)
  return {
    padding: '8px 0px',
    color: isActive ? '#bcff2f' : '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  }
}

const handleHover = (event, isHover) => {
  if (event.target.style.color !== 'rgb(188, 255, 47)') { // 如果不是激活状态
    event.target.style.color = isHover ? '#bcff2f' : '#ffffff'
  }
}

const goHome = () => {
  console.log('点击Logo')
  router.push('/')
}

const goTo = (path) => {
  console.log('跳转到:', path)
  router.push(path)
}

const handleNetwork = () => console.log('网络设置')
const handleWallet = () => console.log('钱包功能')
const handleSettings = () => console.log('设置')
const connectWallet = () => {
  console.log('连接钱包')
  router.push('/login')
}

console.log('RealLogoNav 组件已加载 - 使用真实logo图片')
</script>