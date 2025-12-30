import { MarketState, PriceData } from "../types";

const PROXY_URL = "https://api.allorigins.win/raw?url=";
const TARGET_URL = "https://bazar360.com/fa/";

// Helper to convert Persian digits to English and parse number
const parsePersianNumber = (str: string): number => {
  if (!str) return 0;
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let cleanStr = str.replace(/,/g, "").trim();

  for (let i = 0; i < 10; i++) {
    cleanStr = cleanStr.replace(new RegExp(persianDigits[i], "g"), i.toString());
  }

  // Extract first valid number found (handling cases like "12,000 تومان")
  const match = cleanStr.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

// Helper to clean up text
const cleanText = (str: string): string => {
  return str.replace(/\s+/g, " ").trim();
};

export const fetchMarketData = async (): Promise<MarketState | null> => {
  try {
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(TARGET_URL)}`);
    if (!response.ok) throw new Error("Network response was not ok");

    const html = await response.text();
    console.log("Fetched HTML length:", html.length); // Debug log
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr"));

    // Extract Currencies
    // IQD is often 100 Dinars, check site. Assuming "100 دینار عراق"
    const currencyKeywords = ["USD", "EUR", "AED", "GBP", "TRY", "CNY", "AUD", "CHF", "NOK", "SEK", "100 دینار عراق"];

    // Mapping for descriptive titles (Shortened)
    const titleMap: Record<string, string> = {
      USD: "دلار آمریکا",
      EUR: "یورو",
      AED: "درهم امارات",
      GBP: "پوند انگلیس",
      TRY: "لیر ترکیه",
      CNY: "یوان چین",
      AUD: "دلار استرالیا",
      CHF: "فرانک سوئیس",
      NOK: "کرون نروژ",
      SEK: "کرون سوئد",
      IQD100: "۱۰۰ دینار عراق",
      gold_18k: "طلای ۱۸ عیار (گرم)",
      gold_ounce: "انس جهانی طلا (دلار)",
      seke_emami: "سکه تمام امامی",
      seke_bahar: "سکه تمام طرح قدیم",
      nim_seke: "نیم سکه",
      rob_seke: "ربع سکه",
      seke_grami: "سکه گرمی"
    };

    const findPrice = (keyword: string, exclude: string = ""): PriceData | null => {
      // Find row containing keyword
      const row = rows.find(r => {
        const text = r.textContent || "";
        return text.includes(keyword) && (!exclude || !text.includes(exclude));
      });

      if (!row) return null;

      const cells = Array.from(row.querySelectorAll("td"));

      const priceCell = cells.find(td => {
        const num = parsePersianNumber(td.textContent || "");
        return num > 100; // Filter out small numbers like %, indices, etc.
      });

      const changeCell = cells.find(td => (td.textContent || "").includes("%"));

      // Determine ID based on keyword for internal mapping
      let id = "unknown";
      let icon = "💰";
      if (keyword.includes("USD")) { id = "USD"; icon = "🇺🇸"; }
      else if (keyword.includes("EUR")) { id = "EUR"; icon = "🇪🇺"; }
      else if (keyword.includes("AED")) { id = "AED"; icon = "🇦🇪"; }
      else if (keyword.includes("GBP")) { id = "GBP"; icon = "🇬🇧"; }
      else if (keyword.includes("TRY")) { id = "TRY"; icon = "🇹🇷"; }
      else if (keyword.includes("CNY")) { id = "CNY"; icon = "🇨🇳"; }
      else if (keyword.includes("AUD")) { id = "AUD"; icon = "🇦🇺"; }
      else if (keyword.includes("CHF")) { id = "CHF"; icon = "🇨🇭"; }
      else if (keyword.includes("NOK")) { id = "NOK"; icon = "🇳🇴"; }
      else if (keyword.includes("SEK")) { id = "SEK"; icon = "🇸🇪"; }
      else if (keyword.includes("دینار عراق")) { id = "IQD100"; icon = "🇮🇶"; }

      else if (keyword.includes("گرم طلا 18")) { id = "gold_18k"; icon = "✨"; }
      else if (keyword.includes("انس") || keyword.includes("اونس")) { id = "gold_ounce"; icon = "🌍"; }
      else if (keyword.includes("سکه تمام") && !exclude) { id = "seke_emami"; icon = "🪙"; }
      else if (keyword.includes("سکه تمام بهار آزادی") || (keyword.includes("سکه تمام") && keyword.includes("قدیم"))) { id = "seke_bahar"; icon = "🪙"; }
      else if (keyword.includes("نیم سکه")) { id = "nim_seke"; icon = "🌗"; }
      else if (keyword.includes("ربع سکه")) { id = "rob_seke"; icon = "🌘"; }
      else if (keyword.includes("سکه گرمی")) { id = "seke_grami"; icon = "🪙"; }

      return {
        id,
        name: titleMap[id] || cleanText(cells[0]?.textContent || keyword),
        icon,
        price: priceCell ? parsePersianNumber(priceCell.textContent || "") : 0,
        change: changeCell ? parseFloat(changeCell.textContent?.replace("%", "").trim() || "0") : 0,
        unit: id === "gold_ounce" ? "دلار" : "تومان"
      };
    };

    const currencies = currencyKeywords
      .map(k => findPrice(k))
      .filter((c): c is PriceData => c !== null && c.price > 0);

    // Extract Gold
    const goldKeywords = [
      { k: "گرم طلا 18 عیار", ex: "" },
      { k: "قیمت اونس طلا جهانی (دلار آمریکا)", ex: "" },
      { k: "انس", ex: "نقره" } // Backup
    ];

    const gold = goldKeywords
      .map(item => findPrice(item.k, item.ex))
      .filter((c): c is PriceData => c !== null && c.price > 0)
      .map(item => {
        if (item.id === 'gold_ounce' && item.price < 5000) return { ...item, unit: "دلار" };
        return item;
      });

    // Extract Coins from TGJU
    const coins: PriceData[] = [];
    try {
      const coinUrl = "https://www.tgju.org/coin";
      const coinResp = await fetch(`${PROXY_URL}${encodeURIComponent(coinUrl)}`);
      if (coinResp.ok) {
        const coinHtml = await coinResp.text();
        const coinDoc = new DOMParser().parseFromString(coinHtml, "text/html");
        const coinSections = coinDoc.querySelectorAll('h2');

        coinSections.forEach(section => {
          const name = section.textContent?.trim();
          if (name && name.includes('سکه')) {
            // Find the next element with "نرخ فعلی"
            let currentElement = section.nextElementSibling;
            let priceText = '';
            while (currentElement) {
              if (currentElement.textContent?.includes('نرخ فعلی')) {
                const match = currentElement.textContent.match(/نرخ فعلی\s*:\s*([\d,]+)/);
                if (match) {
                  priceText = match[1];
                  break;
                }
              }
              currentElement = currentElement.nextElementSibling;
            }

            if (priceText) {
              const price = Math.round(parsePersianNumber(priceText) / 10);
              if (price > 0) {
                let id = '';
                let icon = '🪙';
                if (name.includes("تمام")) {
                  id = 'coin_full';
                  icon = '🪙';
                } else if (name.includes("نیم")) {
                  id = 'coin_half';
                  icon = '🌗';
                } else if (name.includes("ربع")) {
                  id = 'coin_quarter';
                  icon = '🌘';
                } else if (name.includes("گرمی")) {
                  id = 'coin_gram';
                  icon = '🪙';
                } else if (name.includes("بهار")) {
                  id = 'coin_bahar';
                  icon = '🪙';
                } else if (name.includes("امامی")) {
                  id = 'coin_emami';
                  icon = '🪙';
                }

                if (id) {
                  coins.push({
                    id,
                    name,
                    price,
                    change: 0,
                    unit: 'تومان',
                    icon
                  });
                }
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn("Coin fetch failed", e);
    }

    // Fetch Gerami coin separately
    try {
      const geramiUrl = "https://www.tgju.org/profile/gerami";
      const geramiResp = await fetch(`${PROXY_URL}${encodeURIComponent(geramiUrl)}`);
      if (geramiResp.ok) {
        const geramiHtml = await geramiResp.text();
        const geramiDoc = new DOMParser().parseFromString(geramiHtml, "text/html");
        const priceElement = geramiDoc.querySelector('[data-price]');
        if (priceElement) {
          const priceText = priceElement.getAttribute('data-price') || priceElement.textContent?.trim();
          if (priceText) {
            const price = Math.round(parsePersianNumber(priceText) / 10);
            if (price > 0) {
              coins.push({
                id: 'coin_gram',
                name: 'سکه گرمی',
                price,
                change: 0,
                unit: 'تومان',
                icon: '🪙'
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Gerami coin fetch failed", e);
    }

    // Fallback: If Ounce is missing from primary source, try TGJU
    const hasOunce = gold.some(g => g.id === 'gold_ounce');
    if (!hasOunce) {
      try {
        const tgjuUrl = "https://www.tgju.org/currency-exchange/30001/mex-exchange";
        const tgjuResp = await fetch(`${PROXY_URL}${encodeURIComponent(tgjuUrl)}`);
        if (tgjuResp.ok) {
          const tgjuHtml = await tgjuResp.text();
          const tgjuDoc = new DOMParser().parseFromString(tgjuHtml, "text/html");
          const tgjuRows = Array.from(tgjuDoc.querySelectorAll("tr"));

          // Search for Ounce in TGJU (usually 'انس طلا')
          const ounceRow = tgjuRows.find(r => r.textContent?.includes("انس طلا") && !r.textContent?.includes("نقره"));

          if (ounceRow) {
            const prices = Array.from(ounceRow.querySelectorAll("td"))
              .map(c => parsePersianNumber(c.textContent || ""))
              .filter(n => n > 100);

            if (prices.length > 0) {
              const ouncePrice = prices[0];
              if (ouncePrice > 0) {
                gold.push({
                  id: 'gold_ounce',
                  name: 'انس جهانی طلا (دلار)',
                  price: ouncePrice,
                  change: 0,
                  unit: 'دلار',
                  icon: '🌍'
                });
              }
            }
          }
        }
      } catch (e) {
        console.warn("Fallback Ounce fetch failed", e);
      }
    }

    // Calculate Gold Bubble
    // Formula: Bubble = Market Price - Intrinsic Value
    // Intrinsic Value (1g 18k) = (Global Ounce * USD Price) / 41.4562

    // Find required values
    const usdItem = currencies.find(c => c.id === 'USD');
    const ounceItem = gold.find(g => g.id === 'gold_ounce');
    const gold18kItem = gold.find(g => g.id === 'gold_18k');

    if (usdItem && ounceItem && gold18kItem) {
      const usdPrice = usdItem.price;
      const ouncePrice = ounceItem.price;
      const marketPrice = gold18kItem.price;

      const intrinsicValue = (ouncePrice * usdPrice) / 41.4562;
      const bubble = Math.round(marketPrice - intrinsicValue);


      const isPositive = bubble >= 0;
      const bubbleText = isPositive
        ? 'تومان (بیشتر از قیمت جهانی)'
        : 'تومان (کمتر از قیمت جهانی)';

      // Add to Gold array
      gold.push({
        id: 'gold_bubble',
        name: 'حباب طلا',
        price: Math.abs(bubble),
        change: bubble,
        unit: bubbleText,
        icon: '🫧'
      });
    }

    // Fetch Crypto (Mocked or Free API - Using CoinGecko Simple API)
    // We'll use a separate fetch for this to ensure reliability, or simpler, we can just use a fixed list for now if scraper is preferred.
    // However, user specifically asked for a box. Best to use live data.
    // To avoid rate limits on CoinGecko (demo), we can try to fetch, fallback to 0.
    let crypto: PriceData[] = [];
    try {
      // IDs: bitcoin, ethereum, tether, binancecoin, toncoin
      // Use AllOrigins proxy to avoid CORS issues with CoinGecko API
      const cryptoApiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,toncoin&vs_currencies=usd&include_24hr_change=true";
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(cryptoApiUrl)}`);

      let cryptoData: any = {};

      if (response.ok) {
        // AllOrigins wraps the response in a 'contents' field
        const wrapper = await response.json();
        cryptoData = JSON.parse(wrapper.contents);
      } else {
        // Fallback or retry direct if proxy fails? Let's just suppress for now and assume it might work on direct if proxy fails? 
        // Actually, let's keep it simple. If proxy fails, we show nothing or mock.
        // Let's fallback to direct fetch in case proxy is the issue (rare but possible)
        const directResp = await fetch(cryptoApiUrl);
        if (directResp.ok) {
          cryptoData = await directResp.json();
        }
      }

      // Check if we have data for bitcoin to confirm validity
      if (cryptoData.bitcoin) {
        crypto = [
          { id: "bitcoin", name: "بیت‌کوین", symbol: "BTC", icon: "₿", price: cryptoData.bitcoin.usd, change: cryptoData.bitcoin.usd_24h_change, unit: "دلار" },
          { id: "ethereum", name: "اتریوم", symbol: "ETH", icon: "Ξ", price: cryptoData.ethereum.usd, change: cryptoData.ethereum.usd_24h_change, unit: "دلار" },
          { id: "tether", name: "تتر", symbol: "USDT", icon: "₮", price: cryptoData.tether.usd, change: cryptoData.tether.usd_24h_change, unit: "دلار" },
          { id: "binancecoin", name: "بایننس کوین", symbol: "BNB", icon: "🟡", price: cryptoData.binancecoin.usd, change: cryptoData.binancecoin.usd_24h_change, unit: "دلار" },
          { id: "toncoin", name: "تون کوین", symbol: "TON", icon: "💎", price: cryptoData.toncoin.usd, change: cryptoData.toncoin.usd_24h_change, unit: "دلار" },
        ];
      }
    } catch (e) {
      console.warn("Crypto fetch failed", e);
      // Hardcoded fallback data so the box ALWAYS appears (for demo purposes if API fails)
      crypto = [
        { id: "bitcoin", name: "بیت‌کوین (دمو)", symbol: "BTC", icon: "₿", price: 95000, change: 2.5, unit: "دلار" },
        { id: "ethereum", name: "اتریوم (دمو)", symbol: "ETH", icon: "Ξ", price: 3400, change: -1.2, unit: "دلار" },
        { id: "tether", name: "تتر (دمو)", symbol: "USDT", icon: "₮", price: 1, change: 0.01, unit: "دلار" },
      ];
    }

    return {
      currencies,
      gold,
      coins,
      lastUpdated: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return null;
  }
};

