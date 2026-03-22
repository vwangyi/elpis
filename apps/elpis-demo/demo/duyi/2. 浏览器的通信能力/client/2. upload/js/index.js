const $ = document.querySelector.bind(document)
const doms = {
  img: $('.preview'),
  container: $('.upload'),
  select: $('.upload-select'),
  selectFile: $('.upload-select input'),
  progress: $('.upload-progress'),
  cancelBtn: $('.upload-progress button'),
  delBtn: $('.upload-result button'),
}

function showArea(areaName) {
  doms.container.className = `upload ${areaName}`
}

function setProgress(value) {
  doms.progress.style.setProperty('--percent', value)
}

doms.select.onclick = function () {
  doms.selectFile.click()
}

doms.selectFile.onchange = () => {
  const file = doms.selectFile.files[0]
  const reader = new FileReader() // 文件读取器
  reader.addEventListener('load', (e) => {
    // 文件读取完成后会触发该事件
    doms.img.src = e.target.result
  })
  reader.readAsDataURL(file)
  // 请求
  const xhr = new XMLHttpRequest()
  // 配置请求
  xhr.open('POST', 'http://localhost:9527/upload/single')
  xhr.upload.addEventListener('progress', (e) => {
    const percent = Math.floor((e.loaded / e.total) * 100)
    setProgress(percent)
  })
  xhr.addEventListener('load', (e) => {
    // 响应完成了
    showArea('result')
  })
  doms.cancelBtn.onclick = () => {
    xhr.abort()
    showArea('select')
  }
  const form = new FormData()
  form.append('avatar', file)
  // 发送请求
  xhr.send(form)

  showArea('progress')
}
