#!/usr/bin/env python3
"""
Save the Bears Now - Dataset Generation Script
Builds public/data/hospitals.json and public/data/transit_network.json
Executed in conda environment: toby
"""

import os
import json

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("🐻 [Save the Bears Now] Building Hospital and Transit Datasets...")

# -------------------------------------------------------------
# 1. Hospital Database (全國重度級急救責任醫院與兒醫急救中心資料庫)
# -------------------------------------------------------------
HOSPITALS = [
    # 雙北地區
    {
        "id": "0401180014",
        "name": "臺大醫院",
        "shortName": "臺大",
        "area": "01",
        "city": "臺北市",
        "district": "中正區",
        "lat": 25.0402,
        "lng": 121.5186,
        "address": "臺北市中正區常德街1號",
        "phone": "02-23123456",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "BL11 台北車站 / R09 臺大醫院",
        "tags": ["醫學中心", "重度急救", "葉克膜重鎮"]
    },
    {
        "id": "0401180023",
        "name": "臺大兒童醫院",
        "shortName": "台大兒醫",
        "area": "01",
        "city": "臺北市",
        "district": "中正區",
        "lat": 25.0441,
        "lng": 121.5198,
        "address": "臺北市中正區中山南路8號",
        "phone": "02-23123456",
        "tier": "兒童急救責任醫院",
        "nearMetro": "R09 臺大醫院 / BL12 善導寺",
        "tags": ["兒童急診", "小兒加護"]
    },
    {
        "id": "0601160016",
        "name": "臺北榮民總醫院",
        "shortName": "北榮",
        "area": "01",
        "city": "臺北市",
        "district": "北投區",
        "lat": 25.1207,
        "lng": 121.5201,
        "address": "臺北市北投區石牌路二段201號",
        "phone": "02-28712121",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "R19 石牌",
        "tags": ["醫學中心", "重度創傷", "神經外科"]
    },
    {
        "id": "0501110514",
        "name": "三軍總醫院內湖總院",
        "shortName": "三總",
        "area": "01",
        "city": "臺北市",
        "district": "內湖區",
        "lat": 25.0694,
        "lng": 121.5912,
        "address": "臺北市內湖區成功路二段325號",
        "phone": "02-87923311",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "BR17 昆陽轉乘公車 / BR20 葫洲",
        "tags": ["醫學中心", "重症加護", "燒燙傷中心"]
    },
    {
        "id": "1101010012",
        "name": "馬偕紀念醫院台北院區",
        "shortName": "台北馬偕",
        "area": "01",
        "city": "臺北市",
        "district": "中山區",
        "lat": 25.0583,
        "lng": 121.5226,
        "address": "臺北市中山區中山北路二段92號",
        "phone": "02-25433535",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "R12/O11 雙連",
        "tags": ["醫學中心", "兒科急救", "毒物諮詢"]
    },
    {
        "id": "1101020018",
        "name": "國泰綜合醫院",
        "shortName": "台北國泰",
        "area": "01",
        "city": "臺北市",
        "district": "大安區",
        "lat": 25.0375,
        "lng": 121.5511,
        "address": "臺北市大安區仁愛路四段280號",
        "phone": "02-27082121",
        "tier": "重度級急救責任醫院 (區域醫院)",
        "nearMetro": "BL16 忠孝敦化 / R04 信義安和",
        "tags": ["重度急救", "心導管中心"]
    },
    {
        "id": "1101150015",
        "name": "新光吳火獅紀念醫院",
        "shortName": "新光",
        "area": "01",
        "city": "臺北市",
        "district": "士林區",
        "lat": 25.0933,
        "lng": 121.5218,
        "address": "臺北市士林區文昌路95號",
        "phone": "02-28332211",
        "tier": "重度級急救責任醫院",
        "nearMetro": "R16 士林",
        "tags": ["重度急救", "心血管專科"]
    },
    {
        "id": "1301150011",
        "name": "臺北市立萬芳醫院",
        "shortName": "萬芳",
        "area": "01",
        "city": "臺北市",
        "district": "文山區",
        "lat": 25.0003,
        "lng": 121.5583,
        "address": "臺北市文山區興隆路三段111號",
        "phone": "02-29307930",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "BR04 萬芳醫院",
        "tags": ["醫學中心", "捷運直通", "重症創傷"]
    },
    {
        "id": "0101020017",
        "name": "臺北市立聯合醫院仁愛院區",
        "shortName": "聯醫仁愛",
        "area": "01",
        "city": "臺北市",
        "district": "大安區",
        "lat": 25.0378,
        "lng": 121.5435,
        "address": "臺北市大安區仁愛路四段10號",
        "phone": "02-27093600",
        "tier": "中度級急救責任醫院",
        "nearMetro": "BL15/R08 大安",
        "tags": ["市聯醫", "急診創傷"]
    },
    {
        "id": "0101090517",
        "name": "臺北市立聯合醫院中興院區",
        "shortName": "北市聯醫",
        "area": "01",
        "city": "臺北市",
        "district": "大同區",
        "lat": 25.0507,
        "lng": 121.5085,
        "address": "臺北市大同區鄭州路145號",
        "phone": "02-25523234",
        "tier": "急救責任醫院",
        "nearMetro": "G13 北門 / BL11 台北車站",
        "tags": ["市聯醫", "社區急診"]
    },
    {
        "id": "1131010011",
        "name": "亞東紀念醫院",
        "shortName": "亞東",
        "area": "31",
        "city": "新北市",
        "district": "板橋區",
        "lat": 24.9976,
        "lng": 121.4526,
        "address": "新北市板橋區南雅南路二段21號",
        "phone": "02-89667000",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "BL05 亞東醫院",
        "tags": ["醫學中心", "重度創傷", "新北南區樞紐"]
    },
    {
        "id": "1331040513",
        "name": "衛生福利部雙和醫院",
        "shortName": "雙和",
        "area": "31",
        "city": "新北市",
        "district": "中和區",
        "lat": 24.9934,
        "lng": 121.4947,
        "address": "新北市中和區中正路291號",
        "phone": "02-22490088",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "Y13 中和 / Y14 景安",
        "tags": ["醫學中心", "中風急救", "重症照護"]
    },
    {
        "id": "0131060029",
        "name": "衛生福利部臺北醫院",
        "shortName": "部立臺北",
        "area": "31",
        "city": "新北市",
        "district": "新莊區",
        "lat": 25.0422,
        "lng": 121.4589,
        "address": "新北市新莊區思源路127號",
        "phone": "02-22765566",
        "tier": "重度級急救責任醫院",
        "nearMetro": "O17 頭前庄 / Y18 幸福",
        "tags": ["部立重度", "新莊三重急救"]
    },
    {
        "id": "1131050515",
        "name": "佛教慈濟醫療財團法人台北慈濟醫院",
        "shortName": "台北慈濟",
        "area": "31",
        "city": "新北市",
        "district": "新店區",
        "lat": 24.9856,
        "lng": 121.5369,
        "address": "新北市新店區建國路289號",
        "phone": "02-66289779",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "G04 大坪林 / G03 七張",
        "tags": ["醫學中心", "文山新店急救"]
    },
    {
        "id": "1131020017",
        "name": "淡水馬偕紀念醫院",
        "shortName": "淡水馬偕",
        "area": "31",
        "city": "新北市",
        "district": "淡水區",
        "lat": 25.1378,
        "lng": 121.4604,
        "address": "新北市淡水區民生路45號",
        "phone": "02-28094661",
        "tier": "重度級急救責任醫院",
        "nearMetro": "R26 竹圍",
        "tags": ["重度急救", "北海岸樞紐"]
    },
    # 桃竹苗地區
    {
        "id": "1132070014",
        "name": "長庚醫療財團法人林口長庚紀念醫院",
        "shortName": "林口長庚",
        "area": "32",
        "city": "桃園市",
        "district": "龜山區",
        "lat": 25.0605,
        "lng": 121.3688,
        "address": "桃園市龜山區復興街5號",
        "phone": "03-3281200",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "A8 長庚醫院",
        "tags": ["全台最大醫學中心", "重度創傷", "器官移植"]
    },
    {
        "id": "0132010014",
        "name": "衛生福利部桃園醫院",
        "shortName": "部立桃園",
        "area": "32",
        "city": "桃園市",
        "district": "桃園區",
        "lat": 24.9782,
        "lng": 121.2694,
        "address": "桃園市桃園區中山路1492號",
        "phone": "03-3699721",
        "tier": "重度級急救責任醫院",
        "nearMetro": "TRA 內壢 / 桃園公車幹線",
        "tags": ["重度急救", "防疫專責"]
    },
    {
        "id": "0434010518",
        "name": "國立陽明交通大學附設醫院",
        "shortName": "陽交大附醫",
        "area": "34",
        "city": "宜蘭縣",
        "district": "宜蘭市",
        "lat": 24.7571,
        "lng": 121.7584,
        "address": "宜蘭縣宜蘭市校舍路169號",
        "phone": "03-9325192",
        "tier": "重度級急救責任醫院",
        "nearMetro": "TRA 宜蘭站",
        "tags": ["重度急救", "蘭陽平原重鎮"]
    },
    # 台中與中部地區
    {
        "id": "0617060018",
        "name": "臺中榮民總醫院",
        "shortName": "台中榮總",
        "area": "17",
        "city": "臺中市",
        "district": "西屯區",
        "lat": 24.1837,
        "lng": 120.6015,
        "address": "臺中市西屯區臺灣大道四段1650號",
        "phone": "04-23592525",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "台中快捷公車 榮總/東海大學站",
        "tags": ["醫學中心", "中台灣急救樞紐"]
    },
    {
        "id": "1317050017",
        "name": "中國醫藥大學附設醫院",
        "shortName": "中國附醫",
        "area": "17",
        "city": "臺中市",
        "district": "北區",
        "lat": 24.1568,
        "lng": 120.6826,
        "address": "臺中市北區育德路2號",
        "phone": "04-22052121",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "台中捷運綠線 轉乘公車 / 台鐵台中站",
        "tags": ["醫學中心", "重度外傷", "中西醫結合"]
    },
    {
        "id": "1317040011",
        "name": "中山醫學大學附設醫院",
        "shortName": "中山附醫",
        "area": "17",
        "city": "臺中市",
        "district": "南區",
        "lat": 24.1226,
        "lng": 120.6508,
        "address": "臺中市南區建國北路一段110號",
        "phone": "04-24739595",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "115 大慶 / TRA 大慶站",
        "tags": ["醫學中心", "雙鐵共構急救站"]
    },
    {
        "id": "1137010018",
        "name": "彰化基督教醫療財團法人彰化基督教醫院",
        "shortName": "彰化基督教",
        "area": "37",
        "city": "彰化縣",
        "district": "彰化市",
        "lat": 24.0725,
        "lng": 120.5434,
        "address": "彰化縣彰化市南校街135號",
        "phone": "04-7238595",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "TRA 彰化站",
        "tags": ["醫學中心", "彰化南投急救旗艦"]
    },
    # 南部與東部
    {
        "id": "0421040011",
        "name": "國立成功大學醫學院附設醫院",
        "shortName": "成大",
        "area": "21",
        "city": "臺南市",
        "district": "北區",
        "lat": 23.0016,
        "lng": 120.2208,
        "address": "臺南市北區勝利路138號",
        "phone": "06-2353535",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "TRA 台南站 後站",
        "tags": ["醫學中心", "南台灣創傷中心"]
    },
    {
        "id": "1121050012",
        "name": "奇美醫療財團法人奇美醫院",
        "shortName": "奇美",
        "area": "21",
        "city": "臺南市",
        "district": "永康區",
        "lat": 23.0215,
        "lng": 120.2226,
        "address": "臺南市永康區中華路901號",
        "phone": "06-2812811",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "TRA 大橋站 (步行1分)",
        "tags": ["醫學中心", "火車站直達"]
    },
    {
        "id": "0602030019",
        "name": "高雄榮民總醫院",
        "shortName": "高榮",
        "area": "02",
        "city": "高雄市",
        "district": "左營區",
        "lat": 22.6781,
        "lng": 120.3205,
        "address": "高雄市左營區大中一路386號",
        "phone": "07-3422121",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "R16 左營高鐵站轉乘公車",
        "tags": ["醫學中心", "高屏重度外傷"]
    },
    {
        "id": "1102050010",
        "name": "高雄醫學大學附設中和紀念醫院",
        "shortName": "高醫",
        "area": "02",
        "city": "高雄市",
        "district": "三民區",
        "lat": 22.6461,
        "lng": 120.3094,
        "address": "高雄市三民區自由一路100號",
        "phone": "07-3121101",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "R12 後驛 / C24 愛河之心",
        "tags": ["醫學中心", "市中心急救重鎮"]
    },
    {
        "id": "1142100017",
        "name": "長庚醫療財團法人高雄長庚紀念醫院",
        "shortName": "高雄長庚",
        "area": "02",
        "city": "高雄市",
        "district": "鳥松區",
        "lat": 22.6505,
        "lng": 120.3562,
        "address": "高雄市鳥松區大埤路123號",
        "phone": "07-7317123",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "高雄輕軌 / 澄清湖幹線公車",
        "tags": ["醫學中心", "肝臟移植與重大急救"]
    },
    {
        "id": "1145010010",
        "name": "佛教慈濟醫療財團法人花蓮慈濟醫院",
        "shortName": "花蓮慈濟",
        "area": "45",
        "city": "花蓮縣",
        "district": "花蓮市",
        "lat": 23.9996,
        "lng": 121.5997,
        "address": "花蓮縣花蓮市中央路三段707號",
        "phone": "03-8561825",
        "tier": "重度級急救責任醫院 (醫學中心)",
        "nearMetro": "TRA 花蓮站",
        "tags": ["醫學中心", "東台灣急救後盾"]
    }
]

