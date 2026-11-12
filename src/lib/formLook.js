// Per-form look options chosen in the design tab. Every key is optional: an unset key leaves the theme as it is.
const color = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : ''
const BUTTON_RADIUS = { square: 6, round: 16, pill: 999 }
// text-align, then the left and right margins that carry badges and rules along with the text
const TEXT_ALIGN = { left: ['left', '0', 'auto'], center: ['center', 'auto', 'auto'], right: ['right', 'auto', '0'] }
const isLight = hex => (parseInt(hex.slice(1, 3), 16) * 299 + parseInt(hex.slice(3, 5), 16) * 587 + parseInt(hex.slice(5, 7), 16) * 114) / 255000 > .6

// One-click starting point: cream canvas, numbered steps, roomy choices. Each value stays editable afterwards.
export const FRIENDLY_LOOK = {
  header: true, steps: 'dots', stepLabel: true, topBar: true, align: 'top',
  bg: '#fdf6e9', card: '#ffffff', radius: 28, btnShape: 'round', btnWide: true, size: 'lg',
}

export function getLookCSS(look = {}) {
  const css = []
  const bg = color(look.bg), card = color(look.card), title = color(look.titleColor)
  if (look.header != null) css.push(`body .fhead{display:${look.header ? 'flex' : 'none'}}`)
  if (look.steps === 'dots') css.push('body .steps{display:flex}#pw{display:none}#sc{display:none}')
  if (look.steps === 'bar') css.push('body .steps{display:none}#pw{display:block}')
  if (look.steps === 'none') css.push('body .steps{display:none}#pw{display:none}#sc{display:none}')
  if (look.stepLabel != null) css.push(`body .cn{display:${look.stepLabel ? 'inline-flex' : 'none'}}`)
  if (look.topBar != null) css.push(`body .card::before{display:${look.topBar ? 'block' : 'none'}!important;height:5px}`)
  if (look.align === 'top') css.push('body{justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}')
  if (look.align === 'center') css.push('body{justify-content:center}')
  if (bg) css.push(`body{background:${bg}!important}body::before,body::after{display:none!important}`)
  // A custom surface must keep its text readable whatever theme sits underneath.
  if (bg) css.push(isLight(bg)
    ? 'body .fhead b{color:#2b2622}body .fhead span,#gb,#sc,#kh{color:#7d746a}'
    : 'body .fhead b{color:#f3f4f6}body .fhead span,#gb,#sc,#kh{color:#b6bcc6}')
  if (card) css.push(`body .card{background:${card}!important}` + (isLight(card)
    ? ':root{--tx:#2b2622;--tx2:#6f665c;--tx3:#8c8276;--bd:rgba(60,45,20,.14);--bd2:rgba(60,45,20,.3);--bg2:#fff;--ls-bg:rgba(60,45,20,.04)}'
    : ':root{--tx:#f3f4f6;--tx2:#c3c8d0;--tx3:#9aa1ad;--bd:rgba(255,255,255,.14);--bd2:rgba(255,255,255,.3);--bg2:rgba(255,255,255,.06);--ls-bg:rgba(255,255,255,.04)}')
    + 'body .card,body .ct,body .stit,body .dt{color:var(--tx)!important;-webkit-text-fill-color:var(--tx)!important}body .ct,body .stit,body .dt{background:none!important;text-shadow:none!important}'
    + 'body .fi,body .ci{background:var(--bg2)!important;color:var(--tx)!important;border-color:var(--bd)!important}body .ci span,body .ci .oi{color:var(--tx)!important}body .cs,body .sdesc,body .dd,body .ls{color:var(--tx2)!important}')
  if (title) css.push(`body .ct,body .stit,body .dt{color:${title}!important;-webkit-text-fill-color:${title}!important;background:none!important}`)
  if (Number.isFinite(look.radius)) {
    const radius = Math.min(40, Math.max(0, Math.round(look.radius)))
    css.push(`body .card{border-radius:${radius}px!important}body .fi,body .ci,body .ls{border-radius:${Math.round(radius * .6)}px!important}`)
  }
  if (TEXT_ALIGN[look.textAlign]) {
    const [align, left, right] = TEXT_ALIGN[look.textAlign]
    css.push(`body .card{text-align:${align}}body .cn,body .stag{margin-left:${left};margin-right:${right};align-self:auto}body .fi{text-align:${align}}body .steps{justify-content:${look.textAlign === 'center' ? 'center' : look.textAlign === 'right' ? 'flex-end' : 'flex-start'}}body .ct::after{margin-left:${left};margin-right:${right}}`)
  }
  if (look.optAlign === 'left') css.push('body .ci{justify-content:flex-start;text-align:left}')
  if (look.optAlign === 'center') css.push('body .ci{justify-content:center;text-align:center}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:center}')
  if (look.optAlign === 'right') css.push('body .ci{justify-content:flex-end;text-align:right}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:flex-end}')
  if (look.btnAlign === 'left') css.push('body .cf{justify-content:flex-start}body .cf .nb{flex:0 1 auto;order:-1}body .cf .bb{margin-left:auto}body .sbt{width:auto}')
  if (look.btnAlign === 'center') css.push('body .cf{justify-content:center}body .cf .nb{flex:0 1 auto}body .sbt{width:auto}')
  if (look.btnAlign === 'right') css.push('body .cf{justify-content:space-between}body .cf .nb{flex:0 1 auto;margin-left:auto}body .sbt{width:auto}')
  if (BUTTON_RADIUS[look.btnShape] != null) css.push(`body .nb,body .sbt,body .dcta,body.single-page .single-submit{border-radius:${BUTTON_RADIUS[look.btnShape]}px!important}`)
  if (look.btnWide != null) css.push(look.btnWide ? 'body .nb{flex:1}body .sbt{width:100%;justify-content:center}' : 'body .nb{flex:0 1 auto}body .sbt{width:auto}')
  if (look.size === 'lg') css.push('body .ct{font-size:clamp(22px,5.6vw,27px)!important;line-height:1.35}body .cs,body .sdesc{font-size:15px}body .fi{font-size:17px;padding:17px 18px}body .ci{padding:19px 18px;gap:15px}body .ci span,body .ci .oi{font-size:16px;font-weight:600}body .cb{width:26px;height:26px}body .nb,body .sbt{font-size:17px;padding:18px 28px}body .od{font-size:14px}')
  return css.join('\n')
}
