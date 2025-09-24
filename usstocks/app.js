// 全局變量
let appData = {};
let currentFlashcardIndex = 0;
let flashcardProgress = new Set();
let masteredCards = new Set();
let currentQuizIndex = 0;
let quizAnswers = [];
let quizStartTime = null;
let quizTimer = null;
let quizStats = {
    bestScore: 0,
    attempts: 0
};

// 初始化應用
document.addEventListener('DOMContentLoaded', function() {
    loadAppData();
    initializeNavigation();
    initializeFullscreen();
    populateContent();
    initializeFlashcards();
    initializeQuiz();
});

// 載入應用數據
function loadAppData() {
    // Directly use the comprehensive backup data as fetching from external URLs is unreliable.
    appData = getBackupData();
}

// 獲取備用數據 (已更新完整內容)
function getBackupData() {
    return {
        // Updated with full flashcard data
        "flashcards": [
            {"id": 1, "question": "在台灣投資美股主要有哪兩種管道？", "answer": "1. 國內券商複委託：透過台灣券商向海外券商下單\n2. 海外券商：直接開設海外券商帳戶進行交易"},
            {"id": 2, "question": "複委託的最大優點是什麼？", "answer": "1. 中文介面和客服\n2. 受台灣金管會監管保護\n3. 資金不用匯到國外\n4. 券商協助處理稅務問題（如退稅）"},
            {"id": 3, "question": "海外券商的主要優點是什麼？", "answer": "1. 手續費較低（多數零手續費）\n2. 投資標的更多元\n3. 即時報價\n4. 有股息再投資功能"},
            {"id": 4, "question": "複委託的手續費結構如何？", "answer": "約成交金額的0.1%~1%，且有最低手續費門檻（約15-50美元），適合大額或長期投資"},
            {"id": 5, "question": "美股與台股的交易單位有何不同？", "answer": "台股：1張（1,000股）為基本單位\n美股：1股為基本單位，可買零股"},
            {"id": 6, "question": "美股與台股的漲跌幅限制有何不同？", "answer": "台股：有10%漲跌幅限制\n美股：無漲跌幅限制，但有熔斷機制"},
            {"id": 7, "question": "美股的交易時間（台北時間）？", "answer": "夏令時間（3月中-11月中）：21:30-04:00\n冬令時間（11月中-3月中）：22:30-05:00"},
            {"id": 8, "question": "台灣人投資美股需要繳哪些稅？", "answer": "1. 美國：30%股息預扣稅（資本利得免稅）\n2. 台灣：海外所得稅（年收益超過100萬需申報）"},
            {"id": 9, "question": "什麼是QI資格？", "answer": "QI（Qualified Intermediary）是美國國稅局認定的合格中介機構，具此資格的券商可協助客戶辦理自動退稅"},
            {"id": 10, "question": "美股ETF的主要優點？", "answer": "1. 分散風險\n2. 管理費低（通常0.03%-0.5%）\n3. 流動性好\n4. 投資門檻低"},
            {"id": 11, "question": "REITs是什麼？", "answer": "Real Estate Investment Trusts（不動產投資信託），讓投資人透過購買股票成為房地產的間接投資者"},
            {"id": 12, "question": "美股三大指數是什麼？", "answer": "1. 道瓊工業指數（DJIA）\n2. 標準普爾500指數（S&P 500）\n3. 那斯達克指數（NASDAQ）"},
            {"id": 13, "question": "RSI指標的判讀標準？", "answer": "RSI > 70：市場過熱（超買）\nRSI < 30：市場過冷（超賣）\nRSI = 50：多空分水嶺"},
            {"id": 14, "question": "KD指標的黃金交叉是什麼？", "answer": "K線由下往上突破D線，通常被視為買進訊號，代表短期趨勢轉強"},
            {"id": 15, "question": "MACD指標主要用來判斷什麼？", "answer": "用來判斷股價趨勢變化，由DIF（快線）和MACD（慢線）組成，柱狀圖由負轉正為買訊，由正轉負為賣訊"},
            {"id": 16, "question": "美股投資的主要風險有哪些？", "answer": "1. 匯率風險\n2. 政治風險\n3. 流動性風險\n4. 產業集中風險\n5. 時差問題"},
            {"id": 17, "question": "美股市場的主要優勢？", "answer": "1. 市場規模大，流動性佳\n2. 監管嚴格，透明度高\n3. 產業多元化\n4. 長期報酬率較高"},
            {"id": 18, "question": "投資美股前需要開立哪些帳戶？", "answer": "1. 銀行外幣帳戶（交割帳戶）\n2. 證券複委託帳戶或海外券商帳戶"},
            {"id": 19, "question": "美股配息頻率通常如何？", "answer": "多數美股採季配息（每季一次），少數採月配息或年配息"},
            {"id": 20, "question": "什麼是ADR？", "answer": "American Depositary Receipt（美國存託憑證），讓非美國公司在美國交易所掛牌交易的憑證"},
            {"id": 21, "question": "VTI ETF追蹤什麼指數？", "answer": "追蹤CRSP美國全體股市指數，涵蓋美國全市場股票"},
            {"id": 22, "question": "SPY ETF的特色？", "answer": "追蹤S&P 500指數，是歷史最悠久的ETF之一，流動性極佳"},
            {"id": 23, "question": "投資美股ETF vs 個股的差異？", "answer": "ETF：風險分散、管理費用、被動管理\n個股：風險集中、無管理費、需主動研究"},
            {"id": 24, "question": "美股的盤前盤後交易是什麼？", "answer": "正常交易時間外的交易時段，流動性較低，價格波動可能較大"},
            {"id": 25, "question": "什麼是熔斷機制？", "answer": "當市場大幅下跌時暫停交易的機制，S&P 500下跌7%、13%、20%時會觸發"},
            {"id": 26, "question": "美股季報什麼時候公布？", "answer": "每季結束後45天內公布，集中在1月、4月、7月、10月"},
            {"id": 27, "question": "Price/Earnings Ratio（P/E）如何計算？", "answer": "股價除以每股盈餘（EPS），用來評估股票是否高估或低估"},
            {"id": 28, "question": "什麼是股票回購？", "answer": "公司用自有資金買回自家股票，通常被視為對股價的支撐"},
            {"id": 29, "question": "美股的股息殖利率通常多少？", "answer": "S&P 500平均約1.5-2.5%，個別高息股可達3-6%"},
            {"id": 30, "question": "投資科技股ETF的主要風險？", "answer": "1. 高波動性\n2. 估值風險\n3. 技術變化風險\n4. 集中度風險"},
            {"id": 31, "question": "什麼時候適合買進美股？", "answer": "1. 美元相對弱勢時\n2. 市場恐慌情緒時\n3. 定期定額分批買進\n4. 基本面良好時"},
            {"id": 32, "question": "美股投資的資產配置建議？", "answer": "建議根據風險承受度配置：\n保守：60%債券40%股票\n中等：50%債券50%股票\n積極：30%債券70%股票"},
            {"id": 33, "question": "複委託適合什麼樣的投資人？", "answer": "1. 投資新手\n2. 資金較大的投資人\n3. 不頻繁交易的長期投資人\n4. 希望資金留在國內的投資人"},
            {"id": 34, "question": "海外券商適合什麼樣的投資人？", "answer": "1. 頻繁交易的投資人\n2. 資金較小的投資人\n3. 希望投資標的多元化的投資人\n4. 在意手續費的投資人"},
            {"id": 35, "question": "美股的除權息日如何運作？", "answer": "Ex-Dividend Date當天開始，買入股票的投資人無法獲得該次配息，股價通常會下調配息金額"},
            {"id": 36, "question": "什麼是Dollar Cost Averaging？", "answer": "定期定額投資法，無論市場漲跌都定期投入固定金額，可降低平均成本"},
            {"id": 37, "question": "美股財報季對股市的影響？", "answer": "財報季期間股市波動通常較大，超預期的財報會推升股價，不如預期則可能下跌"},
            {"id": 38, "question": "投資美股需要多少資金？", "answer": "海外券商：最低可能只需幾美元\n複委託：建議至少3,000-5,000美元以上較划算"},
            {"id": 39, "question": "美股的市值加權是什麼意思？", "answer": "指數中各成分股的權重按市值大小分配，市值越大權重越高"},
            {"id": 40, "question": "什麼是Growth Stock vs Value Stock？", "answer": "Growth Stock：成長股，注重未來成長潛力\nValue Stock：價值股，目前股價相對便宜"},
            {"id": 41, "question": "美股投資如何避免匯率風險？", "answer": "1. 使用外幣計價ETF\n2. 匯率避險ETF\n3. 分批換匯\n4. 長期持有攤平匯率波動"},
            {"id": 42, "question": "什麼是Earnings Per Share (EPS)？", "answer": "每股盈餘，公司淨利潤除以流通股數，是評估公司獲利能力的重要指標"},
            {"id": 43, "question": "美股的Beta值代表什麼？", "answer": "衡量股票相對於大盤的波動性，Beta>1表示比大盤波動大，Beta<1表示波動較小"},
            {"id": 44, "question": "什麼時候美股市場休市？", "answer": "主要包括：新年、總統日、耶穌受難日、陣亡將士紀念日、獨立日、勞工節、感恩節、聖誕節"},
            {"id": 45, "question": "投資美股REITs的優點？", "answer": "1. 定期配息\n2. 通膨保值\n3. 分散投資組合\n4. 間接投資房地產\n5. 流動性比直接買房好"},
            {"id": 46, "question": "美股投資的長期平均報酬率？", "answer": "S&P 500歷史長期年化報酬率約9-10%（含股息再投資）"},
            {"id": 47, "question": "什麼是Market Capitalization？", "answer": "市值，股價乘以流通股數，用來衡量公司規模大小"},
            {"id": 48, "question": "投資美股需要注意的時差問題？", "answer": "美股交易時間對應台灣深夜至凌晨，需要調整作息或使用限價單"},
            {"id": 49, "question": "什麼是Stock Split？", "answer": "股票分割，公司將1股分成多股，降低股價但不改變總市值"},
            {"id": 50, "question": "美股投資組合再平衡的重要性？", "answer": "定期調整投資組合比例，確保風險控制和投資目標一致，建議每季或半年檢視一次"}
        ],
        // Updated with full quiz data
        "quiz_questions": [
            {"id": 1, "question": "台灣投資人透過複委託投資美股，手續費通常為成交金額的多少？", "options": ["0.05%-0.1%", "0.1%-1%", "1%-2%", "2%-3%"], "correct": 1, "explanation": "複委託手續費通常為成交金額的0.1%-1%，且大多有最低手續費門檻約15-50美元。"},
            {"id": 2, "question": "美股的交易單位是？", "options": ["1張（1000股）", "1股", "10股", "100股"], "correct": 1, "explanation": "美股的最小交易單位是1股，不像台股以1張（1000股）為基本單位。"},
            {"id": 3, "question": "台灣人投資美股獲得股息需要預扣多少稅款？", "options": ["10%", "20%", "30%", "40%"], "correct": 2, "explanation": "台灣人投資美股獲得股息需要預扣30%稅款，但買賣價差（資本利得）不需要繳稅。"},
            {"id": 4, "question": "RSI指標超過多少時通常被認為是超買狀態？", "options": ["60", "70", "80", "90"], "correct": 1, "explanation": "RSI指標超過70時通常被認為是超買狀態，低於30時為超賣狀態。"},
            {"id": 5, "question": "美股夏令時間的交易時間（台北時間）是？", "options": ["20:30-03:00", "21:30-04:00", "22:30-05:00", "23:30-06:00"], "correct": 1, "explanation": "美股夏令時間（3月中-11月中）對應台北時間21:30-04:00。"},
            {"id": 6, "question": "以下哪個不是美股三大指數？", "options": ["道瓊工業指數", "標準普爾500", "那斯達克指數", "羅素2000"], "correct": 3, "explanation": "美股三大指數是道瓊工業指數、標準普爾500、那斯達克指數。羅素2000是小型股指數。"},
            {"id": 7, "question": "REITs的全名是？", "options": ["Real Estate Investment Trusts", "Real Estate Income Tax", "Retail Estate Investment Trust", "Real Economy Investment Trust"], "correct": 0, "explanation": "REITs全名是Real Estate Investment Trusts（不動產投資信託）。"},
            {"id": 8, "question": "KD指標中，K線向上突破D線稱為？", "options": ["死亡交叉", "黃金交叉", "背離", "收斂"], "correct": 1, "explanation": "K線由下往上突破D線稱為黃金交叉，通常被視為買進訊號。"},
            {"id": 9, "question": "海外所得超過多少金額需要向台灣國稅局申報？", "options": ["50萬", "75萬", "100萬", "150萬"], "correct": 2, "explanation": "個人海外所得超過100萬元需要申報，但不一定要繳稅。"},
            {"id": 10, "question": "以下哪種投資方式手續費通常最低？", "options": ["國內複委託", "海外券商", "銀行信託", "投信基金"], "correct": 1, "explanation": "海外券商通常提供零手續費或極低手續費的交易服務。"},
            {"id": 11, "question": "美股ETF的管理費通常範圍是？", "options": ["0.01%-0.1%", "0.03%-0.5%", "0.5%-1%", "1%-2%"], "correct": 1, "explanation": "美股ETF的管理費通常在0.03%-0.5%之間，明顯低於主動管理基金。"},
            {"id": 12, "question": "投資美國債券相對於美股的稅務優勢是？", "options": ["股息稅較低", "利息收入免稅", "可以退稅", "稅率固定"], "correct": 1, "explanation": "台灣人投資美國政府公債的利息收入不需要繳稅給美國政府。"},
            {"id": 13, "question": "MACD指標的柱狀圖由負轉正表示？", "options": ["賣出訊號", "買進訊號", "持有訊號", "無明確訊號"], "correct": 1, "explanation": "MACD柱狀圖由負轉正通常被視為買進訊號，由正轉負為賣出訊號。"},
            {"id": 14, "question": "美股市場的熔斷機制在S&P 500下跌多少時首次觸發？", "options": ["5%", "7%", "10%", "15%"], "correct": 1, "explanation": "美股熔斷機制在S&P 500下跌7%、13%、20%時分別觸發暫停交易。"},
            {"id": 15, "question": "QI資格的券商可以協助投資人做什麼？", "options": ["降低手續費", "自動退稅", "提供融資", "免費諮詢"], "correct": 1, "explanation": "QI（Qualified Intermediary）資格的券商可以協助客戶自動處理部分退稅事宜。"},
            {"id": 16, "question": "以下哪個因素不會直接影響美股股價？", "options": ["聯準會利率決策", "財報表現", "台股表現", "經濟數據"], "correct": 2, "explanation": "雖然台股和美股有一定關聯性，但台股表現不會直接影響美股股價。"},
            {"id": 17, "question": "投資美股的定期定額策略主要優點是？", "options": ["保證獲利", "降低平均成本", "避免風險", "提高收益"], "correct": 1, "explanation": "定期定額投資可以通過時間分散降低平均成本，但不能保證獲利或完全避免風險。"},
            {"id": 18, "question": "Beta值大於1的股票表示？", "options": ["波動小於大盤", "波動等於大盤", "波動大於大盤", "與大盤無關"], "correct": 2, "explanation": "Beta值大於1表示該股票的波動性大於大盤，小於1則波動性小於大盤。"},
            {"id": 19, "question": "美股財報季通常在哪些月份？", "options": ["3、6、9、12月", "1、4、7、10月", "2、5、8、11月", "每月都有"], "correct": 1, "explanation": "美股財報季集中在1月、4月、7月、10月，企業需在季末後45天內公布財報。"},
            {"id": 20, "question": "股票分割(Stock Split)的主要目的是？", "options": ["增加市值", "降低股價", "提高股價", "減少股數"], "correct": 1, "explanation": "股票分割的主要目的是降低股價，提高股票的交易活躍度和可負擔性。"},
            {"id": 21, "question": "P/E比率是用來評估？", "options": ["公司規模", "股價合理性", "配息能力", "成長速度"], "correct": 1, "explanation": "P/E比率（本益比）是股價除以每股盈餘，用來評估股價是否合理。"},
            {"id": 22, "question": "投資美股REITs的主要風險不包括？", "options": ["利率風險", "流動性風險", "匯率風險", "公司信用風險"], "correct": 3, "explanation": "REITs主要風險包括利率風險、市場流動性風險、匯率風險，但個別REITs的信用風險相對較低，因其通常持有實體資產。"},
            {"id": 23, "question": "美股除權息日（Ex-Dividend Date）當天股價通常會？", "options": ["上漲", "下跌股息金額", "不變", "大幅波動"], "correct": 1, "explanation": "除權息日當天股價通常會下跌相當於股息的金額，這是正常的市場調整。"},
            {"id": 24, "question": "以下哪種情況最適合使用複委託？", "options": ["頻繁交易", "小額投資", "長期大額投資", "短線操作"], "correct": 2, "explanation": "複委託因有最低手續費門檻，最適合長期投資和大額投資。"},
            {"id": 25, "question": "美股的盤前盤後交易時間特點是？", "options": ["流動性高", "價差小", "流動性低", "無風險"], "correct": 2, "explanation": "盤前盤後交易時間流動性較低，買賣價差可能較大，價格波動風險較高。"},
            {"id": 26, "question": "投資組合再平衡的建議頻率是？", "options": ["每月", "每季或半年", "每年", "隨時"], "correct": 1, "explanation": "建議每季或半年進行投資組合再平衡，以維持原定的資產配置比例。"},
            {"id": 27, "question": "美股歷史長期年化報酬率約為？", "options": ["5-6%", "7-8%", "9-10%", "11-12%"], "correct": 2, "explanation": "S&P 500歷史長期年化報酬率約9-10%（含股息再投資）。"},
            {"id": 28, "question": "以下哪個不是投資美股的主要優勢？", "options": ["市場規模大", "產業多元化", "無匯率風險", "監管嚴格"], "correct": 2, "explanation": "投資美股存在匯率風險，這是台灣投資人需要考慮的重要因素。"},
            {"id": 29, "question": "Growth Stock vs Value Stock的主要區別是？", "options": ["股價高低", "公司規模", "投資理念", "配息多少"], "correct": 2, "explanation": "Growth Stock注重未來成長潛力，Value Stock注重當前價值被低估，是不同的投資理念。"},
            {"id": 30, "question": "美股市值加權指數的特點是？", "options": ["每檔股票權重相同", "按股價高低權重", "按市值大小權重", "隨機權重"], "correct": 2, "explanation": "市值加權指數中，市值越大的公司權重越高，如S&P 500就是市值加權指數。"},
            {"id": 31, "question": "投資美股ETF相對於個股的主要優勢是？", "options": ["報酬率更高", "風險分散", "手續費更低", "流動性更好"], "correct": 1, "explanation": "ETF的主要優勢是風險分散，因為它包含多檔股票，降低單一個股風險。"},
            {"id": 32, "question": "美股的股息殖利率通常為？", "options": ["0.5-1%", "1.5-2.5%", "3-4%", "5-6%"], "correct": 1, "explanation": "S&P 500的平均股息殖利率通常在1.5-2.5%之間。"},
            {"id": 33, "question": "投資科技股ETF的主要風險是？", "options": ["流動性風險", "高波動性", "匯率風險", "通膨風險"], "correct": 1, "explanation": "科技股ETF的主要風險是高波動性，股價可能大幅上下波動。"},
            {"id": 34, "question": "美國聯準會的利率決策對股市的影響是？", "options": ["無影響", "降息通常利好股市", "升息通常利好股市", "影響不明確"], "correct": 1, "explanation": "降息通常利好股市，因為降低了資金成本，升息則可能對股市產生壓力。"},
            {"id": 35, "question": "ADR（美國存託憑證）的主要作用是？", "options": ["降低風險", "提高收益", "便利交易外國股票", "避稅"], "correct": 2, "explanation": "ADR讓非美國公司能在美國交易所掛牌，便利投資人交易外國股票。"},
            {"id": 36, "question": "投資美股需要考慮的時差問題主要是？", "options": ["無法即時交易", "資訊延遲", "作息調整", "匯率變動"], "correct": 2, "explanation": "美股交易時間對應台灣深夜，投資人可能需要調整作息或使用限價單。"},
            {"id": 37, "question": "乖離率(BIAS)指標主要用來判斷？", "options": ["趨勢方向", "成交量", "股價偏離程度", "公司基本面"], "correct": 2, "explanation": "乖離率用來衡量股價偏離移動平均線的程度，判斷是否過度偏離。"},
            {"id": 38, "question": "股票回購對股價的影響通常是？", "options": ["負面影響", "正面支撐", "無影響", "不確定"], "correct": 1, "explanation": "股票回購通常被視為公司對股價的支撐，減少市場流通股數。"},
            {"id": 39, "question": "EPS（每股盈餘）的計算方式是？", "options": ["股價/市值", "淨利/流通股數", "營收/股數", "市值/股價"], "correct": 1, "explanation": "EPS = 淨利潤 ÷ 流通股數，是評估公司獲利能力的重要指標。"},
            {"id": 40, "question": "投資美股的資產配置建議中，保守型投資人股債比例約為？", "options": ["70%股票30%債券", "50%股票50%債券", "40%股票60%債券", "30%股票70%債券"], "correct": 2, "explanation": "保守型投資人建議40%股票60%債券的配置，以控制風險。"},
            {"id": 41, "question": "美股市場的主要交易所不包括？", "options": ["紐約證交所(NYSE)", "那斯達克(NASDAQ)", "芝加哥交易所(CME)", "倫敦證交所(LSE)"], "correct": 3, "explanation": "倫敦證交所(LSE)是英國的交易所，不是美國的主要交易所。"},
            {"id": 42, "question": "定期定額投資美股的最小金額通常是？", "options": ["100美元", "500美元", "1000美元", "沒有特定限制"], "correct": 3, "explanation": "美股可以買零股，理論上最小投資金額就是最便宜股票的股價，各平台規定不同。"},
            {"id": 43, "question": "美股投資中，以下哪種策略風險最低？", "options": ["集中投資個股", "使用槓桿ETF", "分散投資大盤ETF", "交易選擇權"], "correct": 2, "explanation": "分散投資大盤ETF是將風險分散到數百家公司，是相對最穩健的策略之一。"},
            {"id": 44, "question": "美股休市日不包括？", "options": ["感恩節", "聖誕節", "獨立日", "中秋節"], "correct": 3, "explanation": "中秋節是亞洲節日，美股不會因此休市。"},
            {"id": 45, "question": "投資美股避免匯率風險的方法不包括？", "options": ["分批換匯", "長期持有", "匯率避險ETF", "頻繁短線交易"], "correct": 3, "explanation": "頻繁短線交易不能避免匯率風險，反而會增加交易成本和匯兌次數。"},
            {"id": 46, "question": "美股ETF相比台股ETF的優勢是？", "options": ["管理費更高", "選擇更少", "管理費更低且選擇多元", "風險更高"], "correct": 2, "explanation": "美股ETF市場規模大，競爭激烈，因此通常管理費更低，且選擇更多元化。"},
            {"id": 47, "question": "投資美股REITs的配息頻率通常是？", "options": ["月配息", "季配息", "半年配息", "年配息"], "correct": 1, "explanation": "大多數美股REITs採取季配息，少數採月配息。"},
            {"id": 48, "question": "市值（Market Capitalization）的計算方式是？", "options": ["股價×交易量", "股價×流通股數", "淨值×股數", "營收×倍數"], "correct": 1, "explanation": "市值 = 股價 × 流通股數，用來衡量公司的規模大小。"},
            {"id": 49, "question": "美股投資人最需要關注的經濟指標是？", "options": ["台灣GDP", "聯準會利率及通膨數據", "日本央行政策", "歐洲通膨"], "correct": 1, "explanation": "聯準會的利率政策與美國的通膨數據(如CPI)對美股影響最為直接和重要。"},
            {"id": 50, "question": "長期投資美股的核心理念是？", "options": ["頻繁交易", "享受時間複利", "短期獲利", "投機套利"], "correct": 1, "explanation": "長期投資的核心是利用時間的力量，讓獲利再投資，通過複利效應獲得長期穩定收益。"}
        ],
        // Updated with new data structure
        "investment_channels": {
            "複委託": {
                "advantages": ["中文介面與客服", "受台灣金管會監管，較安心", "資金留存國內，無需海外電匯", "稅務問題券商會協助處理", "開戶流程對舊戶來說簡便"],
                "disadvantages": ["手續費較高，常有低消", "投資標的可能受限", "無法設定股息自動再投資(DRIP)", "交易功能較少 (如盤前盤後)"],
                "fees": "交易手續費0.15%~1%，低消15-50美元",
                "suitable_for": "投資新手、單筆大額、不頻繁交易的長期投資人"
            },
            "海外券商": {
                "advantages": ["手續費極低或零手續費", "投資標的多元齊全", "功能強大 (融資、期權等)", "可設定股息自動再投資 (DRIP)", "通常有開戶優惠"],
                "disadvantages": ["需自行處理國際電匯", "客服溝通需使用英文 (部分有中文)", "資金在海外，遺產處理較複雜", "稅務需自行處理"],
                "fees": "多數股票/ETF交易為$0，主要成本為電匯費",
                "suitable_for": "小額投資、頻繁交易、想投資多元商品的積極投資人"
            },
            "國內投信海外ETF": {
                "advantages": ["用台幣即可交易，無匯率問題", "交易方式與台股完全相同", "無須額外開戶或海外匯款", "投資門檻極低 (可買零股)"],
                "disadvantages": ["內扣總費用(經理費等)較高", "有追蹤誤差的風險", "選擇標的較少", "成交量可能較低，有流動性問題"],
                "fees": "同台股交易手續費(0.1425%)及證交稅(0.1%)",
                "suitable_for": "完全新手、只想投資大盤、資金極少的小資族"
            }
        },
        "stock_comparison": {
            "交易規則": {
                "台股": {"交易單位": "1張（1,000股）", "交易時間": "週一~週五 9:00-13:30", "漲跌幅限制": "10%", "交割貨幣": "新台幣", "看盤顏色": "紅漲綠跌"},
                "美股": {"交易單位": "1股", "交易時間": "週一~週五 21:30-04:00（夏令）", "漲跌幅限制": "無（有熔斷機制）", "交割貨幣": "美元", "看盤顏色": "綠漲紅跌"}
            },
            "投資優勢": {
                "台股": ["熟悉本土公司", "無匯率風險", "中文資訊豐富", "交易時間配合作息"],
                "美股": ["市場規模更大", "產業更多元化", "長期報酬率較高", "全球知名企業", "監管制度完善"]
            }
        },
        "stock_types": {
            "個股": {"description": "投資單一上市公司的股票，潛在回報與風險都較高。", "examples": ["蘋果(AAPL)", "微軟(MSFT)", "輝達(NVDA)", "特斯拉(TSLA)"], "advantages": ["高成長潛力", "直接投資龍頭企業"], "risks": ["單一公司經營風險", "需要投入時間研究"]},
            "ETF": {"description": "指數股票型基金，一次買入一籃子證券，有效分散風險。", "types": {"大盤ETF": ["SPY", "VOO", "VTI"], "產業ETF": ["XLK(科技)", "XLF(金融)", "SOXX(半導體)"], "地區ETF": ["VEA(已開發)", "VWO(新興市場)"]}, "advantages": ["風險分散", "管理費低", "交易方便"], "risks": ["無法避免系統性風險", "仍有追蹤誤差"]},
            "REITs": {"description": "不動產投資信託，讓小資族也能成為國際包租公。", "types": ["商場型", "數據中心型", "倉儲型", "住宅型"], "advantages": ["穩定的租金配息", "對抗通膨", "投資門檻低"], "risks": ["對利率變化敏感", "受景氣循環影響"]}
        },
        "investment_notes": {
            "風險管理": ["分散投資，不要重壓單一標的", "設定停損點，嚴守交易紀律", "定期檢視投資組合", "了解自己的風險承受度"],
            "時機選擇": ["長期投資優於短線投機", "定期定額，攤平成本", "市場恐慌時是機會而非末日", "避免情緒化交易，追高殺低"],
            "稅務規劃": ["了解30%股息預扣稅", "資本利得對外國人免稅", "注意台灣的海外所得申報門檻", "善用有QI資格的券商"],
            "匯率考量": ["分批換匯降低風險", "將匯率視為長期成本的一部分", "長期投資可淡化短期匯率波動"]
        }
    };
}