# -------------------------------------------------------------
# 2. Transit Network Database (全台捷運、台鐵高鐵、公車幹線、YouBike)
# -------------------------------------------------------------
METRO_LINES = [
    # 台北捷運 板南線 (BL)
    {
        "id": "BL",
        "name": "板南線",
        "color": "#0070BD",
        "speed": 55,
        "stations": [
            {"id": "BL01", "name": "頂埔", "lat": 24.9593, "lng": 121.4194},
            {"id": "BL02", "name": "永寧", "lat": 24.9667, "lng": 121.4361},
            {"id": "BL03", "name": "土城", "lat": 24.9730, "lng": 121.4444},
            {"id": "BL04", "name": "海山", "lat": 24.9854, "lng": 121.4487},
            {"id": "BL05", "name": "亞東醫院", "lat": 24.9980, "lng": 121.4524, "hospitalId": "1131010011"},
            {"id": "BL06", "name": "府中", "lat": 25.0086, "lng": 121.4594},
            {"id": "BL07", "name": "板橋", "lat": 25.0136, "lng": 121.4623, "isTransfer": True, "modes": ["THSR", "TRA"]},
            {"id": "BL08", "name": "新埔", "lat": 25.0238, "lng": 121.4684},
            {"id": "BL09", "name": "江子翠", "lat": 25.0300, "lng": 121.4726},
            {"id": "BL10", "name": "龍山寺", "lat": 25.0363, "lng": 121.4998},
            {"id": "BL11", "name": "西門", "lat": 25.0421, "lng": 121.5083, "isTransfer": True},
            {"id": "BL12", "name": "台北車站", "lat": 25.0463, "lng": 121.5175, "isTransfer": True, "modes": ["THSR", "TRA", "Airport"]},
            {"id": "BL13", "name": "善導寺", "lat": 25.0448, "lng": 121.5233, "hospitalId": "0401180023"},
            {"id": "BL14", "name": "忠孝新生", "lat": 25.0422, "lng": 121.5332, "isTransfer": True},
            {"id": "BL15", "name": "忠孝復興", "lat": 25.0416, "lng": 121.5441, "isTransfer": True},
            {"id": "BL16", "name": "忠孝敦化", "lat": 25.0415, "lng": 121.5513, "hospitalId": "1101020018"},
            {"id": "BL17", "name": "國父紀念館", "lat": 25.0413, "lng": 121.5577},
            {"id": "BL18", "name": "市政府", "lat": 25.0412, "lng": 121.5651},
            {"id": "BL19", "name": "永春", "lat": 25.0407, "lng": 121.5762},
            {"id": "BL20", "name": "後山埤", "lat": 25.0450, "lng": 121.5828},
            {"id": "BL21", "name": "昆陽", "lat": 25.0503, "lng": 121.5933, "hospitalId": "0501110514"},
            {"id": "BL22", "name": "南港", "lat": 25.0521, "lng": 121.6069, "isTransfer": True, "modes": ["THSR", "TRA"]},
            {"id": "BL23", "name": "南港展覽館", "lat": 25.0553, "lng": 121.6174, "isTransfer": True}
        ]
    },
    # 台北捷運 淡水信義線 (R)
    {
        "id": "R",
        "name": "淡水信義線",
        "color": "#E3002C",
        "speed": 55,
        "stations": [
            {"id": "R28", "name": "淡水", "lat": 25.1678, "lng": 121.4455},
            {"id": "R26", "name": "竹圍", "lat": 25.1369, "lng": 121.4597, "hospitalId": "1131020017"},
            {"id": "R22", "name": "北投", "lat": 25.1319, "lng": 121.4986, "isTransfer": True},
            {"id": "R19", "name": "石牌", "lat": 25.1147, "lng": 121.5157, "hospitalId": "0601160016"},
            {"id": "R16", "name": "士林", "lat": 25.0936, "lng": 121.5262, "hospitalId": "1101150015"},
            {"id": "R15", "name": "劍潭", "lat": 25.0849, "lng": 121.5250},
            {"id": "R14", "name": "圓山", "lat": 25.0712, "lng": 121.5201},
            {"id": "R12", "name": "雙連", "lat": 25.0578, "lng": 121.5206, "hospitalId": "1101010012"},
            {"id": "R11", "name": "中山", "lat": 25.0531, "lng": 121.5204, "isTransfer": True},
            {"id": "R10", "name": "台北車站", "lat": 25.0463, "lng": 121.5175, "isTransfer": True},
            {"id": "R09", "name": "臺大醫院", "lat": 25.0414, "lng": 121.5161, "hospitalId": "0401180014"},
            {"id": "R08", "name": "中正紀念堂", "lat": 25.0347, "lng": 121.5186, "isTransfer": True},
            {"id": "R07", "name": "東門", "lat": 25.0339, "lng": 121.5287, "isTransfer": True},
            {"id": "R06", "name": "大安森林公園", "lat": 25.0334, "lng": 121.5352},
            {"id": "R05", "name": "大安", "lat": 25.0329, "lng": 121.5435, "hospitalId": "0101020017", "isTransfer": True},
            {"id": "R04", "name": "信義安和", "lat": 25.0333, "lng": 121.5531, "hospitalId": "1101020018"},
            {"id": "R03", "name": "台北101/世貿", "lat": 25.0330, "lng": 121.5639},
            {"id": "R02", "name": "象山", "lat": 25.0329, "lng": 121.5709}
        ]
    },
    # 台北捷運 松山新店線 (G)
    {
        "id": "G",
        "name": "松山新店線",
        "color": "#008659",
        "speed": 55,
        "stations": [
            {"id": "G01", "name": "新店", "lat": 24.9577, "lng": 121.5375},
            {"id": "G03", "name": "七張", "lat": 24.9753, "lng": 121.5428},
            {"id": "G04", "name": "大坪林", "lat": 24.9829, "lng": 121.5414, "hospitalId": "1131050515", "isTransfer": True},
            {"id": "G07", "name": "公館", "lat": 25.0136, "lng": 121.5342},
            {"id": "G08", "name": "台電大樓", "lat": 25.0207, "lng": 121.5283},
            {"id": "G09", "name": "古亭", "lat": 25.0264, "lng": 121.5229, "isTransfer": True},
            {"id": "G10", "name": "中正紀念堂", "lat": 25.0347, "lng": 121.5186, "isTransfer": True},
            {"id": "G12", "name": "西門", "lat": 25.0421, "lng": 121.5083, "isTransfer": True},
            {"id": "G13", "name": "北門", "lat": 25.0494, "lng": 121.5108, "hospitalId": "0101090517"},
            {"id": "G14", "name": "中山", "lat": 25.0531, "lng": 121.5204, "isTransfer": True},
            {"id": "G15", "name": "松江南京", "lat": 25.0520, "lng": 121.5330, "isTransfer": True},
            {"id": "G16", "name": "南京復興", "lat": 25.0521, "lng": 121.5440, "isTransfer": True},
            {"id": "G17", "name": "台北小巨蛋", "lat": 25.0518, "lng": 121.5532},
            {"id": "G18", "name": "南京三民", "lat": 25.0514, "lng": 121.5645},
            {"id": "G19", "name": "松山", "lat": 25.0501, "lng": 121.5779, "isTransfer": True, "modes": ["TRA"]}
        ]
    },
    # 台北捷運 中和新蘆線 (O)
    {
        "id": "O",
        "name": "中和新蘆線",
        "color": "#F89A1C",
        "speed": 55,
        "stations": [
            {"id": "O01", "name": "南勢角", "lat": 24.9901, "lng": 121.5097},
            {"id": "O02", "name": "景安", "lat": 24.9939, "lng": 121.5049, "hospitalId": "1331040513", "isTransfer": True},
            {"id": "O05", "name": "頂溪", "lat": 25.0135, "lng": 121.5152},
            {"id": "O06", "name": "古亭", "lat": 25.0264, "lng": 121.5229, "isTransfer": True},
            {"id": "O07", "name": "東門", "lat": 25.0339, "lng": 121.5287, "isTransfer": True},
            {"id": "O08", "name": "忠孝新生", "lat": 25.0422, "lng": 121.5332, "isTransfer": True},
            {"id": "O09", "name": "松江南京", "lat": 25.0520, "lng": 121.5330, "isTransfer": True},
            {"id": "O10", "name": "行天宮", "lat": 25.0598, "lng": 121.5331},
            {"id": "O11", "name": "民權西路", "lat": 25.0629, "lng": 121.5195, "isTransfer": True},
            {"id": "O12", "name": "大橋頭", "lat": 25.0633, "lng": 121.5113, "isTransfer": True},
            {"id": "O17", "name": "頭前庄", "lat": 25.0396, "lng": 121.4614, "hospitalId": "0131060029", "isTransfer": True},
            {"id": "O19", "name": "輔大", "lat": 25.0331, "lng": 121.4363},
            {"id": "O21", "name": "迴龍", "lat": 25.0219, "lng": 121.4116}
        ]
    },
    # 台北捷運 文湖線 (BR)
    {
        "id": "BR",
        "name": "文湖線",
        "color": "#C48C31",
        "speed": 45,
        "stations": [
            {"id": "BR01", "name": "動物園", "lat": 24.9982, "lng": 121.5794},
            {"id": "BR04", "name": "萬芳醫院", "lat": 25.0003, "lng": 121.5583, "hospitalId": "1301150011"},
            {"id": "BR09", "name": "大安", "lat": 25.0329, "lng": 121.5435, "isTransfer": True},
            {"id": "BR10", "name": "忠孝復興", "lat": 25.0416, "lng": 121.5441, "isTransfer": True},
            {"id": "BR11", "name": "南京復興", "lat": 25.0521, "lng": 121.5440, "isTransfer": True},
            {"id": "BR12", "name": "中山國中", "lat": 25.0608, "lng": 121.5442},
            {"id": "BR13", "name": "松山機場", "lat": 25.0630, "lng": 121.5516},
            {"id": "BR15", "name": "劍南路", "lat": 25.0849, "lng": 121.5556},
            {"id": "BR20", "name": "葫洲", "lat": 25.0734, "lng": 121.6069, "hospitalId": "0501110514"},
            {"id": "BR24", "name": "南港展覽館", "lat": 25.0553, "lng": 121.6174, "isTransfer": True}
        ]
    },
    # 桃園機場捷運 (A)
    {
        "id": "A",
        "name": "桃園機場捷運",
        "color": "#84329B",
        "speed": 65,
        "stations": [
            {"id": "A1", "name": "台北車站", "lat": 25.0492, "lng": 121.5134, "isTransfer": True},
            {"id": "A2", "name": "三重", "lat": 25.0556, "lng": 121.4842, "isTransfer": True},
            {"id": "A3", "name": "新北產業園區", "lat": 25.0614, "lng": 121.4604, "isTransfer": True},
            {"id": "A8", "name": "長庚醫院", "lat": 25.0605, "lng": 121.3688, "hospitalId": "1132070014"},
            {"id": "A12", "name": "機場第一航廈", "lat": 25.0807, "lng": 121.2397},
            {"id": "A13", "name": "機場第二航廈", "lat": 25.0772, "lng": 121.2323},
            {"id": "A18", "name": "高鐵桃園站", "lat": 25.0125, "lng": 121.2144, "isTransfer": True, "modes": ["THSR"]},
            {"id": "A21", "name": "環北", "lat": 24.9664, "lng": 121.2227}
        ]
    },
    # 高雄捷運 紅線 (KR)
    {
        "id": "KR",
        "name": "高雄捷運紅線",
        "color": "#E60012",
        "speed": 55,
        "stations": [
            {"id": "KR01", "name": "南岡山", "lat": 22.7797, "lng": 120.3014},
            {"id": "KR16", "name": "左營(高鐵)", "lat": 22.6874, "lng": 120.3082, "isTransfer": True, "modes": ["THSR", "TRA"], "hospitalId": "0602030019"},
            {"id": "KR14", "name": "巨蛋", "lat": 22.6659, "lng": 120.3031},
            {"id": "KR12", "name": "後驛", "lat": 22.6461, "lng": 120.3040, "hospitalId": "1102050010"},
            {"id": "KR11", "name": "高雄車站", "lat": 22.6394, "lng": 120.3023, "isTransfer": True, "modes": ["TRA"]},
            {"id": "KR10", "name": "美麗島", "lat": 22.6314, "lng": 120.3019, "isTransfer": True},
            {"id": "KR09", "name": "中央公園", "lat": 22.6247, "lng": 120.3006},
            {"id": "KR08", "name": "三多商圈", "lat": 22.6139, "lng": 120.3043},
            {"id": "KR04", "name": "小港", "lat": 22.5654, "lng": 120.3542}
        ]
    },
    # 台中捷運 綠線 (TML)
    {
        "id": "TML",
        "name": "台中捷運綠線",
        "color": "#81C043",
        "speed": 50,
        "stations": [
            {"id": "103a", "name": "北屯總站", "lat": 24.1923, "lng": 120.7107},
            {"id": "106", "name": "文心中清", "lat": 24.1751, "lng": 120.6725},
            {"id": "110", "name": "市政府", "lat": 24.1611, "lng": 120.6466},
            {"id": "115", "name": "大慶", "lat": 24.1166, "lng": 120.6502, "hospitalId": "1317040011", "isTransfer": True, "modes": ["TRA"]},
            {"id": "119", "name": "高鐵台中站", "lat": 24.1118, "lng": 120.6156, "isTransfer": True, "modes": ["THSR", "TRA"]}
        ]
    }
]

