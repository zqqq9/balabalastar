// 六爻占卜核心计算逻辑

// 64卦数据
export interface Hexagram {
  id: number;
  nameZh: string;
  nameEn: string;
  guaCi: string; // 卦辞
  yaoCi: string[]; // 爻辞（6个）
  meaning: string; // 含义
}

// 爻的类型
export type YaoType = 'yang' | 'yin'; // 阳爻或阴爻
export type YaoChange = 'none' | 'change'; // 不变或变爻

export interface Yao {
  type: YaoType; // 阳爻或阴爻
  change: YaoChange; // 是否变爻
  value: number; // 6, 7, 8, 9
}

export interface LiuYaoResult {
  yaos: Yao[]; // 6个爻（从下往上）
  benGua: Hexagram; // 本卦
  bianGua: Hexagram | null; // 变卦（如果有变爻）
  changingYaos: number[]; // 变爻位置（从下往上，1-6）
  interpretation: string; // 解读
}

// 64卦数据（简化版，包含主要卦象）
const hexagrams: Hexagram[] = [
  { id: 1, nameZh: '乾', nameEn: 'Qian (Heaven)', guaCi: '元亨利贞', yaoCi: ['初九：潜龙勿用', '九二：见龙在田', '九三：君子终日乾乾', '九四：或跃在渊', '九五：飞龙在天', '上九：亢龙有悔'], meaning: '天行健，君子以自强不息' },
  { id: 2, nameZh: '坤', nameEn: 'Kun (Earth)', guaCi: '元亨，利牝马之贞', yaoCi: ['初六：履霜坚冰至', '六二：直方大', '六三：含章可贞', '六四：括囊', '六五：黄裳元吉', '上六：龙战于野'], meaning: '地势坤，君子以厚德载物' },
  { id: 3, nameZh: '屯', nameEn: 'Zhun (Difficulty)', guaCi: '元亨利贞', yaoCi: ['初九：磐桓', '六二：屯如邅如', '六三：即鹿无虞', '六四：乘马班如', '九五：屯其膏', '上六：泣血涟如'], meaning: '云雷屯，君子以经纶' },
  { id: 4, nameZh: '蒙', nameEn: 'Meng (Youthful Folly)', guaCi: '亨', yaoCi: ['初六：发蒙', '九二：包蒙', '六三：勿用取女', '六四：困蒙', '六五：童蒙', '上九：击蒙'], meaning: '山下出泉，蒙，君子以果行育德' },
  { id: 5, nameZh: '需', nameEn: 'Xu (Waiting)', guaCi: '有孚，光亨', yaoCi: ['初九：需于郊', '九二：需于沙', '九三：需于泥', '六四：需于血', '九五：需于酒食', '上六：入于穴'], meaning: '云上于天，需，君子以饮食宴乐' },
  { id: 6, nameZh: '讼', nameEn: 'Song (Conflict)', guaCi: '有孚，窒惕', yaoCi: ['初六：不永所事', '九二：不克讼', '六三：食旧德', '九四：不克讼', '九五：讼元吉', '上九：或锡之鞶带'], meaning: '天与水违行，讼，君子以作事谋始' },
  { id: 7, nameZh: '师', nameEn: 'Shi (Army)', guaCi: '贞，丈人吉', yaoCi: ['初六：师出以律', '九二：在师中', '六三：师或舆尸', '六四：师左次', '六五：田有禽', '上六：大君有命'], meaning: '地中有水，师，君子以容民畜众' },
  { id: 8, nameZh: '比', nameEn: 'Bi (Union)', guaCi: '吉', yaoCi: ['初六：有孚比之', '六二：比之自内', '六三：比之匪人', '六四：外比之', '九五：显比', '上六：比之无首'], meaning: '水在地上，比，先王以建万国，亲诸侯' },
  { id: 9, nameZh: '小畜', nameEn: 'Xiao Xu (Small Accumulation)', guaCi: '亨', yaoCi: ['初九：复自道', '九二：牵复', '九三：舆说辐', '六四：有孚', '九五：有孚挛如', '上九：既雨既处'], meaning: '风行天上，小畜，君子以懿文德' },
  { id: 10, nameZh: '履', nameEn: 'Lu (Treading)', guaCi: '履虎尾，不咥人', yaoCi: ['初九：素履', '九二：履道坦坦', '六三：眇能视', '九四：履虎尾', '九五：夬履', '上九：视履考祥'], meaning: '天泽履，君子以辨上下，定民志' },
  { id: 11, nameZh: '泰', nameEn: 'Tai (Peace)', guaCi: '小往大来，吉亨', yaoCi: ['初九：拔茅茹', '九二：包荒', '九三：无平不陂', '六四：翩翩', '六五：帝乙归妹', '上六：城复于隍'], meaning: '天地交，泰，后以财成天地之道' },
  { id: 12, nameZh: '否', nameEn: 'Pi (Stagnation)', guaCi: '否之匪人', yaoCi: ['初六：拔茅茹', '六二：包承', '六三：包羞', '九四：有命', '九五：休否', '上九：倾否'], meaning: '天地不交，否，君子以俭德辟难' },
  { id: 13, nameZh: '同人', nameEn: 'Tong Ren (Fellowship)', guaCi: '同人于野，亨', yaoCi: ['初九：同人于门', '六二：同人于宗', '九三：伏戎于莽', '九四：乘其墉', '九五：同人先号咷', '上九：同人于郊'], meaning: '天与火，同人，君子以类族辨物' },
  { id: 14, nameZh: '大有', nameEn: 'Da You (Great Possession)', guaCi: '元亨', yaoCi: ['初九：无交害', '九二：大车以载', '九三：公用亨于天子', '九四：匪其彭', '六五：厥孚交如', '上九：自天祐之'], meaning: '火在天上，大有，君子以遏恶扬善' },
  { id: 15, nameZh: '谦', nameEn: 'Qian (Modesty)', guaCi: '亨，君子有终', yaoCi: ['初六：谦谦君子', '六二：鸣谦', '九三：劳谦', '六四：无不利', '六五：不富以其邻', '上六：鸣谦'], meaning: '地中有山，谦，君子以裒多益寡' },
  { id: 16, nameZh: '豫', nameEn: 'Yu (Enthusiasm)', guaCi: '利建侯行师', yaoCi: ['初六：鸣豫', '六二：介于石', '六三：盱豫', '九四：由豫', '六五：贞疾', '上六：冥豫'], meaning: '雷出地奋，豫，先王以作乐崇德' },
  { id: 17, nameZh: '随', nameEn: 'Sui (Following)', guaCi: '元亨利贞', yaoCi: ['初九：官有渝', '六二：系小子', '六三：系丈夫', '九四：随有获', '九五：孚于嘉', '上六：拘系之'], meaning: '泽中有雷，随，君子以向晦入宴息' },
  { id: 18, nameZh: '蛊', nameEn: 'Gu (Decay)', guaCi: '元亨', yaoCi: ['初六：干父之蛊', '九二：干母之蛊', '九三：干父之蛊', '六四：裕父之蛊', '六五：干父之蛊', '上九：不事王侯'], meaning: '山下有风，蛊，君子以振民育德' },
  { id: 19, nameZh: '临', nameEn: 'Lin (Approach)', guaCi: '元亨利贞', yaoCi: ['初九：咸临', '九二：咸临', '六三：甘临', '六四：至临', '六五：知临', '上六：敦临'], meaning: '泽上有地，临，君子以教思无穷' },
  { id: 20, nameZh: '观', nameEn: 'Guan (Contemplation)', guaCi: '盥而不荐', yaoCi: ['初六：童观', '六二：窥观', '六三：观我生', '六四：观国之光', '九五：观我生', '上九：观其生'], meaning: '风行地上，观，先王以省方观民设教' },
  { id: 21, nameZh: '噬嗑', nameEn: 'Shi Ke (Biting Through)', guaCi: '亨', yaoCi: ['初九：屦校灭趾', '六二：噬肤灭鼻', '六三：噬腊肉', '九四：噬干胏', '六五：噬干肉', '上九：何校灭耳'], meaning: '雷电，噬嗑，先王以明罚敕法' },
  { id: 22, nameZh: '贲', nameEn: 'Bi (Grace)', guaCi: '亨', yaoCi: ['初九：贲其趾', '六二：贲其须', '九三：贲如濡如', '六四：贲如皤如', '六五：贲于丘园', '上九：白贲'], meaning: '山下有火，贲，君子以明庶政' },
  { id: 23, nameZh: '剥', nameEn: 'Bo (Splitting Apart)', guaCi: '不利有攸往', yaoCi: ['初六：剥床以足', '六二：剥床以辨', '六三：剥之无咎', '六四：剥床以肤', '六五：贯鱼', '上九：硕果不食'], meaning: '山附于地，剥，上以厚下安宅' },
  { id: 24, nameZh: '复', nameEn: 'Fu (Return)', guaCi: '亨', yaoCi: ['初九：不远复', '六二：休复', '六三：频复', '六四：中行独复', '六五：敦复', '上六：迷复'], meaning: '雷在地中，复，先王以至日闭关' },
  { id: 25, nameZh: '无妄', nameEn: 'Wu Wang (Innocence)', guaCi: '元亨利贞', yaoCi: ['初九：无妄', '六二：不耕获', '六三：无妄之灾', '九四：可贞', '九五：无妄之疾', '上九：无妄行'], meaning: '天下雷行，无妄，先王以茂对时育万物' },
  { id: 26, nameZh: '大畜', nameEn: 'Da Xu (Great Accumulation)', guaCi: '利贞', yaoCi: ['初九：有厉', '九二：舆说辐', '九三：良马逐', '六四：童牛之牿', '六五：豮豕之牙', '上九：何天之衢'], meaning: '天在山中，大畜，君子以多识前言往行' },
  { id: 27, nameZh: '颐', nameEn: 'Yi (Nourishment)', guaCi: '贞吉', yaoCi: ['初九：舍尔灵龟', '六二：颠颐', '六三：拂颐', '六四：颠颐', '六五：拂经', '上九：由颐'], meaning: '山下有雷，颐，君子以慎言语' },
  { id: 28, nameZh: '大过', nameEn: 'Da Guo (Great Exceeding)', guaCi: '栋桡', yaoCi: ['初六：藉用白茅', '九二：枯杨生稊', '九三：栋桡', '九四：栋隆', '九五：枯杨生华', '上六：过涉灭顶'], meaning: '泽灭木，大过，君子以独立不惧' },
  { id: 29, nameZh: '坎', nameEn: 'Kan (Water)', guaCi: '有孚', yaoCi: ['初六：习坎', '九二：坎有险', '六三：来之坎坎', '六四：樽酒', '九五：坎不盈', '上六：系用徽纆'], meaning: '水洊至，习坎，君子以常德行' },
  { id: 30, nameZh: '离', nameEn: 'Li (Fire)', guaCi: '利贞，亨', yaoCi: ['初九：履错然', '六二：黄离', '九三：日昃之离', '九四：突如其来如', '六五：出涕沱若', '上九：王用出征'], meaning: '明两作，离，大人以继明照于四方' },
  { id: 31, nameZh: '咸', nameEn: 'Xian (Influence)', guaCi: '亨，利贞', yaoCi: ['初六：咸其拇', '六二：咸其腓', '九三：咸其股', '九四：贞吉', '九五：咸其脢', '上六：咸其辅颊舌'], meaning: '山上有泽，咸，君子以虚受人' },
  { id: 32, nameZh: '恒', nameEn: 'Heng (Duration)', guaCi: '亨，无咎', yaoCi: ['初六：浚恒', '九二：悔亡', '九三：不恒其德', '九四：田无禽', '六五：恒其德', '上六：振恒'], meaning: '雷风恒，君子以立不易方' },
  { id: 33, nameZh: '遁', nameEn: 'Dun (Retreat)', guaCi: '亨', yaoCi: ['初六：遁尾', '六二：执之用黄牛之革', '九三：系遁', '九四：好遁', '九五：嘉遁', '上九：肥遁'], meaning: '天下有山，遁，君子以远小人' },
  { id: 34, nameZh: '大壮', nameEn: 'Da Zhuang (Great Power)', guaCi: '利贞', yaoCi: ['初九：壮于趾', '九二：贞吉', '九三：小人用壮', '九四：贞吉', '六五：丧羊于易', '上六：羝羊触藩'], meaning: '雷在天上，大壮，君子以非礼弗履' },
  { id: 35, nameZh: '晋', nameEn: 'Jin (Progress)', guaCi: '康侯用锡马', yaoCi: ['初六：晋如摧如', '六二：晋如愁如', '六三：众允', '九四：晋如鼫鼠', '六五：悔亡', '上九：晋其角'], meaning: '明出地上，晋，君子以自昭明德' },
  { id: 36, nameZh: '明夷', nameEn: 'Ming Yi (Darkening of the Light)', guaCi: '利艰贞', yaoCi: ['初九：明夷于飞', '六二：明夷', '九三：明夷于南狩', '六四：入于左腹', '六五：箕子之明夷', '上六：不明晦'], meaning: '明入地中，明夷，君子以莅众用晦而明' },
  { id: 37, nameZh: '家人', nameEn: 'Jia Ren (Family)', guaCi: '利女贞', yaoCi: ['初九：闲有家', '六二：无攸遂', '九三：家人嗃嗃', '六四：富家', '九五：王假有家', '上九：有孚威如'], meaning: '风自火出，家人，君子以言有物而行有恒' },
  { id: 38, nameZh: '睽', nameEn: 'Kui (Opposition)', guaCi: '小事吉', yaoCi: ['初九：悔亡', '九二：遇主于巷', '六三：见舆曳', '九四：睽孤', '六五：悔亡', '上九：睽孤'], meaning: '上火下泽，睽，君子以同而异' },
  { id: 39, nameZh: '蹇', nameEn: 'Jian (Obstruction)', guaCi: '利西南', yaoCi: ['初六：往蹇来誉', '六二：王臣蹇蹇', '九三：往蹇来反', '六四：往蹇来连', '九五：大蹇朋来', '上六：往蹇来硕'], meaning: '山上有水，蹇，君子以反身修德' },
  { id: 40, nameZh: '解', nameEn: 'Jie (Deliverance)', guaCi: '利西南', yaoCi: ['初六：无咎', '九二：田获三狐', '六三：负且乘', '九四：解而拇', '六五：君子维有解', '上九：公用射隼'], meaning: '雷雨作，解，君子以赦过宥罪' },
  { id: 41, nameZh: '损', nameEn: 'Sun (Decrease)', guaCi: '有孚', yaoCi: ['初九：已事遄往', '九二：利贞', '六三：三人行', '六四：损其疾', '六五：或益之', '上九：弗损益之'], meaning: '山下有泽，损，君子以惩忿窒欲' },
  { id: 42, nameZh: '益', nameEn: 'Yi (Increase)', guaCi: '利有攸往', yaoCi: ['初九：利用为大作', '六二：或益之', '六三：益之用凶事', '六四：中行告公', '九五：有孚惠心', '上九：莫益之'], meaning: '风雷益，君子以见善则迁' },
  { id: 43, nameZh: '夬', nameEn: 'Guai (Breakthrough)', guaCi: '扬于王庭', yaoCi: ['初九：壮于前趾', '九二：惕号', '九三：壮于頄', '九四：臀无肤', '九五：苋陆夬夬', '上六：无号'], meaning: '泽上于天，夬，君子以施禄及下' },
  { id: 44, nameZh: '姤', nameEn: 'Gou (Coming to Meet)', guaCi: '女壮', yaoCi: ['初六：系于金柅', '九二：包有鱼', '九三：臀无肤', '九四：包无鱼', '九五：以杞包瓜', '上九：姤其角'], meaning: '天下有风，姤，后以施命诰四方' },
  { id: 45, nameZh: '萃', nameEn: 'Cui (Gathering)', guaCi: '亨', yaoCi: ['初六：有孚不终', '六二：引吉', '六三：萃如嗟如', '九四：大吉', '九五：萃有位', '上六：齎咨涕洟'], meaning: '泽上于地，萃，君子以除戎器' },
  { id: 46, nameZh: '升', nameEn: 'Sheng (Rising)', guaCi: '元亨', yaoCi: ['初六：允升', '九二：孚乃利用禴', '九三：升虚邑', '六四：王用亨于岐山', '六五：贞吉', '上六：冥升'], meaning: '地中生木，升，君子以顺德' },
  { id: 47, nameZh: '困', nameEn: 'Kun (Oppression)', guaCi: '亨', yaoCi: ['初六：臀困于株木', '九二：困于酒食', '六三：困于石', '九四：来徐徐', '九五：劓刖', '上六：困于葛藟'], meaning: '泽无水，困，君子以致命遂志' },
  { id: 48, nameZh: '井', nameEn: 'Jing (Well)', guaCi: '改邑不改井', yaoCi: ['初六：井泥不食', '九二：井谷射鲋', '九三：井渫不食', '六四：井甃', '九五：井冽寒泉', '上六：井收勿幕'], meaning: '木上有水，井，君子以劳民劝相' },
  { id: 49, nameZh: '革', nameEn: 'Ge (Revolution)', guaCi: '己日乃孚', yaoCi: ['初九：巩用黄牛之革', '六二：己日乃革之', '九三：征凶', '九四：悔亡', '九五：大人虎变', '上六：君子豹变'], meaning: '泽中有火，革，君子以治历明时' },
  { id: 50, nameZh: '鼎', nameEn: 'Ding (Cauldron)', guaCi: '元吉，亨', yaoCi: ['初六：鼎颠趾', '九二：鼎有实', '九三：鼎耳革', '九四：鼎折足', '六五：鼎黄耳', '上九：鼎玉铉'], meaning: '木上有火，鼎，君子以正位凝命' },
  { id: 51, nameZh: '震', nameEn: 'Zhen (Thunder)', guaCi: '亨', yaoCi: ['初九：震来虩虩', '六二：震来厉', '六三：震苏苏', '九四：震遂泥', '六五：震往来厉', '上六：震索索'], meaning: '洊雷，震，君子以恐惧修省' },
  { id: 52, nameZh: '艮', nameEn: 'Gen (Mountain)', guaCi: '艮其背', yaoCi: ['初六：艮其趾', '六二：艮其腓', '九三：艮其限', '六四：艮其身', '六五：艮其辅', '上九：敦艮'], meaning: '兼山，艮，君子以思不出其位' },
  { id: 53, nameZh: '渐', nameEn: 'Jian (Gradual Progress)', guaCi: '女归吉', yaoCi: ['初六：鸿渐于干', '六二：鸿渐于磐', '九三：鸿渐于陆', '六四：鸿渐于木', '九五：鸿渐于陵', '上九：鸿渐于陆'], meaning: '山上有木，渐，君子以居贤德善俗' },
  { id: 54, nameZh: '归妹', nameEn: 'Gui Mei (Marrying Maiden)', guaCi: '征凶', yaoCi: ['初九：归妹以娣', '九二：眇能视', '六三：归妹以须', '九四：归妹愆期', '六五：帝乙归妹', '上六：女承筐无实'], meaning: '雷上有泽，归妹，君子以永终知敝' },
  { id: 55, nameZh: '丰', nameEn: 'Feng (Abundance)', guaCi: '亨', yaoCi: ['初九：遇其配主', '六二：丰其蔀', '九三：丰其沛', '九四：丰其蔀', '六五：来章', '上六：丰其屋'], meaning: '雷电皆至，丰，君子以折狱致刑' },
  { id: 56, nameZh: '旅', nameEn: 'Lü (Travel)', guaCi: '小亨', yaoCi: ['初六：旅琐琐', '六二：旅即次', '九三：旅焚其次', '九四：旅于处', '六五：射雉一矢亡', '上九：鸟焚其巢'], meaning: '山上有火，旅，君子以明慎用刑' },
  { id: 57, nameZh: '巽', nameEn: 'Xun (Wind)', guaCi: '小亨', yaoCi: ['初九：进退', '九二：巽在床下', '九三：频巽', '六四：悔亡', '九五：贞吉', '上九：巽在床下'], meaning: '随风，巽，君子以申命行事' },
  { id: 58, nameZh: '兑', nameEn: 'Dui (Lake)', guaCi: '亨', yaoCi: ['初九：和兑', '九二：孚兑', '六三：来兑', '九四：商兑', '九五：孚于剥', '上六：引兑'], meaning: '丽泽，兑，君子以朋友讲习' },
  { id: 59, nameZh: '涣', nameEn: 'Huan (Dispersion)', guaCi: '亨', yaoCi: ['初六：用拯马壮', '九二：涣奔其机', '六三：涣其躬', '六四：涣其群', '九五：涣汗其大号', '上九：涣其血'], meaning: '风行水上，涣，先王以享于帝立庙' },
  { id: 60, nameZh: '节', nameEn: 'Jie (Limitation)', guaCi: '亨', yaoCi: ['初九：不出户庭', '九二：不出门庭', '六三：不节若', '六四：安节', '九五：甘节', '上六：苦节'], meaning: '泽上有水，节，君子以制数度' },
  { id: 61, nameZh: '中孚', nameEn: 'Zhong Fu (Inner Truth)', guaCi: '豚鱼吉', yaoCi: ['初九：虞吉', '九二：鸣鹤在阴', '六三：得敌', '六四：月几望', '九五：有孚挛如', '上九：翰音登于天'], meaning: '泽上有风，中孚，君子以议狱缓死' },
  { id: 62, nameZh: '小过', nameEn: 'Xiao Guo (Small Exceeding)', guaCi: '亨', yaoCi: ['初六：飞鸟以凶', '六二：过其祖', '九三：弗过防之', '九四：无咎', '六五：密云不雨', '上六：弗遇过之'], meaning: '山上有雷，小过，君子以行过乎恭' },
  { id: 63, nameZh: '既济', nameEn: 'Ji Ji (After Completion)', guaCi: '亨', yaoCi: ['初九：曳其轮', '六二：妇丧其茀', '九三：高宗伐鬼方', '六四：繻有衣袽', '九五：东邻杀牛', '上六：濡其首'], meaning: '水在火上，既济，君子以思患而豫防之' },
  { id: 64, nameZh: '未济', nameEn: 'Wei Ji (Before Completion)', guaCi: '亨', yaoCi: ['初六：濡其尾', '九二：曳其轮', '六三：未济征凶', '九四：贞吉', '六五：贞吉', '上九：有孚于饮酒'], meaning: '火在水上，未济，君子以慎辨物居方' },
];

