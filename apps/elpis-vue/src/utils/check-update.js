let lastScript = []; // 上一次的script地址
const scriptReg = /\<script.*src=["'](?<src>[^"']+)/gm;

async function getNewScript() {
  const html = await fetch('/?_timestamp=' + Date.now()).then(res => res.text());
  scriptReg.lastIndex = 0;
  let result = [];
  let match;
  while ((match = scriptReg.exec(html))) {
    result.push(match.groups.src);
  }
  return result;
}

async function needUpdate() {
  const newScript = await getNewScript();
  if (!lastScript) {
    lastScript = newScript;
    return false;
  }
  let result = false;
  if (lastScript.length !== newScript.length) {
    result = true;
  }
  for (let i = 0; i < lastScript.length; i++) {
    if (lastScript[i] !== newScript[i]) {
      result = true;
      break;
    }
  }
  lastScript = newScript;

  return result;
}

const duration = 2000;
function autoRefresh() {
  setTimeout(async () => {
    const willUpdate = await needUpdate();
    if (willUpdate) {
      const result = confirm('刷新');
      if (result) {
        location.reload();
      }
    }
    autoRefresh();
  }, duration);
}
autoRefresh();
