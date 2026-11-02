// Original cut-paper interpretations of late-1860s dress and provincial interiors.
// The year is the adaptation's art direction, not an asserted date in the novel.
export const WARDROBE = {
  narrator: '深绿长外套、浅色马甲、圆顶硬帽与皮革文书袋。',
  stepan: '旧式长礼服、宽领巾、怀表链与灰白鬓发。',
  varvara: '高领深色日装、宽幅长裙、披肩、胸针与盘发。',
  pyotr: '收窄的深色外套、低调马甲与便于行动的靴子。',
  stavrogin: '剪裁整齐的长礼服、浅色马甲与窄领结。',
  shatov: '磨旧的短外套、朴素衬衣、长裤与工作靴。',
  kirillov: '朴素马甲、衬衣与深色长裤，衣饰克制。',
  shigalyov: '高领旧外套、眼镜与随身携带的理论手稿。',
  liza: '收腰日装、后部略有体积的长裙、小披肩与束起的头发。',
  marya: '褪色长裙、旧披肩与发间纸花；坐在木椅上。',
  lebyadkin: '磨损的军式长外套、肩章、军帽与皮靴。',
};

function face(id) {
  const old = id === 'stepan',
    bald = id === 'shigalyov',
    female = ['varvara', 'liza', 'marya'].includes(id);
  return `<path d="M40 28Q47 22 57 28L61 36 65 40 60 43 58 52 44 54 37 45Z" fill="#d5b796"/>
    ${bald ? '<path d="M36 37Q33 19 50 21Q63 22 62 35L58 30Q42 23 39 39Z" fill="#a59a80"/>' : female ? '<path d="M37 44Q28 29 38 23 53 16 61 29L59 36 53 28 41 32Z" fill="#67584a"/><ellipse cx="32" cy="32" rx="7" ry="9" fill="#67584a"/>' : `<path d="M35 42Q28 21 47 20 63 19 63 32L56 30 53 26 41 31 40 46Z" fill="${old ? '#a19e8e' : '#595748'}"/>`}
    <path d="M55 36h3M57 45h3" stroke="#675d4b" stroke-width="1.1"/>
    ${old ? '<path d="M38 36L42 50 47 54 44 43ZM57 43L55 51 50 52 51 46Z" fill="#a19e8e"/>' : ''}
    ${['stepan', 'shigalyov'].includes(id) ? '<g fill="none" stroke="#646452" stroke-width="1"><ellipse cx="47" cy="37" rx="5" ry="3.5"/><ellipse cx="58" cy="37" rx="4" ry="3.5"/><path d="M51 37h3M37 35l5 2"/></g>' : ''}
    ${['lebyadkin', 'shatov'].includes(id) ? '<path d="M43 44Q52 40 59 45L57 48 49 46 43 48Z" fill="#76604b"/>' : ''}`;
}

function gentleman(id, color) {
  const officer = id === 'lebyadkin',
    scholar = id === 'stepan',
    plain = id === 'shatov',
    vest = id === 'kirillov';
  const vestColor = scholar ? '#c0ae8c' : id === 'stavrogin' ? '#d7c9af' : '#b1aa8c';
  const body = vest
    ? `<path d="M33 59L42 54 56 54 68 62 64 114 36 114Z" fill="${color}"/><path d="M29 60L18 99 25 103 39 73ZM66 61L82 97 75 102 59 75Z" fill="#d9d0b8"/><path d="M35 58L45 67 54 56 61 62 55 114H42Z" fill="#a6aa92"/>`
    : `<path d="M30 59L42 53 58 53 69 61 70 89 81 ${plain ? '116' : '135'} 59 ${plain ? '120' : '140'} 49 111 39 ${plain ? '121' : '140'} 20 ${plain ? '116' : '135'} 28 87Z" fill="${color}"/>
 <path d="M42 55L50 66 58 55 60 101 40 101Z" fill="${vestColor}"/><path d="M35 58L43 55 47 72 38 79 47 95 32 91ZM63 58L57 55 53 72 61 78 52 96 67 91Z" fill="#243a35" opacity=".33"/>
 <path d="M29 61L18 101 22 116 30 115 30 102 40 72ZM67 60L78 88 85 112 78 116 68 95 59 72Z" fill="${color}"/><path d="M23 113L30 112 31 121 24 123ZM78 111L85 110 86 121 79 123Z" fill="#c5a689"/>`;
  const hat =
    id === 'narrator'
      ? '<path d="M31 28Q29 10 44 9 58 8 61 27L68 29 67 33 27 33 26 30Z" fill="#454c40"/><path d="M32 25h28v4H32Z" fill="#746e54"/>'
      : officer
        ? '<path d="M31 28L31 17Q45 12 62 19L61 28 69 31 59 34 33 32Z" fill="#596049"/><path d="M32 24h30v5H32Z" fill="#8f7357"/>'
        : '';
  return `<path d="M35 104L48 107 47 157 35 157 34 130ZM49 107L63 104 66 158 54 158 49 132Z" fill="#4c5147"/><path d="M34 154h13v9H29l-1-4ZM54 155h12l7 8H53Z" fill="#3f473f"/>
 ${body}<path d="M43 54L50 63 57 54 56 68 44 68Z" fill="#eee6d2"/><path d="M46 59L53 60 56 65 49 64 44 68Z" fill="${scholar ? '#9e6e53' : '#57594a'}"/>
 <g fill="#a9956e"><circle cx="50" cy="77" r="1.4"/><circle cx="50" cy="87" r="1.4"/><circle cx="50" cy="97" r="1.4"/></g>
 ${scholar || id === 'stavrogin' ? '<path d="M52 83q7 14 12 3" stroke="#c3ad7c" stroke-width="1.2" fill="none"/>' : ''}
 ${officer ? '<path d="M28 59L39 57 41 63 27 66ZM58 57L70 60 72 66 59 63Z" fill="#b7a078"/><path d="M49 72V128" stroke="#b3a285" stroke-width="1"/><g fill="#c4b08a"><circle cx="45" cy="81" r="1.4"/><circle cx="57" cy="81" r="1.4"/><circle cx="45" cy="93" r="1.4"/><circle cx="57" cy="93" r="1.4"/></g>' : ''}
 ${id === 'shigalyov' ? '<path d="M66 90L85 88 89 118 69 120Z" fill="#88765b"/><path d="M70 94L82 93 85 114 73 116Z" fill="#e1d1ac"/><path d="M74 99l7-1M75 103l7-1M76 107l7-1" stroke="#9c9478" stroke-width="1"/>' : ''}
 ${id === 'narrator' ? '<path d="M32 66L70 112" stroke="#9e7954" stroke-width="3"/><path d="M59 104L85 110 80 135 54 129Z" fill="#99704d"/><path d="M60 107L83 112 79 123 57 118Z" fill="#b38b60"/><circle cx="70" cy="120" r="1.5" fill="#d9c493"/>' : ''}
 ${face(id)}${hat}`;
}

