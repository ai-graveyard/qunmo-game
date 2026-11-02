export const SETTING = {year:1869,season:'秋',label:'一八六九 · 秋',note:'1869 年秋为游戏改编的美术设定；原著背景为十九世纪六十年代后期。'};
export const PEOPLE = [
  {id:'stepan',name:'斯捷潘',full:'斯捷潘·特洛菲莫维奇',role:'老知识分子 · 新思想的招牌',note:'一辈子说漂亮话，却几乎没真正承担。',tag:'空谈者',color:'#707e68'},
  {id:'varvara',name:'瓦尔瓦拉',full:'瓦尔瓦拉·彼得罗夫娜',role:'贵妇 · 斯塔夫罗金之母 · 斯捷潘的金主',note:'体面与掌控欲的化身。',tag:'掌控者',color:'#8f655d'},
  {id:'pyotr',name:'彼得',full:'彼得·斯捷潘诺维奇',role:'斯捷潘之子 · 地下组织的操纵者',note:'把理想当工具，像蜘蛛一样结网。',tag:'操纵者',color:'#a35d47'},
  {id:'stavrogin',name:'斯塔夫罗金',full:'尼古拉·斯塔夫罗金',role:'贵族之子 · 全书的“空洞中心”',note:'什么都懂，却什么都不真的相信。',tag:'空洞中心',color:'#4f626a'},
  {id:'shatov',name:'沙托夫',full:'沙托夫',role:'曾走极端，后转向信仰',note:'想抓住土地与信念，把自己从虚无里拉回来。',tag:'转向者',color:'#7b8062'},
  {id:'kirillov',name:'基里洛夫',full:'基里洛夫',role:'极端理性者',note:'用自杀去“证明”绝对自由。',tag:'理性者',color:'#657f83'},
  {id:'shigalyov',name:'希加廖夫',full:'希加廖夫',role:'地下聚会中的“理论家”',note:'从“无限自由”推出“彻底奴役”：1/10 掌权，9/10 退化成不再思考的兽群。',tag:'理论家',color:'#827268'},
  {id:'liza',name:'丽莎',full:'丽莎',role:'聪明、骄傲又冲动的年轻女子',note:'在崇拜与仇恨之间摇摆，最后死于人群。',tag:'摇摆者',color:'#a87869'},
  {id:'marya',name:'玛利亚',full:'玛利亚（缺腿女子）',role:'列比亚金之妹 · 斯塔夫罗金的秘密之妻',note:'把斯塔夫罗金当成童话里的王子。',tag:'秘密之妻',color:'#8b8875'},
  {id:'lebyadkin',name:'列比亚金',full:'列比亚金',role:'边缘军官 · 玛利亚的哥哥',note:'与斯塔夫罗金纠葛不清，兄妹一同被害。',tag:'边缘人',color:'#8b7354'},
  {id:'narrator',name:'叙述者',full:'叙述者（小公务员）',role:'小城的观察者 · 你所扮演的人',note:'又羡慕又清醒地讲完这一切。',tag:'见证者',color:'#4c6255'}
];
export const person = id => PEOPLE.find(p => p.id === id);
export const EVIDENCE = {
  patron:{title:'资助账簿',text:'瓦尔瓦拉长期资助斯捷潘。漂亮的自由谈论，也有账单的背面。',source:'亲见 · 沙龙书桌'},
  marriage:{title:'婚姻的证言',text:'玛利亚称斯塔夫罗金为丈夫；这份亲口证言仍需当事人确认。',source:'亲闻 · 玛利亚'},
  receipt:{title:'无署名的款项',text:'寄给列比亚金的款项与信件提到同一位贵族，但钱款本身不能证明婚姻。',source:'亲见 · 列比亚金的桌面'},
  scheme:{title:'十张纸人的方案',text:'一张纸人拥有权力，另九张被要求放弃意志。方案与它宣称的自由相矛盾。',source:'亲闻 · 希加廖夫'},
  names:{title:'被圈出的名字',text:'彼得的便笺圈出了沙托夫的名字。“退出”在这里被写成了“背叛”。',source:'亲见 · 聚会便笺'},
  crowd:{title:'没有来源的指控',text:'你追问了三名围观者，没有一个亲眼看见自己正在指控的事。',source:'走访核对 · 文学节'},
  invitation:{title:'可疑的夜间邀约',text:'给沙托夫的邀约，笔迹与聚会便笺一致，约定地点却避开了人群。',source:'交叉核对 · 夜间来信'},
  confession:{title:'预先安排的认罪',text:'彼得希望基里洛夫承担别人的罪责。所谓自由，被他人写进了计划。',source:'亲闻 · 基里洛夫'}
};
export const RELATIONS = [
  ['varvara','stepan','资助'], ['varvara','stavrogin','母子'], ['stepan','pyotr','父子'],
  ['pyotr','shigalyov','利用理论'], ['stavrogin','shatov','思想影响'], ['stavrogin','kirillov','思想影响'],
  ['stavrogin','liza','情感纠葛'], ['marya','lebyadkin','兄妹'], ['stavrogin','marya','秘密婚姻','marriageConfirmed'],
  ['pyotr','shatov','威胁','names'], ['pyotr','kirillov','安排认罪','confession']
];