# -------------------------------------------------------------
# 3. High Speed Rail & Major TRA Stations
# -------------------------------------------------------------
THSR_TRA_STATIONS = [
    {"id": "THSR_01", "name": "高鐵南港站", "type": "THSR", "lat": 25.0521, "lng": 121.6069, "speed": 220},
    {"id": "THSR_02", "name": "高鐵台北站", "type": "THSR", "lat": 25.0478, "lng": 121.5170, "speed": 220},
    {"id": "THSR_03", "name": "高鐵板橋站", "type": "THSR", "lat": 25.0136, "lng": 121.4623, "speed": 220},
    {"id": "THSR_04", "name": "高鐵桃園站", "type": "THSR", "lat": 25.0125, "lng": 121.2144, "speed": 220},
    {"id": "THSR_05", "name": "高鐵新竹站", "type": "THSR", "lat": 24.8083, "lng": 121.0403, "speed": 220},
    {"id": "THSR_06", "name": "高鐵台中站", "type": "THSR", "lat": 24.1118, "lng": 120.6156, "speed": 220},
    {"id": "THSR_07", "name": "高鐵嘉義站", "type": "THSR", "lat": 23.4593, "lng": 120.3233, "speed": 220},
    {"id": "THSR_08", "name": "高鐵台南站", "type": "THSR", "lat": 22.9247, "lng": 120.2858, "speed": 220},
    {"id": "THSR_09", "name": "高鐵左營站", "type": "THSR", "lat": 22.6874, "lng": 120.3082, "speed": 220},
    {"id": "TRA_YILAN", "name": "台鐵宜蘭站", "type": "TRA", "lat": 24.7547, "lng": 121.7582, "speed": 100, "hospitalId": "0434010518"},
    {"id": "TRA_HUALIEN", "name": "台鐵花蓮站", "type": "TRA", "lat": 23.9934, "lng": 121.6015, "speed": 100, "hospitalId": "1145010010"}
]