function lady(id, color) {
  if (id === 'marya')
    return `<path d="M21 92V166M76 90V166M19 103H78M23 84V127H73V84" fill="none" stroke="#8d7a5a" stroke-width="5"/><path d="M37 53L59 54 69 88 67 104 79 146 30 150 24 119 34 88Z" fill="${color}"/><path d="M38 56L31 89 53 101 64 76 59 54 49 74Z" fill="#b6ab8b"/><path d="M26 105Q52 96 69 107L74 143 32 146Z" fill="#8e8e77"/><path d="M33 107L41 139M48 107L53 142M61 107L65 139" stroke="#c4b99a" stroke-opacity=".5" fill="none"/><path d="M34 75L28 99 43 111 47 106 38 95 44 80ZM60 75L68 98 57 112 52 108 58 95 52 83Z" fill="#b2a382"/><path d="M44 106h12v8H44Z" fill="#d5b796"/>${face(id)}<path d="M38 24l-6-8 5-5 5 8 5-4 3 5-7 6Z" fill="#b48971"/><path d="M38 23l4-6" stroke="#d7b492"/>`;
  const grand = id === 'varvara';
  return `<path d="M39 56L57 56 65 83 60 92Q76 113 ${grand ? '91' : '86'} 158Q52 171 11 159L26 112 36 91 30 80Z" fill="${color}"/>
 <path d="M38 91Q27 121 21 156M46 95L41 164M55 94Q64 126 70 162M61 99Q76 128 81 156" fill="none" stroke="#f1e7cd" stroke-opacity=".24" stroke-width="1"/>
 <path d="M13 152Q51 165 88 152L91 158Q49 174 11 159Z" fill="#3c3c35" opacity=".17"/>
 ${grand ? '<path d="M36 54L25 62 21 89 38 82 51 96 66 81 78 89 71 62 58 54 48 72Z" fill="#515a4e"/><path d="M28 65L37 78 49 87 61 77 69 65" fill="none" stroke="#b9ad87" stroke-width="1.3"/><path d="M23 86l5 7 5-9M66 84l6 9 5-7" fill="none" stroke="#807f63" stroke-width="2"/>' : '<path d="M36 55L24 66 28 80 44 71 61 80 72 68 58 55 48 67Z" fill="#c2ad8e"/><path d="M31 96Q54 114 72 105L83 137Q60 130 45 122Z" fill="#b38d74"/>'}
 <path d="M29 71L23 104 35 117 40 113 33 101 40 78ZM65 73L75 100 61 113 57 109 65 97 56 80Z" fill="${grand ? '#515a4e' : color}"/>
 <path d="M36 112L43 111 47 117 40 120ZM56 109L62 110 61 117 54 116Z" fill="#d5b796"/>
 <path d="M42 53L49 59 56 53 54 63 44 63Z" fill="#e9dfc7"/><ellipse cx="49" cy="66" rx="3.5" ry="4" fill="#b89c66"/><ellipse cx="49" cy="66" rx="1.7" ry="2.4" fill="#e0d0a5"/>
 ${face(id)}${grand ? '<path d="M33 23Q45 13 58 25" fill="none" stroke="#b6aa87" stroke-width="2"/>' : '<path d="M32 28L28 25 31 21 36 25Z" fill="#a97561"/>'}`;
}

export function figure(id = 'narrator', color = '#4a5c50') {
  return `<svg class="costume-figure" viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="168" rx="34" ry="4" fill="#514c3b" opacity=".15"/><g class="paper-person">${['varvara', 'liza', 'marya'].includes(id) ? lady(id, color) : gentleman(id, color)}</g></svg>`;
}