// 根据6个爻生成卦象ID
function getHexagramId(yaos: Yao[]): number {
  // 从下往上读取6个爻
  // 阳爻=1，阴爻=0
  let binary = '';
  for (let i = 5; i >= 0; i--) {
    binary += yaos[i].type === 'yang' ? '1' : '0';
  }
  // 转换为十进制（1-64）
  const id = parseInt(binary, 2) + 1;
  return id;
}

// 生成变卦
function getBianGua(yaos: Yao[]): Yao[] {
  return yaos.map(yao => {
    if (yao.change === 'change') {
      // 变爻：阳变阴，阴变阳
      return {
        type: yao.type === 'yang' ? 'yin' : 'yang',
        change: 'none',
        value: yao.type === 'yang' ? 6 : 9,
      };
    }
    return yao;
  });
}

// 生成单个爻（投掷3次硬币）
function generateYao(): Yao {
  // 模拟投掷3次硬币
  // 3个正面（老阳）= 9，2正1反（少阴）= 8，1正2反（少阳）= 7，3个反面（老阴）= 6
  const coin1 = Math.random() < 0.5 ? 'heads' : 'tails';
  const coin2 = Math.random() < 0.5 ? 'heads' : 'tails';
  const coin3 = Math.random() < 0.5 ? 'heads' : 'tails';
  
  const headsCount = [coin1, coin2, coin3].filter(c => c === 'heads').length;
  
  if (headsCount === 3) {
    // 老阳（9）- 阳爻，会变
    return { type: 'yang', change: 'change', value: 9 };
  } else if (headsCount === 2) {
    // 少阴（8）- 阴爻，不变
    return { type: 'yin', change: 'none', value: 8 };
  } else if (headsCount === 1) {
    // 少阳（7）- 阳爻，不变
    return { type: 'yang', change: 'none', value: 7 };
  } else {
    // 老阴（6）- 阴爻，会变
    return { type: 'yin', change: 'change', value: 6 };
  }
}

