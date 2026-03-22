<script setup>
import CountDown from "@/components/CountDown/CountDown.vue";
</script>

<template>
  <div
    style="
      font-family: &quot;Segoe UI&quot;, Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
    "
  >
    <div style="text-align: center; margin-bottom: 30px">
      <h1 style="color: #2c3e50">邮箱验证码</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)">
      <p style="color: #555; line-height: 1.6; font-size: 16px">尊敬的用户，您好！</p>
      <p style="color: #555; line-height: 1.6; font-size: 16px">您正在进行的操作需要验证邮箱，您的验证码为：</p>

      <div style="text-align: center; margin: 40px 0">
        <div
          style="
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
          "
        >
          ${code}
        </div>
      </div>

      <p style="color: #555; line-height: 1.6; font-size: 16px">
        验证码
        <strong style="color: #e74c3c">5分钟</strong> 内有效，请及时使用。
      </p>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee">
        <p style="color: #95a5a6; font-size: 14px">温馨提示：</p>
        <ul style="color: #95a5a6; font-size: 14px; padding-left: 20px">
          <li>请勿将验证码告知他人</li>
          <li>如非本人操作，请忽略此邮件</li>
          <li>如有疑问，请联系客服</li>
        </ul>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #95a5a6; font-size: 12px">
      <p>© ${new Date().getFullYear()} WANGYI. 保留所有权利.</p>
    </div>
  </div>
</template>
