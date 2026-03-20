// Google Identity Services로 시트 권한 요청 + 시트 자동 생성

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'

// GIS 토큰 클라이언트 초기화
function getTokenClient(callback) {
  return window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: SHEETS_SCOPE,
    callback,
  })
}

// 구글 시트 자동 생성
export async function createAndConnectSheet(formId, formTitle) {
  return new Promise((resolve, reject) => {
    const client = getTokenClient(async (tokenResponse) => {
      if (tokenResponse.error) {
        reject(new Error(tokenResponse.error))
        return
      }

      const accessToken = tokenResponse.access_token

      try {
        // 1. 시트 생성
        const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: { title: `${formTitle} - 응답` },
            sheets: [{ properties: { title: '응답' } }]
          })
        })

        if (!createRes.ok) throw new Error('시트 생성 실패')
        const sheet = await createRes.json()
        const sheetId = sheet.spreadsheetId
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`

        // 2. Apps Script 자동 설치 (헤더 자동 추가 스크립트)
        // → Apps Script API 대신 헤더는 첫 응답 때 자동 추가

        resolve({ sheetId, sheetUrl, accessToken })
      } catch (err) {
        reject(err)
      }
    })

    client.requestAccessToken()
  })
}

// 시트에 행 추가
export async function appendToSheet(sheetId, accessToken, headers, values) {
  // 헤더가 없으면 첫 행에 추가
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/응답!A1`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )
  const checkData = await checkRes.json()
  const hasHeader = checkData.values && checkData.values.length > 0

  const rows = hasHeader ? [values] : [headers, values]

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/응답!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: rows })
    }
  )
}