export const fetchGovernmentRates = async () => {
  try {
    // Target: TGJU Mex Exchange (National Bank)
    const url = "https://www.tgju.org/currency-exchange/30001/mex-exchange";
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error("Network response was not ok");

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // The page usually has a table with class 'data-table' or similar. 
    // We will generalize by looking for rows with currency names.
    const rows = Array.from(doc.querySelectorAll("tr"));

    const rates: { name: string; price: number; type: string }[] = [];

    const keywords = [
      { k: "دلار", name: "دلار آمریکا", type: "صرافی ملی" },
      { k: "یورو", name: "یورو", type: "صرافی ملی" },
      { k: "پوند", name: "پوند انگلیس", type: "صرافی ملی" },
      { k: "درهم", name: "درهم امارات", type: "صرافی ملی" }
    ];

    keywords.forEach(item => {
      const row = rows.find(r => r.textContent?.includes(item.k) && r.textContent?.includes("خرید")); // Usually 'Sell' (فروش) or 'Buy' (خرید). Let's look for rows. 'mex-exchange' generally lists Bank rates.
      // Actually TGJU tables for exchanges usually have: [Name] [Buy] [Sell] [Update]
      // Let's try to find a row that mentions the name, and pick the first numeric value > 1000

      // Refined search: Find row overlapping exact keyword
      const matchedRow = rows.find(r => {
        const cells = Array.from(r.querySelectorAll("td, th"));
        return cells.some(c => c.textContent?.includes(item.k));
      });

      if (matchedRow) {
        const cells = Array.from(matchedRow.querySelectorAll("td"));
        // Usually price is in the 2nd or 3rd column. 
        // Let's extract all numbers and pick the max one (usually sell price is higher or similar) or just the first valid price.
        const prices = cells.map(c => parsePersianNumber(c.textContent || "")).filter(n => n > 100);

        if (prices.length > 0) {
          // Usually [0] is Buy, [1] is Sell. Let's take the higher one (Sell) or just the first one.
          // For Government modal, usually "Sales" rate is what people care about (what bank sells).
          // Let's assume the max is the sell price.
          const price = Math.max(...prices);
          rates.push({
            name: item.name,
            price: Math.round(price / 10),
            type: item.type
          });
        }
      }
    });

    return rates;

  } catch (error) {
    console.error("Failed to fetch gov rates:", error);
    return [];
  }
};