// 生成解读文本
function generateInterpretation(
  benGua: Hexagram,
  bianGua: Hexagram | null,
  changingYaos: number[],
  locale: string = 'zh'
): string {
  const isZh = locale === 'zh';
  
  let interpretation = '';
  
  if (isZh) {
    interpretation += `本卦：${benGua.nameZh}（${benGua.nameEn}）\n\n`;
    interpretation += `卦辞：${benGua.guaCi}\n\n`;
    interpretation += `含义：${benGua.meaning}\n\n`;
    
    if (changingYaos.length > 0) {
      interpretation += `变爻：第${changingYaos.join('、')}爻\n\n`;
      interpretation += `变爻爻辞：\n`;
      changingYaos.forEach(pos => {
        const yaoIndex = pos - 1; // 转换为0-based索引
        interpretation += `${benGua.yaoCi[yaoIndex]}\n`;
      });
      interpretation += '\n';
      
      if (bianGua) {
        interpretation += `变卦：${bianGua.nameZh}（${bianGua.nameEn}）\n\n`;
        interpretation += `变卦卦辞：${bianGua.guaCi}\n\n`;
        interpretation += `变卦含义：${bianGua.meaning}\n\n`;
      }
    } else {
      interpretation += `无变爻，以本卦卦辞和爻辞为主。\n\n`;
    }
    
    interpretation += `解读：\n`;
    interpretation += `本卦${benGua.nameZh}卦象显示当前的情况。`;
    
    if (changingYaos.length > 0) {
      interpretation += `由于有${changingYaos.length}个变爻，事情将会发生变化。`;
      if (bianGua) {
        interpretation += `变卦${bianGua.nameZh}预示着未来的发展趋势。`;
      }
      interpretation += `需要特别关注变爻的爻辞，它们指出了变化的关键点。`;
    } else {
      interpretation += `由于没有变爻，当前情况相对稳定，可以按照本卦的指导行事。`;
    }
    
    interpretation += `\n\n建议：根据卦象的指导，保持内心的平静，审时度势，做出明智的决策。`;
  } else {
    interpretation += `Original Hexagram: ${benGua.nameZh} (${benGua.nameEn})\n\n`;
    interpretation += `Hexagram Text: ${benGua.guaCi}\n\n`;
    interpretation += `Meaning: ${benGua.meaning}\n\n`;
    
    if (changingYaos.length > 0) {
      interpretation += `Changing Lines: ${changingYaos.join(', ')}\n\n`;
      interpretation += `Changing Line Texts:\n`;
      changingYaos.forEach(pos => {
        const yaoIndex = pos - 1;
        interpretation += `${benGua.yaoCi[yaoIndex]}\n`;
      });
      interpretation += '\n';
      
      if (bianGua) {
        interpretation += `Changed Hexagram: ${bianGua.nameZh} (${bianGua.nameEn})\n\n`;
        interpretation += `Changed Hexagram Text: ${bianGua.guaCi}\n\n`;
        interpretation += `Changed Hexagram Meaning: ${bianGua.meaning}\n\n`;
      }
    } else {
      interpretation += `No changing lines, focus on the original hexagram.\n\n`;
    }
    
    interpretation += `Interpretation:\n`;
    interpretation += `The hexagram ${benGua.nameZh} shows the current situation.`;
    
    if (changingYaos.length > 0) {
      interpretation += ` With ${changingYaos.length} changing line(s), change is coming.`;
      if (bianGua) {
        interpretation += ` The changed hexagram ${bianGua.nameZh} indicates future development.`;
      }
      interpretation += ` Pay special attention to the changing line texts, as they point to key points of change.`;
    } else {
      interpretation += ` With no changing lines, the situation is relatively stable.`;
    }
    
    interpretation += `\n\nAdvice: Follow the guidance of the hexagram, maintain inner peace, assess the situation, and make wise decisions.`;
  }
  
  return interpretation;
}

// 主函数：生成六爻占卜结果
export function generateLiuYao(locale: string = 'zh'): LiuYaoResult {
  // 生成6个爻（从下往上）
  const yaos: Yao[] = [];
  for (let i = 0; i < 6; i++) {
    yaos.push(generateYao());
  }
  
  // 获取本卦
  const benGuaId = getHexagramId(yaos);
  const benGua = hexagrams[benGuaId - 1];
  
  // 检查是否有变爻
  const changingYaos: number[] = [];
  yaos.forEach((yao, index) => {
    if (yao.change === 'change') {
      changingYaos.push(index + 1); // 从下往上，第1-6爻
    }
  });
  
  // 如果有变爻，生成变卦
  let bianGua: Hexagram | null = null;
  if (changingYaos.length > 0) {
    const bianYaos = getBianGua(yaos);
    const bianGuaId = getHexagramId(bianYaos);
    bianGua = hexagrams[bianGuaId - 1];
  }
  
  // 生成解读
  const interpretation = generateInterpretation(benGua, bianGua, changingYaos, locale);
  
  return {
    yaos,
    benGua,
    bianGua,
    changingYaos,
    interpretation,
  };
}

// 导出类型
export type { Hexagram, Yao, YaoType, YaoChange };