# -------------------------------------------------------------
# 4. Bus Trunk Routes (豐富主要公車路網：307、信義、承德、南京、復興、299、台灣大道幹線等)
# -------------------------------------------------------------
BUS_ROUTES = [
    {
        "id": "BUS_307",
        "name": "307 幹線公車 (板橋 - 撫遠街)",
        "color": "#16A34A",
        "speed": 30,
        "stops": [
            {"id": "B307_1", "name": "板橋公車站", "lat": 25.0142, "lng": 121.4635},
            {"id": "B307_2", "name": "積穗國中", "lat": 25.0062, "lng": 121.4812},
            {"id": "B307_3", "name": "中和連城路", "lat": 24.9995, "lng": 121.4925},
            {"id": "B307_4", "name": "雙和醫院(中正路)", "lat": 24.9934, "lng": 121.4947, "hospitalId": "1331040513"},
            {"id": "B307_5", "name": "西門市場", "lat": 25.0426, "lng": 121.5074},
            {"id": "B307_6", "name": "台北車站(忠孝)", "lat": 25.0463, "lng": 121.5175},
            {"id": "B307_7", "name": "南京復興路口", "lat": 25.0521, "lng": 121.5440},
            {"id": "B307_8", "name": "三軍總醫院松山分院", "lat": 25.0560, "lng": 121.5600},
            {"id": "B307_9", "name": "撫遠街", "lat": 25.0615, "lng": 121.5685}
        ]
    },
    {
        "id": "BUS_XINYI",
        "name": "信義幹線 (台北車站 - 永春高中)",
        "color": "#059669",
        "speed": 28,
        "stops": [
            {"id": "BX_1", "name": "台北車站(青島)", "lat": 25.0435, "lng": 121.5188},
            {"id": "BX_2", "name": "臺大醫院(常德)", "lat": 25.0402, "lng": 121.5186, "hospitalId": "0401180014"},
            {"id": "BX_3", "name": "中正紀念堂(愛國)", "lat": 25.0332, "lng": 121.5195},
            {"id": "BX_4", "name": "仁愛醫院(大安路)", "lat": 25.0378, "lng": 121.5435, "hospitalId": "0101020017"},
            {"id": "BX_5", "name": "國泰醫院(仁愛)", "lat": 25.0375, "lng": 121.5511, "hospitalId": "1101020018"},
            {"id": "BX_6", "name": "台北101世貿", "lat": 25.0330, "lng": 121.5639},
            {"id": "BX_7", "name": "象山公園", "lat": 25.0315, "lng": 121.5720}
        ]
    },
    {
        "id": "BUS_CHENGDE",
        "name": "承德幹線 (新北投 - 捷運市政府)",
        "color": "#047857",
        "speed": 29,
        "stops": [
            {"id": "BCD_1", "name": "北榮(石牌路)", "lat": 25.1207, "lng": 121.5201, "hospitalId": "0601160016"},
            {"id": "BCD_2", "name": "新光醫院(文昌)", "lat": 25.0933, "lng": 121.5218, "hospitalId": "1101150015"},
            {"id": "BCD_3", "name": "捷運圓山站", "lat": 25.0712, "lng": 121.5201},
            {"id": "BCD_4", "name": "台北馬偕(中山北)", "lat": 25.0583, "lng": 121.5226, "hospitalId": "1101010012"},
            {"id": "BCD_5", "name": "台北車站(承德)", "lat": 25.0485, "lng": 121.5172},
            {"id": "BCD_6", "name": "捷運市政府站", "lat": 25.0410, "lng": 121.5655}
        ]
    },
    {
        "id": "BUS_NANJING",
        "name": "南京幹線 (圓環 - 南港高工)",
        "color": "#0d9488",
        "speed": 30,
        "stops": [
            {"id": "BNJ_1", "name": "圓環(南京)", "lat": 25.0538, "lng": 121.5142},
            {"id": "BNJ_2", "name": "捷運中山站", "lat": 25.0528, "lng": 121.5205},
            {"id": "BNJ_3", "name": "捷運松江南京", "lat": 25.0520, "lng": 121.5330},
            {"id": "BNJ_4", "name": "捷運南京復興", "lat": 25.0521, "lng": 121.5440},
            {"id": "BNJ_5", "name": "台北小巨蛋", "lat": 25.0518, "lng": 121.5532},
            {"id": "BNJ_6", "name": "南京三民", "lat": 25.0514, "lng": 121.5645},
            {"id": "BNJ_7", "name": "南港展覽館", "lat": 25.0553, "lng": 121.6174}
        ]
    },
    {
        "id": "BUS_299",
        "name": "299 公車 (輔大 - 永春高中)",
        "color": "#15803d",
        "speed": 28,
        "stops": [
            {"id": "B299_1", "name": "輔仁大學", "lat": 25.0331, "lng": 121.4363},
            {"id": "B299_2", "name": "新莊思源路口", "lat": 25.0422, "lng": 121.4589, "hospitalId": "0131060029"},
            {"id": "B299_3", "name": "三重重新路", "lat": 25.0550, "lng": 121.4850},
            {"id": "B299_4", "name": "台北車站(忠孝西)", "lat": 25.0463, "lng": 121.5175},
            {"id": "B299_5", "name": "國父紀念館", "lat": 25.0413, "lng": 121.5577}
        ]
    }
]