const defs = `<defs>
 <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".66" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
 <filter id="shadow" x="-15%" y="-15%" width="140%" height="140%"><feDropShadow dx="2" dy="4" stdDeviation="2" flood-color="#574835" flood-opacity=".16"/></filter>
 <pattern id="wall" width="45" height="56" patternUnits="userSpaceOnUse"><path d="M22 4q12 9 0 22-12-13 0-22ZM22 28q13 6 0 19-13-13 0-19Z" stroke="#a08d6c" stroke-width="1" fill="none" opacity=".22"/><path d="M0 0V56" stroke="#c1b194" stroke-width=".5"/></pattern>
 <pattern id="planks" width="140" height="32" patternUnits="userSpaceOnUse"><path d="M0 31H140M0 0V32M77 0V10M19 12h47M94 23h31" stroke="#746d54" stroke-opacity=".2" stroke-width="1" fill="none"/></pattern>
 <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#615b46" stroke-width=".7" opacity=".15"/></pattern>
 <pattern id="brick" width="40" height="22" patternUnits="userSpaceOnUse"><path d="M0 0H40M0 11H40M20 0V11M0 11V22M40 11V22" stroke="#a6a286" stroke-width=".6" fill="none" opacity=".45"/></pattern>
 </defs>`;

function candle(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-13 0H13M0-3V-20M-6-19H6" stroke="#9c8458" stroke-width="4"/><path d="M-3-20H3V-50H-3Z" fill="#ebdbb0"/><path class="candle-flame" d="M0-65Q-7-54 0-51 8-54 0-65Z" fill="#c8994e"/><path d="M0-49V-53" stroke="#76694a"/></g>`;
}
function samovar(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#shadow)"><path d="M-24 0L-18-10H18L24 0Z" fill="#a0824e"/><path d="M-17-11L-15-29Q-39-44-22-72H22Q39-44 15-29L17-11Z" fill="#ba9a5c"/><path d="M-18-69H18L25-75H-25Z" fill="#9e824f"/><path d="M-8-76V-83H8V-76M-23-58Q-50-65-42-40L-29-36M23-58Q48-65 43-40L30-36" stroke="#8f794f" fill="none" stroke-width="4"/><path d="M-7-39H7L17-33 12-29 4-33H-7Z" fill="#836e44"/><path d="M-12-62Q-18-48-9-34M-11-23H10" fill="none" stroke="#dfc98c" stroke-width="3"/><path d="M-5-87h17l4 6H-8Z" fill="#a38a59"/><path d="M9-89q-6-10 0-19" stroke="#e5dec7" opacity=".7" fill="none" stroke-width="2"/></g>`;
}
function candleChandelier() {
  return `<g stroke="#9c845f" stroke-width="3" fill="none"><path d="M673 0V109M673 100Q620 138 592 109M673 100Q726 138 754 109M673 107V143M592 109V90M754 109V90M673 143V123"/><path d="M582 111H602M744 111H764M662 145H684"/></g><g fill="#e7d6aa"><path d="M589 70h6v21h-6ZM751 70h6v21h-6ZM670 102h6v23h-6Z"/></g><g fill="#bf9757"><path d="M592 58q-6 8 0 11 6-3 0-11ZM754 58q-6 8 0 11 6-3 0-11ZM673 90q-6 8 0 11 6-3 0-11Z"/></g>`;
}
function windowShape(x, y, w = 160, h = 290, night = false, arch = false) {
  return `<g transform="translate(${x} ${y})"><path d="M0 ${h}V${arch ? w / 2 : 0}${arch ? `A${w / 2} ${w / 2} 0 0 1 ${w} ${w / 2}` : `H${w}`}V${h}Z" fill="#b8ad93"/><path d="M9 ${h - 8}V${arch ? w / 2 : 9}${arch ? `A${w / 2 - 9} ${w / 2 - 9} 0 0 1 ${w - 9} ${w / 2}` : `H${w - 9}`}V${h - 8}Z" fill="${night ? '#8fa4a4' : '#c6d3cc'}"/><path d="M13 ${h * 0.72}Q${w * 0.35} ${h * 0.57} ${w - 13} ${h * 0.69}V${h - 13}H13Z" fill="${night ? '#87948b' : '#afbca5'}"/><path d="M${w / 2} 10V${h}M5 ${h * 0.35}H${w - 5}M5 ${h * 0.69}H${w - 5}" stroke="#ece2c9" stroke-width="7"/><path d="M-8 ${h}H${w + 8}" stroke="#eee5d1" stroke-width="11"/><path d="M16 13h10v${h * 0.55}" stroke="#eee6cd" stroke-width="2" opacity=".6"/></g>`;
}
function iconCorner(x, y) {
  return `<g transform="translate(${x} ${y})"><path d="M-30-39H31V34H-30Z" fill="#88714f"/><path d="M-24-33H25V27H-24Z" fill="#ae9563"/><circle cx="0" cy="-10" r="13" fill="#cbb577"/><path d="M-10 23Q-9 2 0 0 10 1 13 23Z" fill="#6b7560"/><ellipse cx="0" cy="-7" rx="6" ry="9" fill="#b68e69"/><path d="M-36 37H39" stroke="#81694b" stroke-width="5"/></g>`;
}
function stove(x, y, wealthy = false) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0H127V310H0Z" fill="${wealthy ? '#d0d0ba' : '#cecbb4'}"/><path d="M0 0H127V310H0Z" fill="url(#brick)"/><path d="M-8-3H136V13H-8ZM-9 301H138V317H-9Z" fill="#b4b69c"/><path d="M29 211H91V275H29Z" fill="#6c6b55"/><path d="M35 217H85V270H35Z" fill="#535b4c"/><circle cx="76" cy="244" r="3" fill="#b8a273"/>${wealthy ? '<path d="M32 69h64M32 139h64" stroke="#a1ad94" stroke-width="2"/><g fill="none" stroke="#96a389"><path d="M62 35q25 17 0 33-25-16 0-33ZM62 105q25 17 0 33-25-16 0-33Z"/></g>' : ''}</g>`;
}
function salon() {
  return `<path fill="#e9deca" d="M0 0H1500V482H0Z"/><path fill="url(#wall)" d="M0 0H1500V482H0Z"/>
 <path d="M0 27H1500M0 36H1500M0 58H1500" stroke="#bdae8e" stroke-width="3"/><path d="M0 365H1500V481H0Z" fill="#c5bea6"/><path d="M0 365H1500M0 480H1500" stroke="#a5a58c" stroke-width="7"/>
 ${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 155 + 13} 381h128v80H${i * 155 + 13}Z" fill="none" stroke="#aead94" stroke-width="2"/>`).join('')}
 <path d="M0 485H1500V650H0Z" fill="#bdb69b"/><path d="M0 485H1500V650H0Z" fill="url(#planks)"/>
 ${windowShape(1035, 107, 159, 316, false, true)}${windowShape(1275, 107, 159, 316, false, true)}
 <path d="M1005 82H1464V96H1005Z" fill="#8a725a"/><path d="M1014 96Q1010 175 1020 225L993 431 1042 431 1061 99ZM1190 98L1185 430 1234 430Q1208 221 1222 96ZM1262 96L1245 430 1290 430 1299 97ZM1436 95L1408 429 1461 429Q1432 210 1454 96Z" fill="#7e8b76"/><path d="M1020 114L1033 309M1205 112L1204 335M1275 109L1271 332M1442 109L1434 327" stroke="#b6b69a" stroke-width="2" opacity=".6"/>
 ${stove(29, 172, true)}
 <g filter="url(#shadow)"><path d="M192 119H315V303H192Z" fill="#a28a5e"/><path d="M199 126H308V296H199Z" fill="#d1ba84"/><path d="M207 134H300V288H207Z" fill="#a1aa91"/><ellipse cx="253" cy="185" rx="23" ry="30" fill="#b99e7e"/><path d="M232 180Q227 147 252 150 278 147 276 177L261 164 241 172Z" fill="#666a59"/><path d="M214 276Q222 213 250 214 283 214 295 276Z" fill="#526051"/><path d="M245 216L254 235 264 217 264 264H244Z" fill="#c9b68f"/><path d="M198 128H308V296H198Z" fill="url(#hatch)"/></g>
 <g filter="url(#shadow)"><path d="M358 332H585V424H358Z" fill="#675f4c"/><path d="M368 339H578V411H368Z" fill="#84775c"/><path d="M357 327H587V339H357Z" fill="#6d654e"/><path d="M350 414H593V432H350Z" fill="#a39979"/><path d="M355 432V496M582 432V496" stroke="#756b51" stroke-width="11"/>
 ${Array.from({ length: 22 }, (_, i) => `<path d="M${360 + i * 10} 415v13" stroke="#d5ccb0" stroke-width="7"/>`).join('')}<path d="M460 310L477 305 477 329 460 334Z" fill="#d7c8a4"/><path d="M479 305L496 310 496 334 479 329Z" fill="#e7d7b7"/></g>
 <g filter="url(#shadow)"><path d="M629 412Q629 380 655 380H870Q895 380 895 412V477H624Z" fill="#798773"/><path d="M628 438H892V477H628Z" fill="#919b83"/><path d="M615 425Q604 407 618 404 637 406 638 440M894 437Q892 406 910 405 920 412 907 427" stroke="#7b7557" stroke-width="9" fill="none"/><path d="M642 479L635 510M882 479L889 510" stroke="#777053" stroke-width="10"/><path d="M665 389L668 436M753 389V437M846 390L842 436" stroke="#bcc0a1" stroke-width="1.5"/></g>
 <path d="M454 541Q714 495 1002 541L1030 584Q714 633 427 583Z" fill="#a79d7f"/><path d="M468 548Q719 508 989 548L1009 577Q716 620 447 577Z" fill="none" stroke="#cec1a1" stroke-width="3"/><path d="M489 557L508 569 528 552 550 567 573 548" fill="none" stroke="#bfb38f" stroke-width="2"/>
 <path d="M148 429H421L439 448H133Z" fill="#977958"/><path d="M159 449L149 521H164L183 449M393 449L415 522H430L415 448" fill="#79684d"/>
 <path d="M215 413L286 407 307 427 235 436Z" fill="#dfceaa"/><path d="M221 416L276 413M230 422L288 419" stroke="#afa083" stroke-width="1"/><path d="M335 409h17v21h-17Z" fill="#565b49"/><path d="M342 410L356 369 361 366 360 379 346 412Z" fill="#e8dcc1"/>
 <path d="M933 438H1059L1072 454H921Z" fill="#a1875f"/><path d="M941 454L932 510M1053 454L1064 510" stroke="#837152" stroke-width="8"/>${samovar(993, 437, 0.72)}
 <path d="M936 434h18v-13h-18Z" fill="#ece1c5"/><path d="M953 423q13-3 9 7h-9" stroke="#e8dcc0" fill="none" stroke-width="3"/>
 ${candleChandelier()}<path d="M1463 450L1454 510H1491L1483 450Z" fill="#ac8963"/><path d="M1472 450Q1413 359 1431 328 1464 355 1472 450Q1467 367 1496 344 1512 389 1472 450Z" fill="#728266"/>
 <path d="M0 609Q382 588 752 612T1500 605V650H0Z" fill="#9d9d80" opacity=".21"/>`;
}

function timberHouse(x, y, w, h, color = '#b5b79c', night = false) {
  const windows = [0.17, 0.49, 0.8]
    .map((t) => {
      const xx = w * t;
      return `<g transform="translate(${xx} ${h * 0.27})"><path d="M-21-7H21V58H-21Z" fill="#e1d4b2"/><path d="M-15 0H15V49H-15Z" fill="${night ? '#c4b87f' : '#7e9692'}"/><path d="M-26-10L0-26 26-10ZM-25 58H25V65H-25Z" fill="#e5dac0"/><path d="M0 0V49M-15 23H15" stroke="#d5c8a5" stroke-width="3"/><path d="M-24-6V53M24-6V53" stroke="#a59b7a" stroke-width="2"/></g>`;
    })
    .join('');
  return `<g transform="translate(${x} ${y})" filter="url(#shadow)"><path d="M0 0H${w}V${h}H0Z" fill="${color}"/>
 ${Array.from({ length: Math.floor(h / 17) }, (_, i) => `<path d="M0 ${i * 17 + 8}H${w}" stroke="#817d62" opacity=".26"/>`).join('')}
 <path d="M-15 3L${w * 0.5} -${h * 0.43} ${w + 15} 3Z" fill="#7e8270"/><path d="M-8-2L${w * 0.5} -${h * 0.39} ${w + 8}-2" stroke="#d1c8a8" stroke-width="4" fill="none"/><path d="M${w * 0.75}-${h * 0.25}h15v-${h * 0.25}h-15Z" fill="#a39476"/>
 <path d="M-2 ${h}H${w + 3}" stroke="#87836b" stroke-width="7"/>${windows}<path d="M${w * 0.05} ${h * 0.77}H${w * 0.95}" stroke="#d1c4a0" stroke-width="3"/></g>`;
}
function plasterHouse(x, y, w, h, assembly = false, night = false) {
  const windows = Array.from(
    { length: 5 },
    (_, i) =>
      `<g transform="translate(${w * 0.12 + i * w * 0.185} 44)"><path d="M-13-5H13V48H-13Z" fill="#efe1c1"/><path d="M-8 1H8V43H-8Z" fill="${night ? '#cbbf93' : '#8b9d94'}"/><path d="M0 1V43M-9 19H9" stroke="#d3c7a9" stroke-width="2"/><path d="M-18-8H18" stroke="#bdab86" stroke-width="4"/></g>`,
  ).join('');
  return `<g transform="translate(${x} ${y})" filter="url(#shadow)"><path d="M0 0H${w}V${h}H0Z" fill="${assembly ? '#d2c4a6' : '#c4c1a5'}"/><path d="M-12 0L${w * 0.5} -49 ${w + 12} 0Z" fill="#808873"/><path d="M-8 5H${w + 8}M-3 15H${w + 3}M0 ${h - 12}H${w}" stroke="#e4d8bc" stroke-width="5"/>${windows}
 <path d="M${w * 0.46} ${h * 0.6}H${w * 0.62}V${h}H${w * 0.46}Z" fill="#8e9179"/><path d="M${w * 0.46 + 6} ${h * 0.6 + 6}H${w * 0.62 - 6}V${h - 5}H${w * 0.46 + 6}Z" fill="#767f6b"/>
 ${assembly ? `<path d="M${w * 0.21} 24V${h - 12}M${w * 0.38} 24V${h - 12}M${w * 0.72} 24V${h - 12}M${w * 0.89} 24V${h - 12}" stroke="#e9dec1" stroke-width="12"/><path d="M${w * 0.15} 18H${w * 0.95}" stroke="#eee2c6" stroke-width="8"/><path d="M${w * 0.16} ${h - 8}H${w * 0.95}V${h + 4}H${w * 0.16}Z" fill="#b5ad90"/><path d="M${w * 0.37} ${h + 4}H${w * 0.7}V${h + 12}H${w * 0.37}Z" fill="#ccc1a1"/>` : ''}</g>`;
}
function church(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity=".78"><path d="M-35 0V-95H35V0Z" fill="#b4bba6"/><path d="M-45-97L0-122 45-97Z" fill="#879983"/><path d="M-13-120V-152H13V-120Z" fill="#d2cdb5"/><path d="M-17-152Q-27-168 0-186 27-168 17-152Z" fill="#8a9a85"/><path d="M0-186V-204M-8-198H8M-6-192H6" stroke="#81917b" stroke-width="2"/><path d="M-9-6V-48Q0-63 9-48V-6Z" fill="#8c9e8a"/><path d="M-20-69h12v-17h-12ZM8-69h12v-17H8Z" fill="#8c9e8a"/><path d="M47 0V-143H79V0Z" fill="#c6c5ad"/><path d="M40-144L63-172 86-144Z" fill="#8c9c87"/><path d="M63-172V-191M57-185H69" stroke="#89947d" stroke-width="2"/><path d="M57-122q6-10 12 0v21H57Z" fill="#859783"/></g>`;
}
function birch(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-7 0L-4-254 4-255 8 0Z" fill="#e2ddc5"/><path d="M-3-58L-27-105M1-111L27-161M-2-170L-21-208M0-222L14-245" stroke="#a3a68d" stroke-width="3"/><path d="M-4-22h10M-5-49h7M0-84h6M-4-120h6M-5-154h8M0-188h5M-3-216h6" stroke="#6e7b68" stroke-width="3"/><g fill="#b9ac72" opacity=".85"><path d="M-31-107Q-57-129-41-163-15-143-31-107ZM-24-179Q-51-204-29-227-4-203-24-179ZM22-153Q8-187 30-205 48-178 22-153ZM11-222Q-2-248 16-266 35-245 11-222Z"/></g></g>`;
}
function fence(x, y, w) {
  return `<g transform="translate(${x} ${y})" fill="#96977b">${Array.from({ length: Math.floor(w / 24) }, (_, i) => `<path d="M${i * 24} 0l5-8 5 8v63H${i * 24}Z"/>`).join('')}<path d="M-3 13H${w}v7H-3ZM-3 43H${w}v6H-3Z" fill="#a7a58a"/></g>`;
}
function leaves(seed = 0) {
  return `<g class="autumn-leaves" fill="#ae9662" opacity=".75">${Array.from(
    { length: 19 },
    (_, i) => {
      const x = ((i * 151 + seed * 53) % 1450) + 20,
        y = 520 + ((i * 43) % 106);
      return `<path d="M${x} ${y}q8-8 15-1-7 8-15 1Z" transform="rotate(${i * 31} ${x} ${y})"/>`;
    },
  ).join('')}</g>`;
}
function carriage(x, y) {
  return `<g transform="translate(${x} ${y})" opacity=".75"><path d="M0-45H82L93-12H-8Z" fill="#6f7562"/><path d="M9-71H63L77-47H0Z" fill="#91977f"/><path d="M15-66H56L65-48H7Z" fill="#b6b9a0"/><g stroke="#666e5a" stroke-width="3" fill="none"><circle cx="8" cy="0" r="18"/><circle cx="77" cy="0" r="18"/><path d="M8-18V18M-10 0H26M77-18V18M59 0H95M90-10L136-20"/></g></g>`;
}
function street(mood) {
  const night = mood === 'night',
    fire = mood === 'fire',
    dawn = mood === 'dawn';
  const sky = night ? '#b5c4c5' : fire ? '#e5d8bc' : '#e7e8d9';
  return `<path d="M0 0H1500V650H0Z" fill="${sky}"/><circle cx="1170" cy="110" r="${night ? 28 : 47}" fill="${night ? '#ede3bf' : '#f3e5bd'}"/>
 <path d="M0 282Q277 222 557 273T1112 265 1500 250V650H0Z" fill="${night ? '#a2b3ac' : '#bec7b1'}"/><path d="M0 330Q360 294 624 320T1190 307 1500 302V650H0Z" fill="${night ? '#94a79d' : '#b2bfa6'}"/>
 ${church(715, 326, 0.88)}<path d="M0 354Q295 333 521 348T1048 343 1500 334V402H0Z" fill="${night ? '#9aafb1' : '#b6cbca'}"/>
 <path d="M0 375Q343 350 637 374T1184 366 1500 360" stroke="#d4d7bf" stroke-width="3" fill="none"/>
 <path d="M0 400Q248 360 541 396T1057 383 1500 385V650H0Z" fill="#b7b89b"/>
 ${timberHouse(49, 313, 244, 177, night ? '#9fae9c' : '#bab598', night)}${plasterHouse(399, 279, 303, 214, false, night)}${plasterHouse(833, 238, 368, 255, true, night)}${timberHouse(1260, 338, 201, 157, '#a6b09b', night)}
 ${fence(289, 426, 104)}${fence(1205, 439, 64)}
 <path d="M0 500Q360 465 697 491T1186 481 1500 489V650H0Z" fill="${night ? '#b8bda8' : '#d4c6a6'}"/><path d="M0 539Q422 486 826 529T1500 518" stroke="#b9ad8d" stroke-width="3" fill="none"/><path d="M0 557Q418 503 829 547T1500 537" stroke="#b9ad8d" stroke-width="2" fill="none"/>
 <path d="M492 508Q563 495 625 507L621 513 504 519Z" fill="#a8b9b1" opacity=".7"/><path d="M1050 566Q1126 552 1200 568L1187 578 1062 577Z" fill="#a7b8ad" opacity=".65"/>
 ${carriage(709, 464)}${birch(26, 591, 1.5)}${birch(1465, 584, 1.45)}
 <path d="M0 611Q250 566 485 603T987 600 1500 593V650H0Z" fill="#a7ac8c"/>
 <path d="M0 642Q396 609 719 637T1500 631V650H0Z" fill="#979e7f" opacity=".55"/>${leaves(night ? 3 : fire ? 7 : 1)}
 <g stroke="#8b9b88" stroke-width="1.5" opacity=".6" fill="none"><path d="M518 126q10-9 20 0 10-9 20 0M571 102q8-7 16 0 8-7 16 0M595 139q8-7 16 0 8-7 16 0"/></g>
 ${fire ? `<g class="fire-smoke"><path d="M1058 236Q1001 167 1067 117T1123-17H1237Q1159 67 1190 116T1152 243Z" fill="#a49780" opacity=".42"/><path d="M1076 254Q1030 196 1068 166L1084 204 1108 146 1122 204 1147 174Q1171 215 1143 258Z" fill="#bb8860"/><path d="M1091 250L1106 201 1128 250Z" fill="#e2bc76"/></g><g fill="#67705c" opacity=".55">${[111, 143, 175, 744, 773].map((x, i) => `<circle cx="${x}" cy="${441 + (i % 2) * 4}" r="6"/><path d="M${x - 4} ${448 + (i % 2) * 4}h8l6 33h-20Z"/>`).join('')}</g><g transform="translate(886 334) rotate(-3)"><path d="M0 0H98V67H0Z" fill="#efe3c6"/><path d="M7 7H91V60H7Z" fill="none" stroke="#ad9a71"/><text x="49" y="25" text-anchor="middle" font-size="10" fill="#7a795d" font-family="serif">ЛИТЕРАТУРНЫЙ</text><text x="49" y="41" text-anchor="middle" font-size="12" fill="#7a795d" font-family="serif">ВЕЧЕРЪ</text><path d="M24 48H75" stroke="#b7a784"/></g>` : ''}
 ${night ? `${candle(581, 359, 0.52)}${candle(1323, 401, 0.5)}<g transform="translate(748 494)"><path d="M0 0V-105" stroke="#706f55" stroke-width="5"/><path d="M-14-139H14L10-108H-10Z" fill="#d3c396" stroke="#8a8060" stroke-width="2"/><path d="M-18-140L0-153 18-140Z" fill="#7d7e62"/><path d="M-5-113L0-128 5-113Z" fill="#b79757"/></g>` : ''}
 ${dawn ? '<path d="M0 0H1500V650H0Z" fill="#f5e9cf" opacity=".11"/><g transform="translate(580 494)"><path d="M0-13H162V0H0ZM12-47H150V-36H12Z" fill="#8b9076"/><path d="M15 0V23M148 0V23M18-40V0M145-40V0" stroke="#7e836d" stroke-width="7"/></g>' : ''}`;
}
function humbleRoom(meeting = false) {
  return `<path d="M0 0H1500V650H0Z" fill="#d9d3bc"/><path d="M0 0L140 66H1360L1500 0Z" fill="#c0baa0"/><path d="M0 0L140 66V475L0 557Z" fill="#b7b59c"/><path d="M1360 66L1500 0V556L1360 475Z" fill="#c6c4aa"/><path d="M140 67H1360V477H140Z" fill="${meeting ? '#c8c8af' : '#d9cfb4'}"/>
 <path d="M0 0H1500V22H0ZM138 55H1364V74H138Z" fill="#8f8b6d"/><path d="M136 65V480M1364 65V480M779 65V136" stroke="#a19a78" stroke-width="12"/>
 <path d="M0 553L140 477H1360L1500 553V650H0Z" fill="#b7ac8b"/><path d="M0 477H1500V650H0Z" fill="url(#planks)"/>
 ${windowShape(190, 155, 131, 253, meeting)}${stove(1193, 173)}${iconCorner(1096, 160)}
 <path d="M722 163H865V478H722Z" fill="#8b8e71"/><path d="M732 173H854V474H732Z" fill="#a4a58a"/><path d="M743 184H843V332H743ZM743 345H843V461H743Z" fill="none" stroke="#8b9478" stroke-width="2"/><path d="M834 339h12" stroke="#796c4d" stroke-width="5"/>
 <path d="M361 108L365 233 398 219 405 140 484 140 481 111Z" fill="#e8ddc0" opacity=".65"/><path d="M139 441H1358V478H139Z" fill="#a5a083"/>
 <path d="M69 487H365V508H69ZM81 455H350V467H81Z" fill="#8e7a58"/><path d="M86 508V541M347 508V541M91 456V487M344 456V487" stroke="#7e7051" stroke-width="8"/>
 <path d="M442 425L921 422 960 451 419 458Z" fill="#a78d61"/><path d="M451 455L437 546M915 455L932 546" stroke="#80714e" stroke-width="12"/>
 <path d="M512 423L565 414 611 435 550 445ZM738 420L805 414 842 432 775 441Z" fill="#e7d9b6"/><path d="M526 424L559 421M535 430L573 426M752 421L798 418M763 427L808 423" stroke="#aa9c79" stroke-width="1"/>
 ${candle(meeting ? 672 : 891, 421, 0.93)}
 ${meeting ? Array.from({ length: 10 }, (_, i) => `<g transform="translate(${497 + i * 36} ${i === 0 ? 362 : 396})" fill="${i === 0 ? '#ad7450' : '#e4d4ac'}"><circle r="5"/><path d="M-4 6H4L7 21H3V32H-1V22H-6Z"/></g>`).join('') : `<path d="M928 430H1160V491H928Z" fill="#8d9376"/><path d="M932 410H996V433H932Z" fill="#e9dfc4"/><path d="M991 428Q1040 418 1160 434V474H991Z" fill="#bab499"/><path d="M930 490V521M1158 490V521" stroke="#827153" stroke-width="9"/><path d="M999 439L1005 470M1015 438L1021 472M1031 439L1037 472" stroke="#8e9a83" stroke-width="3"/><path d="M1178 465h-20v17h20Z" fill="#aa8b60"/>`}
 <path d="M348 182H415V234H348Z" fill="#8d7b57"/><path d="M355 189H408V228H355Z" fill="#d2c09a"/><path d="M360 202h42M360 209h30M360 216h37" stroke="#a39b7b" stroke-width="1"/>
 ${meeting ? '<g transform="translate(1021 361)"><path d="M-24 0H24V12H-24Z" fill="#877759"/><path d="M-18 12V112M18 12V112" stroke="#817254" stroke-width="6"/><path d="M-26-55H26V-45H-26ZM-21-45V0M21-45V0" stroke="#8d7e5e" stroke-width="5"/></g>' : `<path d="M381 287h-33v-52h33Z" fill="#a18c67"/><path d="M365 286v20" stroke="#786c4e" stroke-width="2"/><path d="M351 309h28v11h-28Z" fill="#918265"/>`}
 <path d="M0 621Q470 593 830 619T1500 612V650H0Z" fill="#999d80" opacity=".25"/>`;
}