// 初始化導航
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const featureCards = document.querySelectorAll('.feature-card');

    function setActiveLink(targetSection) {
        navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.dataset.section === targetSection) {
                nav.classList.add('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.dataset.section;
            switchSection(targetSection);
            setActiveLink(targetSection);
        });
    });

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSection = card.dataset.section;
            switchSection(targetSection);
            setActiveLink(targetSection);
        });
    });
}

// 切換區段
function switchSection(targetSection) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSectionElement = document.getElementById(targetSection);
    if (targetSectionElement) {
        targetSectionElement.classList.add('active');
    }
}

// 初始化全螢幕功能
function initializeFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
    document.addEventListener('fullscreenchange', updateFullscreenButton);
}

// 切換全螢幕
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// 更新全螢幕按鈕狀態
function updateFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const isFullscreen = !!document.fullscreenElement;
    fullscreenBtn.innerHTML = isFullscreen 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>' 
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
}

// 填充內容
function populateContent() {
    populateInvestmentChannels();
    populateStockComparison();
    populateStockTypes();
    populateInvestmentNotes();
}

// 填充投資管道內容
function populateInvestmentChannels() {
    if (!appData.investment_channels) return;
    const channels = appData.investment_channels;
    
    // 複委託
    const trustee = channels['複委託'];
    if (trustee) {
        populateList('trustee-pros', trustee.advantages);
        populateList('trustee-cons', trustee.disadvantages);
        document.getElementById('trustee-fees').textContent = trustee.fees;
        document.getElementById('trustee-suitable').textContent = trustee.suitable_for;
    }
    
    // 海外券商
    const overseas = channels['海外券商'];
    if (overseas) {
        populateList('overseas-pros', overseas.advantages);
        populateList('overseas-cons', overseas.disadvantages);
        document.getElementById('overseas-fees').textContent = overseas.fees;
        document.getElementById('overseas-suitable').textContent = overseas.suitable_for;
    }

    // 國內投信海外ETF
    const domesticEtf = channels['國內投信海外ETF'];
    if (domesticEtf) {
        populateList('domestic-etf-pros', domesticEtf.advantages);
        populateList('domestic-etf-cons', domesticEtf.disadvantages);
        document.getElementById('domestic-etf-fees').textContent = domesticEtf.fees;
        document.getElementById('domestic-etf-suitable').textContent = domesticEtf.suitable_for;
    }
}

