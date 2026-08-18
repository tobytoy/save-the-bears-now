# 🐻 即刻救熊：大眾運輸救援大作戰 (Save the Bears Now!)

[即刻遊玩](https://tobytoy.github.io/save-the-bears-now/)

> 一款結合「可愛純向量手繪風格、真實大眾交通路網、衛福部健保署急診即時開放資料與真實生活突發應急模擬」的互動救援網頁遊戲。

![GitHub Actions Status](https://img.shields.io/badge/deploy-GitHub%20Pages-success?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet)

---

## 🚑 為什麼需要這款真實應急模擬器？

在現實生活中，如果自己、家人或路邊陌生人突發**中暑昏倒、骨折受傷、氣喘發作**，常常會遇到：
- 叫不到計程車 / 平面道路嚴重塞車
- 救護車調度繁忙或短程送醫需求
- 衝到大醫院才發現急診室早已「滿床大塞車」，只能在走廊推床苦等！

這款遊戲直接將 **台灣真實大眾交通網絡（捷運、YouBike、公車、台鐵高鐵）** 與 **衛福部健保署急診即時 API** 結合：
> **「平時在遊戲中多模擬練習，真實意外發生時就不會慌成一團、呆呆不知道該搭什麼車、該去哪家急診！」**

---

## 🎮 遊戲核心玩法與操作

### 🕹️ 鍵盤操作速查表
- `W` / `A` / `S` / `D` 或 `↑` `↓` `←` `→`：上下左右移動（依當前載具速度行進）
- `Space 空白鍵` / `Enter`：靠近小熊時「抱起救援」、抵達醫院時「送入急診」
- `1` 步行 (4.5km/h) / `2` YouBike (18km/h) / `3` 捷運 (55km/h) / `4` 幹線公車 (30km/h) / `5` 高鐵 (220km/h)
- `H`：開啟全台急診即時看板 / `B`：開啟熊熊圖鑑

### 🖱️ 滑鼠與觸控操作
- 點擊下方 HUD「鄰近大眾交通站點」或地圖上的捷運站/YouBike 站即可一鍵乘車秒速前往。
- 畫面右下方設有螢幕虛擬方向盤（上下左右鈕 + 愛心行動鈕），平板或手機皆可直覺單手操作。

---

## 🏥 健保署急診即時指標說明
- 🔴 **滿床通報 (`inform: Y`)**：急診留觀與 ICU 已飽和，送去將扣分並延誤救治！
- 🟢 **急診待床數 (`waitBed < 5`)**：床位充足，第一時間搶救，可獲 **+500 分加成與 3 星獎勵**！
- 🩺 **等待看診人數 (`waitSee`)** / 🛏️ **等待住院數 (`waitGeneral`)**。

---

## 🗺️ 多底圖圖層支援 (Multi-Layer Map)

- 🌙 **暗黑救援模式** (CartoDB Dark Matter)
- 🗺️ **臺灣通用電子地圖** (內政部國土測繪中心 NLSC WMTS)
- ☀️ **清新簡約模式** (CartoDB Positron)
- 🌍 **OpenStreetMap 標準地圖**
- 🛰️ **真實衛星影像圖層** (Esri World Imagery)
- 📷 **國土測繪正射航照影像** (NLSC Photo)

---

## 🛠️ 快速啟動

```bash
# 1. 安裝前端依賴
npm install

# 2. (可選) 重新抽取路網與醫院資料庫 (使用 conda toby 環境)
npm run fetch:data
# 或直接執行:
conda run -n toby python scripts/fetch_datasets.py

# 3. 本地開發預覽
npm run dev
# 瀏覽器開啟 http://localhost:3000

# 4. 生產打包
npm run build
```

---

## 📄 License
MIT License
