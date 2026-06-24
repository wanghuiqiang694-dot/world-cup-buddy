// Cloudflare Pages Function: 读取/写入 fan-actions.json
// GET /api/fan-actions → 读取云端数据
// POST /api/fan-actions → 写入操作（批量）

// Token 从 Cloudflare 环境变量读取，不在代码中明文存放
const REPO = 'wanghuiqiang694-dot/world-cup-buddy';
const FILE_PATH = 'data/fan-actions.json';

function getApiUrl() { return `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`; }
function getToken(context) {
  // 从 Cloudflare Pages 环境变量读取 GITHUB_TOKEN
  if (context && context.env && context.env.GITHUB_TOKEN) return context.env.GITHUB_TOKEN;
  // 无环境变量时返回空，功能不可用
  return '';
}

function authHeaders(context) {
  return {
    'Authorization': `token ${getToken(context)}`,
    'User-Agent': 'Cloudflare-Workers'
  };
}

export async function onRequestGet(context) {
  try {
    const token = getToken(context);
    if (!token) {
      return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured', hasEnv: !!(context && context.env), hasToken: !!(context && context.env && context.env.GITHUB_TOKEN) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const resp = await fetch(getApiUrl(), {
      headers: authHeaders(context)
    });
    if (!resp.ok) {
      const errBody = await resp.text();
      return new Response(JSON.stringify({ error: 'GitHub API error', status: resp.status, detail: errBody.substring(0, 200) }), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const data = await resp.json();
    const content = JSON.parse(atob(data.content));
    return new Response(JSON.stringify(content), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { actions } = body; // [{ key, type }] 批量操作

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      return new Response(JSON.stringify({ error: 'No actions provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 读取当前文件
    const getResp = await fetch(getApiUrl(), {
      headers: authHeaders(context)
    });
    if (!getResp.ok) {
      return new Response(JSON.stringify({ error: 'Failed to read current data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const fileInfo = await getResp.json();
    const cloudData = JSON.parse(atob(fileInfo.content));

    // 应用操作
    actions.forEach(function(action) {
      if (!cloudData[action.key]) cloudData[action.key] = { flowers: 0, eggs: 0 };
      cloudData[action.key][action.type] = (cloudData[action.key][action.type] || 0) + 1;
    });

    // 写回
    const putResp = await fetch(getApiUrl(), {
      method: 'PUT',
      headers: {
        ...authHeaders(context),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `fan sync: ${actions.length} actions`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(cloudData)))),
        sha: fileInfo.sha
      })
    });

    if (!putResp.ok) {
      const errText = await putResp.text();
      return new Response(JSON.stringify({ error: 'Failed to update', detail: errText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify(cloudData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