// 填充股票比較內容
function populateStockComparison() {
    if (!appData.stock_comparison) return;
    const comparison = appData.stock_comparison;
    
    const tbody = document.getElementById('comparison-table-body');
    if(tbody) tbody.innerHTML = '';
    const rules = comparison['交易規則'];
    Object.keys(rules['台股']).forEach(key => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${key}</td><td>${rules['台股'][key]}</td><td>${rules['美股'][key]}</td>`;
        tbody.appendChild(row);
    });
    
    populateList('taiwan-advantages', comparison['投資優勢']['台股']);
    populateList('us-advantages', comparison['投資優勢']['美股']);
}

// 填充股票種類內容
function populateStockTypes() {
    if (!appData.stock_types) return;
    const types = appData.stock_types;
    
    const individual = types['個股'];
    document.getElementById('individual-desc').textContent = individual.description;
    populateTags('individual-examples', individual.examples);
    populateList('individual-advantages', individual.advantages);
    populateList('individual-risks', individual.risks);
    
    const etf = types['ETF'];
    document.getElementById('etf-desc').textContent = etf.description;
    populateETFTypes(etf.types);
    populateList('etf-advantages', etf.advantages);
    populateList('etf-risks', etf.risks);
    
    const reits = types['REITs'];
    document.getElementById('reits-desc').textContent = reits.description;
    populateTags('reits-types-content', reits.types);
    populateList('reits-advantages', reits.advantages);
    populateList('reits-risks', reits.risks);
}

// 填充ETF類型
function populateETFTypes(types) {
    const container = document.getElementById('etf-types-content');
    if(container) container.innerHTML = '';
    Object.entries(types).forEach(([typeName, examples]) => {
        const typeDiv = document.createElement('div');
        typeDiv.className = 'etf-type-group';
        typeDiv.innerHTML = `
            <div class="etf-type-name">${typeName}</div>
            <div class="etf-type-examples">${examples.map(ex => `<span class="example-tag">${ex}</span>`).join('')}</div>`;
        container.appendChild(typeDiv);
    });
}

// 填充投資注意事項
function populateInvestmentNotes() {
    if (!appData.investment_notes) return;
    const notes = appData.investment_notes;
    populateList('risk-management-list', notes['風險管理']);
    populateList('timing-list', notes['時機選擇']);
    populateList('tax-planning-list', notes['稅務規劃']);
    populateList('currency-list', notes['匯率考量']);
}

// 輔助函數
function populateList(elementId, items) {
    const element = document.getElementById(elementId);
    if (!element || !items) return;
    element.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        element.appendChild(li);
    });
}

function populateTags(elementId, items) {
    const element = document.getElementById(elementId);
    if (!element || !items) return;
    element.innerHTML = '';
    items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'example-tag';
        span.textContent = item;
        element.appendChild(span);
    });
}

// 初始化閃卡系統
function initializeFlashcards() {
    if (!appData.flashcards || appData.flashcards.length === 0) return;
    const flashcard = document.getElementById('flashcard');
    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    document.getElementById('prev-card').addEventListener('click', () => navigateFlashcard(-1));
    document.getElementById('next-card').addEventListener('click', () => navigateFlashcard(1));
    document.getElementById('shuffle-btn').addEventListener('click', shuffleFlashcards);
    document.getElementById('reset-progress-btn').addEventListener('click', resetFlashcardProgress);
    document.getElementById('mark-mastered').addEventListener('click', markCardAsMastered);
    updateFlashcard();
    updateFlashcardProgress();
}

function updateFlashcard() {
    if (!appData.flashcards || appData.flashcards.length === 0) return;
    const card = appData.flashcards[currentFlashcardIndex];
    document.getElementById('card-question').textContent = card.question;
    document.getElementById('card-answer').textContent = card.answer;
    document.getElementById('flashcard').classList.remove('flipped');
    updateFlashcardButtons();
}

function updateFlashcardButtons() {
    document.getElementById('prev-card').disabled = currentFlashcardIndex === 0;
    document.getElementById('next-card').disabled = currentFlashcardIndex === appData.flashcards.length - 1;
    const currentCardId = appData.flashcards[currentFlashcardIndex].id;
    const isMastered = masteredCards.has(currentCardId);
    const btn = document.getElementById('mark-mastered');
    btn.textContent = isMastered ? '取消掌握' : '已掌握';
    btn.className = isMastered ? 'btn btn--outline' : 'btn btn--primary';
}

function navigateFlashcard(direction) {
    const newIndex = currentFlashcardIndex + direction;
    if (newIndex >= 0 && newIndex < appData.flashcards.length) {
        currentFlashcardIndex = newIndex;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function shuffleFlashcards() {
    appData.flashcards = shuffleArray(appData.flashcards);
    currentFlashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
}

function resetFlashcardProgress() {
    masteredCards.clear();
    currentFlashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
}

function markCardAsMastered() {
    const currentCardId = appData.flashcards[currentFlashcardIndex].id;
    masteredCards.has(currentCardId) ? masteredCards.delete(currentCardId) : masteredCards.add(currentCardId);
    updateFlashcardButtons();
    updateFlashcardProgress();
}

function updateFlashcardProgress() {
    document.getElementById('card-progress').textContent = `${currentFlashcardIndex + 1} / ${appData.flashcards.length}`;
    document.getElementById('mastered-count').textContent = masteredCards.size;
}

// 初始化測驗系統
function initializeQuiz() {
    if (!appData.quiz_questions || appData.quiz_questions.length === 0) return;
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('retake-quiz').addEventListener('click', startQuiz);
    document.getElementById('review-errors').addEventListener('click', showErrorReview);
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('prev-question').addEventListener('click', prevQuestion);
    document.getElementById('finish-quiz').addEventListener('click', finishQuiz);
    updateQuizStats();
}

function startQuiz() {
    currentQuizIndex = 0;
    quizAnswers = Array(appData.quiz_questions.length).fill(null);
    quizStartTime = Date.now();
    appData.quiz_questions = shuffleArray(appData.quiz_questions);
    
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    clearInterval(quizTimer);
    quizTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('quiz-timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
    
    showQuestion();
}

function showQuestion() {
    const question = appData.quiz_questions[currentQuizIndex];
    quizAnswers[currentQuizIndex] = quizAnswers[currentQuizIndex] || {};
    
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = currentQuizIndex + 1;
    document.getElementById('progress-fill').style.width = `${((currentQuizIndex + 1) / appData.quiz_questions.length) * 100}%`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => selectOption(index, button);
        if (quizAnswers[currentQuizIndex].selected === index) button.classList.add('selected');
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('submit-answer').disabled = quizAnswers[currentQuizIndex].selected === undefined;
    document.getElementById('submit-answer').style.display = 'inline-block';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('finish-quiz').style.display = 'none';
    document.getElementById('question-feedback').style.display = 'none';
    document.getElementById('prev-question').disabled = currentQuizIndex === 0;
}

function selectOption(index, button) {
    document.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    quizAnswers[currentQuizIndex].selected = index;
    document.getElementById('submit-answer').disabled = false;
}

function submitAnswer() {
    const question = appData.quiz_questions[currentQuizIndex];
    const answer = quizAnswers[currentQuizIndex];
    answer.isCorrect = answer.selected === question.correct;

    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) btn.classList.add('correct');
        else if (index === answer.selected) btn.classList.add('incorrect');
    });

    const feedback = document.getElementById('question-feedback');
    feedback.querySelector('.feedback-result').textContent = answer.isCorrect ? '✓ 答對了！' : '✗ 答錯了';
    feedback.querySelector('.feedback-result').className = `feedback-result ${answer.isCorrect ? 'correct' : 'incorrect'}`;
    feedback.querySelector('.feedback-explanation').textContent = question.explanation;
    feedback.style.display = 'block';

    document.getElementById('submit-answer').style.display = 'none';
    if (currentQuizIndex === appData.quiz_questions.length - 1) {
        document.getElementById('finish-quiz').style.display = 'inline-block';
    } else {
        document.getElementById('next-question').style.display = 'inline-block';
    }
}

function nextQuestion() {
    if (currentQuizIndex < appData.quiz_questions.length - 1) {
        currentQuizIndex++;
        showQuestion();
    }
}

function prevQuestion() {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        showQuestion();
    }
}

function finishQuiz() {
    clearInterval(quizTimer);
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    const score = quizAnswers.filter(a => a && a.isCorrect).length;
    
    quizStats.attempts++;
    quizStats.bestScore = Math.max(quizStats.bestScore, score);
    
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    document.getElementById('final-score').textContent = score;
    const percentage = Math.round((score / appData.quiz_questions.length) * 100);
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    const minutes = Math.floor(totalTime / 60).toString().padStart(2, '0');
    const seconds = (totalTime % 60).toString().padStart(2, '0');
    document.getElementById('total-time').textContent = `${minutes}:${seconds}`;
    
    updateQuizStats();
}

function updateQuizStats() {
    const totalQuestions = appData.quiz_questions.length;
    document.getElementById('best-score').textContent = quizStats.attempts > 0 
        ? `${quizStats.bestScore}/${totalQuestions} (${Math.round(quizStats.bestScore / totalQuestions * 100)}%)` 
        : '尚未測驗';
    document.getElementById('quiz-attempts').textContent = quizStats.attempts;
}

function showErrorReview() {
    const errorReview = document.getElementById('error-review');
    const errorList = document.getElementById('error-list');
    errorList.innerHTML = '';
    
    const errors = quizAnswers.map((answer, index) => ({...answer, ...appData.quiz_questions[index]})).filter(item => item.isCorrect === false);
    
    if (errors.length === 0) {
        errorList.innerHTML = '<p style="text-align: center; color: var(--color-success);">🎉 恭喜！本次測驗全部答對！</p>';
    } else {
        errors.forEach((error, index) => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-item';
            errorDiv.innerHTML = `
                <div class="error-question">${index + 1}. ${error.question}</div>
                <div class="error-answer">您的答案：${String.fromCharCode(65 + error.selected)}. ${error.options[error.selected]}</div>
                <div class="error-correct">正確答案：${String.fromCharCode(65 + error.correct)}. ${error.options[error.correct]}</div>
                <div class="error-explanation">${error.explanation}</div>
            `;
            errorList.appendChild(errorDiv);
        });
    }
    errorReview.style.display = 'block';
}

document.getElementById('retake-quiz').addEventListener('click', () => {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('error-review').style.display = 'none';
    document.getElementById('quiz-start').style.display = 'block';
});

// 輔助函數：數組隨機排序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}