# -------------------------------------------------------------
# 5. YouBike Stations (密集單車站點群)
# -------------------------------------------------------------
YOUBIKE_STATIONS = [
    {"id": "UB_01", "name": "YouBike 臺大醫院常德門", "lat": 25.0408, "lng": 121.5180, "bikes": 24, "hospitalId": "0401180014"},
    {"id": "UB_02", "name": "YouBike 台大兒醫(中山南路)", "lat": 25.0445, "lng": 121.5202, "bikes": 18, "hospitalId": "0401180023"},
    {"id": "UB_03", "name": "YouBike 北榮石牌路二段", "lat": 25.1201, "lng": 121.5195, "bikes": 30, "hospitalId": "0601160016"},
    {"id": "UB_04", "name": "YouBike 馬偕醫院民生西路", "lat": 25.0575, "lng": 121.5230, "bikes": 22, "hospitalId": "1101010012"},
    {"id": "UB_05", "name": "YouBike 國泰醫院仁愛路", "lat": 25.0370, "lng": 121.5515, "bikes": 16, "hospitalId": "1101020018"},
    {"id": "UB_06", "name": "YouBike 亞東醫院南雅南路", "lat": 24.9972, "lng": 121.4530, "bikes": 28, "hospitalId": "1131010011"},
    {"id": "UB_07", "name": "YouBike 雙和醫院中正路", "lat": 24.9930, "lng": 121.4952, "bikes": 20, "hospitalId": "1331040513"},
    {"id": "UB_08", "name": "YouBike 新光醫院文昌路", "lat": 25.0930, "lng": 121.5222, "bikes": 15, "hospitalId": "1101150015"},
    {"id": "UB_09", "name": "YouBike 萬芳醫院興隆路", "lat": 25.0008, "lng": 121.5580, "bikes": 25, "hospitalId": "1301150011"},
    {"id": "UB_10", "name": "YouBike 部立臺北醫院", "lat": 25.0425, "lng": 121.4595, "bikes": 19, "hospitalId": "0131060029"},
    {"id": "UB_11", "name": "YouBike 台北車站東門", "lat": 25.0468, "lng": 121.5185, "bikes": 45},
    {"id": "UB_12", "name": "YouBike 西門捷運站1號出口", "lat": 25.0424, "lng": 121.5078, "bikes": 32},
    {"id": "UB_13", "name": "YouBike 忠孝復興2號出口", "lat": 25.0412, "lng": 121.5448, "bikes": 26},
    {"id": "UB_14", "name": "YouBike 市政府捷運站3號出口", "lat": 25.0410, "lng": 121.5660, "bikes": 35},
    {"id": "UB_15", "name": "YouBike 大安森林公園信義路", "lat": 25.0336, "lng": 121.5360, "bikes": 40},
    {"id": "UB_16", "name": "YouBike 板橋車站新站路", "lat": 25.0130, "lng": 121.4640, "bikes": 38},
    {"id": "UB_17", "name": "YouBike 士林捷運站2號出口", "lat": 25.0930, "lng": 121.5270, "bikes": 20},
    {"id": "UB_18", "name": "YouBike 新店大坪林民權路", "lat": 24.9835, "lng": 121.5420, "bikes": 22},
    {"id": "UB_19", "name": "YouBike 高鐵左營站前廣場", "lat": 22.6880, "lng": 120.3088, "bikes": 30},
    {"id": "UB_20", "name": "YouBike 台中捷運市政府站", "lat": 24.1615, "lng": 120.6472, "bikes": 28}
]

