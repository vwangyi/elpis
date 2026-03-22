async function getHero() {
  // 发出get请求，得到响应对象
  const resp = await fetch('https://study.duyiedu.com/api/herolist')
  const body = await resp.json()
  const heroes = body.data
  const ul = document.querySelector('.list')
  ul.innerHTML = heroes
    .map(
      (h) => `<li>
  <a
    href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml"
    target="_blank"
  >
    <img
      src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg"
      alt=""
    />
    <span>${h.cname}</span>
  </a>
</li>`,
    )
    .join('')
}

getHero()