export function sceneSVG(mood = 'salon') {
  const body =
    mood === 'salon'
      ? salon()
      : mood === 'house'
        ? humbleRoom()
        : mood === 'meeting'
          ? humbleRoom(true)
          : street(mood);
  const labels = {
    salon: '1869 年秋，贵族沙龙的茶炊、钢琴、瓷砖炉与烛台',
    house: '俄国省城的简朴住处、木床、炉子与墙角圣像',
    meeting: '烛光下的手稿、十张纸人与地下聚会长桌',
    fire: '秋日省城的文学会场、马车、火光与人群',
    night: '河岸省城的夜色、点亮的窗户与路灯',
    dawn: '清晨河岸、木屋、灰泥宅邸与落叶',
  };
  return `<svg class="scene-art" viewBox="0 0 1500 650" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${labels[mood] || labels.dawn}">${defs}<g filter="url(#paper)">${body}</g></svg>`;
}

export function propSVG(kind = 'letter') {
  const props = {
    ledger:
      '<path d="M9 10L49 5 55 52 15 58Z" fill="#887758"/><path d="M16 12L46 9 51 49 21 54Z" fill="#c4b28a"/><path d="M13 11L19 56" stroke="#645e46" stroke-width="3"/><path d="M23 21L42 18M25 27L44 24M26 33L45 30M28 39L43 37" stroke="#8d8467" stroke-width="1.5"/>',
    letter:
      '<path d="M6 20L49 10 60 47 17 58Z" fill="#d6c39b"/><path d="M8 22L35 34 50 12M18 56L28 35M57 47L40 33" fill="none" stroke="#ad9973" stroke-width="1.5"/><circle cx="36" cy="34" r="6" fill="#a36e52"/><path d="M34 32l4 4M38 32l-4 4" stroke="#c7986f"/>',
    manuscript:
      '<path d="M13 11L48 7 54 51 19 57Z" fill="#b9a781"/><path d="M8 7L43 3 49 47 14 53Z" fill="#e7d6b1"/><path d="M16 16L36 13M17 22L39 19M18 28L40 25M20 34L42 31M21 40L35 38" stroke="#a49879" stroke-width="1.3"/><path d="M38 45L53 12 60 7 57 18 41 47Z" fill="#867c5c"/>',
    exit: '<path d="M12 6H50V58H12Z" fill="#8b947a"/><path d="M18 12H43V58H18Z" fill="#c3c6a9"/><path d="M18 12L37 20V58H18Z" fill="#9b9d7c"/><circle cx="33" cy="37" r="1.5" fill="#eee0b8"/><path d="M36 36H59M51 30l8 6-8 6" fill="none" stroke="#6d7d5c" stroke-width="2"/>',
    bench:
      '<path d="M4 32H60V40H4ZM8 13H56V23H8Z" fill="#8e9579"/><path d="M11 24V56M53 24V56" stroke="#7b826b" stroke-width="5"/>',
    window:
      '<path d="M10 4H54V60H10Z" fill="#b9ad8c"/><path d="M15 10H49V54H15Z" fill="#9eafab"/><path d="M32 8V56M13 30H51" stroke="#e1d5b5" stroke-width="4"/>',
    crowd:
      '<g fill="#859078"><circle cx="15" cy="18" r="7"/><path d="M9 27H21L26 49H4Z"/><circle cx="46" cy="18" r="7"/><path d="M40 27H52L58 49H34Z"/></g><g fill="#637762"><circle cx="31" cy="23" r="8"/><path d="M24 33H38L44 58H18Z"/></g>',
  };
  return `<svg class="paper-prop" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${props[kind] || props.letter}</svg>`;
}