# Output hospitals.json
hospitals_path = os.path.join(OUTPUT_DIR, "hospitals.json")
with open(hospitals_path, "w", encoding="utf-8") as f:
    json.dump(HOSPITALS, f, ensure_ascii=False, indent=2)
print(f"✅ Generated {hospitals_path} ({len(HOSPITALS)} hospitals)")

# Output transit_network.json
transit_data = {
    "metro": METRO_LINES,
    "rail": THSR_TRA_STATIONS,
    "bus": BUS_ROUTES,
    "youbike": YOUBIKE_STATIONS,
    "speeds": {
        "WALK": 4.5,
        "BIKE": 18.0,
        "BUS": 30.0,
        "METRO": 55.0,
        "TRA": 100.0,
        "THSR": 220.0
    }
}

transit_path = os.path.join(OUTPUT_DIR, "transit_network.json")
with open(transit_path, "w", encoding="utf-8") as f:
    json.dump(transit_data, f, ensure_ascii=False, indent=2)
print(f"✅ Generated {transit_path} ({len(METRO_LINES)} metro lines, {len(THSR_TRA_STATIONS)} rails, {len(BUS_ROUTES)} bus trunks, {len(YOUBIKE_STATIONS)} youbikes)")

print("🎉 Datasets successfully updated!")
