var now = new Date;
function createtime() {
  now.setTime(now.getTime() + 1e3);
  var e = new Date("06/10/2024 00:00:00"), // 修改为2024年6月10日
    t = Math.trunc(234e8 + (now - e) / 1e3 * 17),
    a = (t / 1496e5).toFixed(6),
    o = new Date("06/10/2024 00:00:00"), // 修改为2024年6月10日
    n = (now - o) / 1e3 / 60 / 60 / 24,
    r = Math.floor(n),
    i = (now - o) / 1e3 / 60 / 60 - 24 * r,
    s = Math.floor(i);
  1 == String(s).length && (s = "0" + s);
  var d = (now - o) / 1e3 / 60 - 1440 * r - 60 * s,
    l = Math.floor(d);
  1 == String(l).length && (l = "0" + l);
  var g = (now - o) / 1e3 - 86400 * r - 3600 * s - 60 * l,
    b = Math.round(g);
  1 == String(b).length && (b = "0" + b);
  let c = "";
  c = s < 18 && s >= 9 ? `<div style="font-size:20px;color:#E93F3C;font-family: 宋体;font-weight:bold">焚膏油以继晷,恒兀兀以穷年</div><div style="font-size:13px;font-weight:bold">本站居然运行了 ${r} 天 ${s} 小时 ${l} 分 ${b} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 旅行者 1 号当前距离地球 ${t} 千米，约为 ${a} 个天文单位 🚀<br>再看看那个光点，它就在这里·这是家园·这是我们——你所爱的每个人・你认识的每一个人·你听说过的每一个人·曾经有过的每一个人·都在它上面度过他们的一生⭐</div>` : `<div style="font-size:20px;color:#E93F3C;font-family: 宋体;font-weight:bold">春风得意马蹄疾,一日尽看长安花</div><br> <div style="font-size:13px;font-weight:bold">本站居然运行了 ${r} 天 ${s} 小时 ${l} 分 ${b} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 旅行者 1 号当前距离地球 ${t} 千米，约为 ${a} 个天文单位 🚀</div>`,
    document.getElementById("workboard") && (document.getElementById("workboard").innerHTML = c)
}
setInterval((() => { createtime() }), 1e3);