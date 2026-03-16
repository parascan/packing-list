/**
 * Returns the best emoji for a packing item based on its name and optional category.
 * Keyword matching is intentionally broad — "polo" matches "shirt", etc.
 */

const RULES: [RegExp, string][] = [
  // ── Tops ──
  [/polo|shirt|tee|t-shirt|blouse|top|tank|cami/i,          '👕'],
  [/sweater|hoodie|pullover|sweatshirt|fleece/i,             '🧥'],
  [/jacket|coat|parka|windbreaker|blazer|cardigan/i,         '🧥'],
  [/dress|skirt|gown/i,                                      '👗'],
  [/suit|tuxedo/i,                                           '🤵'],
  [/tie|necktie|bow.?tie/i,                                  '👔'],

  // ── Bottoms ──
  [/jeans|pants|trousers|chinos|legging|shorts|sweatpant/i,  '👖'],

  // ── Feet ──
  [/sneaker|shoe|boot|loafer|sandal|heel|footwear|slipper|flip.?flop/i, '👟'],
  [/sock|stocking/i,                                         '🧦'],

  // ── Underwear / swimwear ──
  [/underwear|boxer|brief|bra|lingerie/i,                    '🩲'],
  [/swimsuit|bikini|swim/i,                                  '🩱'],
  [/swim.?short|board.?short/i,                              '🩳'],

  // ── Accessories ──
  [/hat|cap|beanie|beret|sun.?hat/i,                         '🧢'],
  [/sunglasses|glasses|goggle/i,                             '🕶️'],
  [/glove/i,                                                  '🧤'],
  [/scarf|wrap/i,                                            '🧣'],
  [/belt/i,                                                   '👜'],
  [/watch/i,                                                  '⌚'],
  [/ring|necklace|bracelet|earring|jewelry|jewellery/i,      '💍'],
  [/bag|backpack|purse|tote|suitcase|luggage|duffel/i,       '🎒'],
  [/wallet|purse/i,                                          '👛'],
  [/umbrella/i,                                               '☂️'],

  // ── Electronics ──
  [/laptop|macbook|computer|notebook/i,                      '💻'],
  [/phone|mobile|iphone|android/i,                           '📱'],
  [/tablet|ipad/i,                                           '📱'],
  [/charger|cable|cord|adapter|plug/i,                       '🔌'],
  [/headphone|earphone|earbud|airpod/i,                      '🎧'],
  [/camera/i,                                                 '📷'],
  [/power.?bank|battery.?pack/i,                             '🔋'],
  [/keyboard/i,                                              '⌨️'],
  [/mouse/i,                                                  '🖱️'],

  // ── Toiletries ──
  [/shampoo|conditioner|hair.?wash/i,                        '🧴'],
  [/soap|body.?wash|shower.?gel/i,                           '🧼'],
  [/toothbrush|toothpaste|floss|mouthwash/i,                 '🪥'],
  [/deodorant|antiperspirant/i,                              '🧴'],
  [/razor|shaver|shave/i,                                    '🪒'],
  [/sunscreen|spf|sun.?block/i,                              '🧴'],
  [/perfume|cologne|fragrance/i,                             '🧴'],
  [/makeup|mascara|lipstick|foundation|blush|eyeliner/i,     '💄'],
  [/comb|hair.?brush|hairbrush/i,                            '🪮'],
  [/towel/i,                                                  '🛁'],
  [/lotion|moisturizer|cream|serum/i,                        '🧴'],

  // ── Health / Medical ──
  [/medicine|medication|pill|tablet|vitamin|supplement/i,    '💊'],
  [/first.?aid|bandage|plaster/i,                            '🩹'],
  [/inhaler/i,                                               '💊'],

  // ── Documents / Travel ──
  [/passport/i,                                              '🛂'],
  [/ticket|boarding/i,                                       '🎫'],
  [/map|guidebook|guide.?book/i,                             '🗺️'],
  [/book|novel|kindle|reader/i,                              '📚'],
  [/key|keycard/i,                                           '🔑'],
  [/money|cash|currency/i,                                   '💵'],
  [/card|credit|debit/i,                                     '💳'],

  // ── Food & Drink ──
  [/snack|food|bar|granola|jerky/i,                          '🍎'],
  [/water.?bottle|bottle|flask|canteen/i,                    '🍶'],
  [/coffee|tea|thermos/i,                                    '☕'],

  // ── Outdoor / Sports ──
  [/sunscreen|sun.?block/i,                                  '☀️'],
  [/bug.?spray|insect.?repellent/i,                          '🦟'],
  [/tent/i,                                                   '⛺'],
  [/sleeping.?bag/i,                                         '🛏️'],
  [/flashlight|torch/i,                                      '🔦'],
  [/rope/i,                                                   '🧵'],
  [/ski|snowboard/i,                                         '⛷️'],
  [/helmet/i,                                                 '⛑️'],

  // ── Misc ──
  [/notebook|journal|diary/i,                                '📓'],
  [/pen|pencil/i,                                            '🖊️'],
  [/charcoal|match|lighter/i,                                '🔥'],
]

const CATEGORY_FALLBACKS: Record<string, string> = {
  clothes:     '👕',
  toiletries:  '🧴',
  electronics: '💻',
  documents:   '📄',
  misc:        '📦',
  beach:       '🏖️',
  ski:         '⛷️',
  hiking:      '🥾',
  camping:     '⛺',
  business:    '💼',
}

export function itemEmoji(name: string, category?: string): string {
  for (const [pattern, emoji] of RULES) {
    if (pattern.test(name)) return emoji
  }
  if (category) {
    const key = category.toLowerCase().trim()
    if (CATEGORY_FALLBACKS[key]) return CATEGORY_FALLBACKS[key]
  }
  return '📦'
}
