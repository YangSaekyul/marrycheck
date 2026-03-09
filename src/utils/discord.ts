/**
 * 디스코드 웹훅을 통해 관리자에게 신규 유저 알림을 전송하는 유틸리티
 */

// Vercel 환경 변수에서 웹훅 URL을 가져옵니다. 
// 없으면 로컬에서는 실행되지 않게 방어 로직 추가.
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

interface UserPayload {
  email: string
  nickname: string
  gender: string
  role: string | null
}

export const sendDiscordNotification = async (user: UserPayload) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord Webhook URL is not set. Skipping notification.');
    return;
  }

  // 중복 알림을 막기 위한 로컬스토리지 디바운싱 (클라이언트 사이드에서 호출 시)
  if (typeof window !== 'undefined') {
    const hasNotified = localStorage.getItem('marrycheck_signup_notified');
    if (hasNotified === 'true') return;
  }

  const roleText = user.role === 'bride' ? '신부 👰‍♀️' : user.role === 'groom' ? '신랑 🤵‍♂️' : '미정';
  const genderText = user.gender === 'female' ? '여성' : user.gender === 'male' ? '남성' : user.gender;

  const payload = {
    embeds: [
      {
         title: "🎉 새로운 예비부부 유저가 가입했습니다!",
         description: "새로운 프로필 정보가 접수되었습니다.",
         color: 0xec4899, // Tailwind pink-500
         fields: [
           { name: "닉네임 (애칭)", value: user.nickname, inline: true },
           { name: "역할", value: roleText, inline: true },
           { name: "이메일", value: user.email, inline: false },
           { name: "성별 설정", value: genderText, inline: true }
         ],
         footer: { text: "Marry Check Admin Notification" },
         timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
       // 알림 성공 시 로컬스토리에 기록을 남겨 재차 알람 안가게 막음.
       if (typeof window !== 'undefined') {
         localStorage.setItem('marrycheck_signup_notified', 'true');
       }
    } else {
       console.error('Discord webhook failed', await response.text());
    }
  } catch (err) {
    console.error('Error sending discord notification', err);
  }
}