export const CHAPTERS = [
  {title:'体面的客厅',subtitle:'第一幕',place:'瓦尔瓦拉的沙龙',time:'午后 · 一切尚且体面',mood:'salon',intro:'文学节快到了。瓦尔瓦拉请你核对来宾名单。茶炊还冒着热气，屋里的人已经开始谈论整个俄国。',objective:'走访两处，弄清这个家里的依附关系。',hotspots:[
    {id:'ledger',x:23,label:'书桌上的账簿',kind:'调查',evidence:'patron',text:'账目里反复出现斯捷潘的名字。你翻到最新一页：他的生活仍由这所房子的女主人支付。'},
    {id:'stepan',x:45,label:'斯捷潘',kind:'交谈',person:'stepan',text:'“年轻的朋友，我们当年谈论自由的时候……”他停下来，问你瓦尔瓦拉是否还在生气。',choices:[{label:'请他说明自己愿意承担的事',reply:'他整理领结：“当然，我愿意……不过，具体是指什么？”',effects:{clarity:1}},{label:'称赞他的理想与风度',reply:'他舒展开眉头，又讲起当年的掌声。',effects:{}}]},
    {id:'varvara',x:69,label:'瓦尔瓦拉',kind:'交谈',person:'varvara',text:'“请把名单先拿给我。小城已经有够多不体面的传言了。”她没有抬高声音，仆人却立刻退出了房间。',choices:[{label:'答应先让她过目记录',reply:'“你很懂得分寸。”她把通往宅邸的请柬交给你。',effects:{complicity:1}},{label:'说明自己也会核对别人的说法',reply:'她看了你一会儿：“但愿你知道轻重。”',effects:{clarity:1}}]},
    {id:'stavrogin',x:87,label:'斯塔夫罗金',kind:'交谈',person:'stavrogin',text:'窗边的人听着所有谈论，仿佛那些期待都与自己无关。“他们想从我这里听到什么？”',choices:[{label:'问他是否认同这些期待',reply:'“认同？”他重复你的词，随即转身望向窗外。',effects:{clarity:1}},{label:'只递上文学节请柬',reply:'他接了过去，没有答应，也没有拒绝。',effects:{}}]}
  ],event:{person:'pyotr',text:'门口，彼得把一封信塞到你手里：“顺路送给列比亚金。小事，别让其他人操心。”',choices:[{label:'先问清来由，再决定递交',reply:'你记下收信人的名字，也记下彼得不愿解释这封信。',effects:{clarity:1},flag:'questionedLetter'},{label:'答应替他把信送到',reply:'“我就知道可以信任你。”他很快消失在街角。',effects:{complicity:1},flag:'carriedLetter'}]}},
  {title:'另一位妻子',subtitle:'第二幕',place:'河边的旧住处',time:'傍晚 · 传言有了名字',mood:'house',intro:'河边木屋的门没有关严，炉子还留着余温。里面传来诗句、争吵，还有一位女子轻声说起她的王子。',objective:'走访两处。你听到的婚姻秘密，需要核实。',hotspots:[
    {id:'marya',x:26,label:'玛利亚',kind:'交谈',person:'marya',evidence:'marriage',text:'“他回来了，可他不是我的王子。”玛利亚把一张折好的纸握在手里。她称斯塔夫罗金为丈夫。',choices:[{label:'坐下来，把她的话听完',reply:'她慢慢放松了手。你把她的说法原样记下，没有替她补出故事。',effects:{care:1},flag:'listenedMarya'},{label:'追问这是不是她的幻想',reply:'她收起纸，转头望向窗外。你仍记下证言，却没有得到更多回答。',effects:{}}]},
    {id:'receipt',x:47,label:'款项与旧信',kind:'调查',evidence:'receipt',text:'桌面上有一笔寄来的钱与几封语气强硬的信。收钱、沉默、体面：这些词反复出现，婚姻却没有写明。'},
    {id:'lebyadkin',x:67,label:'列比亚金',kind:'交谈',person:'lebyadkin',text:'“我也是个诗人！我有我的权利！”他刚要说出一个名字，就改口向你借钱。',choices:[{label:'问钱款和来信的关系',reply:'“你问得太多了。”他把信压到酒杯下面。你看见信封与彼得交给你的一样。',evidence:'receipt',effects:{clarity:1}},{label:'递信后尽快离开',reply:'他抓住信封，甚至没有向你道谢。',effects:{complicity:1}}]},
    {id:'stavrogin2',x:87,label:'门外的斯塔夫罗金',kind:'核实',person:'stavrogin',text:'斯塔夫罗金停在门外。你终于有机会，把屋内的说法带到他面前。',choices:[{label:'出示玛利亚的证言，核对婚姻',requires:'marriage',reply:'“是的，我们结过婚。”他说。你得到确认，却仍不知道他准备为此做什么。',effects:{clarity:2},flag:'marriageConfirmed'},{label:'只问他会不会参加文学节',reply:'“也许。”他说完便走了。',effects:{}}]}
  ],event:{person:'marya',text:'离开时，你听见玛利亚在楼上喊了一声。彼得的朋友正在路口等你，似乎想知道你听到了多少。',choices:[{label:'保留证言，只向当事人求证',reply:'你把纸条收进自己的手册。她的生活没有成为今晚的谈资。',effects:{care:1},flag:'protectedMarya'},{label:'把婚姻传言告诉等候的人',reply:'消息比你走得更快。第二天，小城已经流传起数种版本。',effects:{complicity:1,unrest:1}}]}},
  {title:'十张纸人',subtitle:'第三幕',place:'地下聚会的房间',time:'入夜 · 谁在替谁说话',mood:'meeting',intro:'你被带进一间拥挤的屋子。烛光照着十张纸人和一份手写方案，一张名单正沿着桌边传递。',objective:'走访两处。看清方案与名单背后的安排。',hotspots:[
    {id:'shigalyov',x:23,label:'希加廖夫',kind:'交谈',person:'shigalyov',evidence:'scheme',text:'“我从无限的自由出发，得到无限的专制。”他把一张纸人放到高处，其余九张叠在桌面。',choices:[{label:'指出九个人已失去自由',reply:'“这是我推导出的结论。”他很不耐烦，仿佛问题出在现实，而不在方案。',effects:{clarity:1}},{label:'把它当作一套漂亮的理论',reply:'彼得在旁边笑了：“实际的事情，交给我们。”',effects:{complicity:1}}]},
    {id:'names',x:44,label:'桌角的名单',kind:'调查',evidence:'names',text:'沙托夫的名字被圈了两次。旁边写着“退出”和“可靠性”。你把这些字记下，尚不能据此断定完整计划。'},
    {id:'shatov',x:66,label:'沙托夫',kind:'交谈',person:'shatov',text:'“我已经离开他们。我现在有别的事要做。”他一直望着门口，像是急着回家。',choices:[{label:'提醒他留意单独发来的邀约',requires:'names',reply:'他沉默了一会儿：“谢谢。我会留心。”',effects:{care:1},flag:'warnedShatov'},{label:'问他现在相信什么',reply:'“我想相信。”他回答。离开前，他请你别再替任何人传他的话。',effects:{clarity:1}}]},
    {id:'pyotr',x:86,label:'彼得',kind:'交谈',person:'pyotr',text:'“大家只需要回答：你站在哪一边？”他把每个人的迟疑都记在心里，却从不说明事情的全貌。',choices:[{label:'要求说清具体要做什么',reply:'“总有人喜欢把简单的事弄复杂。”他的笑容淡了。',effects:{clarity:1}},{label:'先表示自己绝对可靠',reply:'他拍了拍你的肩，又交给你一张需要转交的便条。',effects:{complicity:1}}]}
  ],event:{person:'pyotr',text:'散会前，彼得提出让每个人留下名字。“只是方便互相联系。”你看见沙托夫已经先走了。',choices:[{label:'拒绝签一份用途不明的名单',reply:'你第一次让彼得在别人面前等了一会儿。他最终收起纸。',effects:{clarity:1},flag:'refusedList'},{label:'签名，维持彼此的信任',reply:'你的名字也落在了纸上。彼得把名单折好，放进口袋。',effects:{complicity:2},flag:'signedList'}]}},
  {title:'文学节与火',subtitle:'第四幕',place:'会场外的广场',time:'次日 · 人群开始移动',mood:'fire',intro:'朗读被嘲笑打断，争执传到街上。远处升起烟，丽莎正朝聚拢的人群走去。核实指控、打开侧门，或许能为撤离争取机会。',objective:'走访两处。核实指控、打开侧门，可准备安全撤离。',hotspots:[
    {id:'crowd',x:20,label:'围观的人群',kind:'核实',evidence:'crowd',text:'“大家都这么说。”你依次追问消息从哪里来，回答却总指向另一个没有名字的人。'},
    {id:'liza',x:42,label:'丽莎',kind:'交谈',person:'liza',text:'“我要自己过去看看。”丽莎望向冒烟的方向。愤怒的人群正在那里聚拢。',choices:[{label:'说明指控尚无来源，请她从侧街走',requires:'crowd',reply:'她仍然骄傲地抬着头，但愿意等你带路。',effects:{care:2},flag:'lizaWarned'},{label:'陪她走到广场边缘',reply:'她走得很快。你跟上去，至少没有让她独自进入人群。',effects:{care:1},flag:'lizaAccompanied'}]},
    {id:'exit',x:65,label:'被木箱挡住的侧门',kind:'行动',text:'你把木箱移开，推开侧门。门后的巷子远离聚集的人群，可以通往河岸。',effects:{care:1},flag:'exitOpened'},
    {id:'stepan4',x:86,label:'台阶上的斯捷潘',kind:'交谈',person:'stepan',text:'“他们不听我说了。”他攥着讲稿，纸张在风里发抖。',choices:[{label:'请他先帮助身边的人离开',reply:'他迟疑片刻，终于把讲稿放进口袋，扶住一位站不稳的老人。',effects:{care:1}},{label:'收好他的讲稿，留作记录',reply:'你保存了那些漂亮的话。人群还在身后涌动。',effects:{clarity:1}}]}
  ],event:{person:'narrator',text:'钟声响起，人群向火光涌去。你能做的事需要立刻落实。',choices:[{label:'向丽莎说明指控未经核实，带她从侧门撤离',requires:'crowd',requiresFlags:['exitOpened'],reply:'你说明了自己核实的结果。她终于愿意随你穿过侧门，在河边停下来。身后的喧嚣没有追上来。丽莎在这一改编分支中活了下来。',effects:{care:2},flag:'savedLiza'},{label:'沿街提醒行人避开拥挤区域',reply:'你让几个人改走了另一条街。混乱中，你失去了丽莎的踪迹。',effects:{care:1},flag:'helpedCrowd'},{label:'留在现场，记下骚乱的经过',reply:'你得到更完整的见闻。稍后传来的丽莎的消息，却无法从记录里擦去。',effects:{clarity:2}}]}},
  {title:'夜间来信',subtitle:'第五幕',place:'两扇还亮着灯的门',time:'深夜 · 你只能先去一处',mood:'night',intro:'给沙托夫的邀约送到了你手里。另一边，基里洛夫的灯还亮着。你认出了某些安排的笔迹。',objective:'走访两处，找出危险的证据。最后只能先介入一边。',hotspots:[
    {id:'invitation',x:20,label:'送来的邀约',kind:'调查',text:'纸条约沙托夫去一个僻静地点。若有聚会名单，你可以把两份笔迹放在一起核对。',choices:[{label:'与名单上的笔迹核对',requires:'names',reply:'两份笔迹相同。结合被圈出的名字，这已足够让你认真警惕。',evidence:'invitation',effects:{clarity:1}},{label:'仅记下邀约的时间地点',reply:'你保存了内容，但暂时缺乏能将它与彼得联系起来的证据。',effects:{}}]},
    {id:'shatov5',x:43,label:'沙托夫的门',kind:'交谈',person:'shatov',text:'屋里的人忙着照顾家人。“如果有事，明天再说好吗？”沙托夫低声问。',choices:[{label:'留下帮忙，确认他目前的处境',reply:'你为他们提来水。他答应在出门前等你的消息。',effects:{care:1},flag:'shatovWaiting'},{label:'把邀约转交给他',reply:'“我会去一趟。”他把纸条收起来。你再次完成了一件差事。',effects:{complicity:1}}]},
    {id:'kirillov',x:67,label:'基里洛夫的灯',kind:'交谈',person:'kirillov',evidence:'confession',text:'“我的决定属于我。”基里洛夫说。但他随后提到，彼得已经要求他写下另一件事的认罪书。',choices:[{label:'追问：为何要替别人承担罪责',reply:'“这和我的思想……不是同一件事。”他第一次停下了论证。',effects:{clarity:1},flag:'questionedConfession'},{label:'听完他的自由论述',reply:'他讲了很久。你记录了他的想法，也记录了彼得提出的要求。',effects:{}}]},
    {id:'pyotr5',x:87,label:'路口的彼得',kind:'交谈',person:'pyotr',text:'“不必进去打扰。事情很快都会有解释。”他站在两条路之间。',choices:[{label:'请他交代今夜每项安排',reply:'他没有回答。你看到他急于把谈话结束。',effects:{clarity:1}},{label:'答应不干涉他的计划',reply:'“你很明智。”他把手插回大衣口袋。',effects:{complicity:2}}]}
  ],event:{person:'narrator',text:'灯还亮着，但这一夜已经没有足够时间让你走遍所有地方。你决定先去哪里？',choices:[{label:'带着核实的邀约，阻止沙托夫赴约',requires:'invitation',reply:'你把两份笔迹摆在一起。他决定留下。这条改编分支中，邀约没有把他带到僻静处。',effects:{care:2},flag:'savedShatov'},{label:'回到基里洛夫身边，陪他等待并求助',requires:'confession',reply:'你请附近的人一同来守候，拒绝让彼得独自进入。你们争取到了这一夜，后来的生活仍需要帮助。',effects:{care:2},flag:'helpedKirillov'},{label:'保全证据，找人共同见证',reply:'你留下两份副本，让这件事不会只剩一种说法。但你没有赶到任何一扇门前。',effects:{clarity:2},flag:'securedEvidence'}]}},
  {title:'留下的记录',subtitle:'终幕',place:'清晨的小城',time:'清晨 · 纸上还有空白',mood:'dawn',intro:'天亮了。小城没有因为一份记录恢复原样。你摊开手册，必须区分亲见的事、听来的话，以及自己的推测。',objective:'整理两处记录，再写下你的小城见证。',hotspots:[
    {id:'archive',x:22,label:'整理证据',kind:'整理',text:'你给每条消息标明来源。没有确认的地方，仍留着问号。',effects:{clarity:1},flag:'sourcesMarked'},
    {id:'survivors',x:44,label:'河岸的长椅',kind:'回望',text:'有的人等到了清晨，有的人只留下空座。你的帮助有边界，但每一次到场都属于具体的人。',effects:{care:1}},
    {id:'varvara6',x:66,label:'瓦尔瓦拉的来信',kind:'阅读',person:'varvara',text:'“愿你在记录的时候，顾及仍在世的人。”这句话既像请求，也像她一贯的命令。',choices:[{label:'保护隐私，同时保留事件责任',reply:'你划去无关的私事，留下能够相互核对的行为。',effects:{clarity:1,care:1}},{label:'依照她的要求删去不体面的内容',reply:'页面整洁了许多，一些人的责任也跟着消失了。',effects:{complicity:1}}]},
    {id:'empty',x:87,label:'宅邸的空窗',kind:'回望',person:'stavrogin',text:'你曾想从这扇窗后得到答案。现在你只能写出自己知道的部分，并承认仍有不懂的地方。',effects:{clarity:1}}
  ],event:{person:'narrator',text:'最后一页还空着。你准备如何写下自己的名字？',choices:[{label:'写明自己核实过的事，也写明自己的参与',reply:'你没有把自己从事件里删掉。手册在此合上，故事留给下一位读者。',effects:{clarity:1},flag:'honestRecord'},{label:'把自己写成始终清白的旁观者',reply:'你删掉几次递信与沉默。纸上的叙述者，比实际的你清白得多。',effects:{complicity:2},flag:'sanitizedRecord'}]}}
];
