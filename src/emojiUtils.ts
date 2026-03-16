/**
 * Returns the best emoji for a packing item based on its name and optional category.
 * Keyword matching is intentionally broad — "polo" matches "shirt", etc.
 */

const RULES: [RegExp, string][] = [
  // ── Tops ──
  [/polo|shirt|tee|t-shirt|blouse|tank|cami/i,                '👕'],
  [/sweater|hoodie|pullover|sweatshirt|fleece/i,               '🧥'],
  [/jacket|coat|parka|windbreaker|blazer|cardigan/i,           '🧥'],
  [/vest|gilet/i,                                              '🦺'],
  [/robe|bathrobe/i,                                           '🩱'],
  [/pajama|pyjama|sleepwear|nightwear|nightgown/i,             '🛌'],
  [/dress|skirt|gown/i,                                        '👗'],
  [/suit|tuxedo/i,                                             '🤵'],
  [/tie|necktie|bow.?tie/i,                                    '👔'],

  // ── Bottoms ──
  [/jeans|denim/i,                                             '👖'],
  [/pants|trousers|chinos|legging|sweatpant/i,                 '👖'],
  [/shorts|swim.?short|board.?short/i,                         '🩳'],

  // ── Feet ──
  [/sneaker|trainer|running.?shoe/i,                           '👟'],
  [/boot|hiking.?boot|snow.?boot/i,                            '🥾'],
  [/sandal|flip.?flop|thong/i,                                 '🩴'],
  [/heel|pump|stiletto|wedge/i,                                '👠'],
  [/loafer|oxford|derby|dress.?shoe/i,                         '👞'],
  [/slipper/i,                                                 '🩴'],
  [/shoe|footwear|cleat/i,                                     '👟'],
  [/sock|stocking/i,                                           '🧦'],

  // ── Underwear / swimwear ──
  [/underwear|boxer|brief|bra|lingerie|undies/i,               '🩲'],
  [/swimsuit|bikini|one.?piece/i,                              '🩱'],
  [/swim/i,                                                    '🩱'],

  // ── Accessories ──
  [/sunglasses|shades/i,                                       '🕶️'],
  [/glasses|spectacles|contacts|lens/i,                        '👓'],
  [/hat|cap|beanie|beret|sun.?hat|visor|bucket.?hat/i,         '🧢'],
  [/glove|mitten/i,                                            '🧤'],
  [/scarf|wrap/i,                                              '🧣'],
  [/belt/i,                                                    '🪡'],
  [/watch/i,                                                   '⌚'],
  [/ring|necklace|bracelet|earring|jewelry|jewellery|pendant/i,'💍'],
  [/hair.?tie|hair.?band|scrunchie|clip|bobby.?pin/i,          '🪮'],
  [/backpack|rucksack/i,                                       '🎒'],
  [/bag|purse|tote|duffel|duffle|holdall/i,                    '👜'],
  [/suitcase|luggage|trolley/i,                                '🧳'],
  [/wallet|billfold/i,                                         '👛'],
  [/umbrella/i,                                                '☂️'],
  [/lanyard|badge|id.?card/i,                                  '🪪'],

  // ── Electronics ──
  [/laptop|macbook|chromebook/i,                               '💻'],
  [/phone|mobile|iphone|android|smartphone/i,                  '📱'],
  [/tablet|ipad/i,                                             '📱'],
  [/charger|charging.?cable|usb.?c|lightning.?cable/i,         '🔌'],
  [/cable|cord|wire/i,                                         '🔌'],
  [/adapter|plug|converter|travel.?plug/i,                     '🔌'],
  [/headphone|earphone|earbud|airpod|over.?ear/i,              '🎧'],
  [/speaker|bluetooth.?speaker/i,                              '🔊'],
  [/camera|dslr|mirrorless|gopro/i,                            '📷'],
  [/tripod/i,                                                   '📷'],
  [/drone/i,                                                    '🚁'],
  [/power.?bank|portable.?charger|battery.?pack/i,             '🔋'],
  [/keyboard/i,                                                '⌨️'],
  [/mouse/i,                                                    '🖱️'],
  [/hard.?drive|usb.?drive|thumb.?drive|flash.?drive|ssd/i,   '💾'],
  [/e.?reader|kindle|kobo/i,                                   '📖'],
  [/monitor|screen|display/i,                                  '🖥️'],
  [/game|console|switch|playstation|xbox/i,                    '🎮'],
  [/remote/i,                                                   '📡'],

  // ── Toiletries & Grooming ──
  [/shampoo/i,                                                 '🧴'],
  [/conditioner/i,                                             '🧴'],
  [/soap|body.?wash|shower.?gel|hand.?wash/i,                  '🧼'],
  [/toothbrush|toothpaste|floss|mouthwash|whitening/i,         '🪥'],
  [/deodorant|antiperspirant/i,                                '🧴'],
  [/razor|shaver|epilator/i,                                   '🪒'],
  [/shaving.?cream|shaving.?foam|shaving.?gel/i,               '🪒'],
  [/sunscreen|spf|sun.?block|sun.?lotion/i,                    '🧴'],
  [/perfume|cologne|fragrance|body.?spray/i,                   '🧴'],
  [/makeup|mascara|lipstick|foundation|blush|eyeliner|concealer|bronzer|highlighter/i, '💄'],
  [/nail.?polish|nail.?file|nail.?clipper|nail/i,              '💅'],
  [/comb|hair.?brush|hairbrush|detangler/i,                    '🪮'],
  [/hair.?dryer|blow.?dryer|diffuser/i,                        '💨'],
  [/straightener|flat.?iron|curling.?iron|curler/i,            '🌀'],
  [/towel|washcloth|flannel/i,                                 '🛁'],
  [/lotion|moisturizer|cream|serum|toner|cleanser/i,           '🧴'],
  [/cotton|q-?tip|cotton.?bud/i,                               '🧸'],
  [/tweezers/i,                                                '🪮'],
  [/eye.?drop|contact.?solution/i,                             '👁️'],
  [/hand.?sanitizer|sanitizer|sanitiser/i,                     '🧼'],
  [/face.?mask|sheet.?mask/i,                                  '🧴'],
  [/dry.?shampoo/i,                                            '🧴'],

  // ── Health / Medical ──
  [/medicine|medication|prescription|drug/i,                   '💊'],
  [/pill|tablet|capsule|vitamin|supplement|probiotic/i,        '💊'],
  [/first.?aid|bandage|plaster|wound|antiseptic/i,             '🩹'],
  [/inhaler|nebulizer/i,                                       '💊'],
  [/thermometer/i,                                             '🌡️'],
  [/face.?mask|surgical.?mask|n95/i,                           '😷'],
  [/insect.?repellent|bug.?spray|deet/i,                       '🦟'],
  [/allergy|antihistamine/i,                                   '💊'],

  // ── Documents / Travel ──
  [/passport/i,                                                '🛂'],
  [/visa/i,                                                    '📄'],
  [/ticket|boarding.?pass/i,                                   '🎫'],
  [/itinerary|travel.?doc|reservation|confirmation/i,          '📋'],
  [/map|guidebook|guide.?book/i,                               '🗺️'],
  [/travel.?adapter|outlet.?adapter/i,                         '🔌'],
  [/travel.?pillow|neck.?pillow/i,                             '😴'],
  [/eye.?mask|sleep.?mask/i,                                   '😴'],
  [/earplug/i,                                                  '🎧'],
  [/luggage.?lock|padlock|lock/i,                              '🔒'],
  [/key|keycard|access.?card/i,                                '🔑'],
  [/money|cash|currency|bills/i,                               '💵'],
  [/credit.?card|debit.?card|card/i,                           '💳'],
  [/insurance|policy/i,                                        '📄'],

  // ── Reading / Entertainment ──
  [/book|novel|paperback|hardcover/i,                          '📚'],
  [/magazine|journal/i,                                        '📰'],
  [/playing.?card|deck.?of.?cards/i,                           '🃏'],
  [/puzzle|crossword|sudoku/i,                                  '🧩'],

  // ── Food & Drink ──
  [/snack|granola.?bar|protein.?bar|energy.?bar|jerky|nuts|trail.?mix/i, '🍎'],
  [/water.?bottle|reusable.?bottle|hydroflask/i,               '💧'],
  [/bottle|flask|canteen|thermos/i,                            '🍶'],
  [/coffee|espresso/i,                                         '☕'],
  [/tea/i,                                                      '🍵'],
  [/gum|mints|breath.?mint/i,                                  '🍬'],

  // ── Sleep & Comfort ──
  [/sleeping.?bag/i,                                           '🛏️'],
  [/blanket|throw/i,                                           '🛌'],
  [/pillow(?!.*(neck|travel))/i,                               '🛌'],

  // ── Outdoor / Hiking / Camping ──
  [/tent/i,                                                     '⛺'],
  [/flashlight|torch|headlamp/i,                               '🔦'],
  [/compass/i,                                                  '🧭'],
  [/hiking.?pole|trekking.?pole/i,                             '🥾'],
  [/water.?filter|purification/i,                              '💧'],
  [/rope|cord|paracord/i,                                      '🧵'],
  [/lighter|match/i,                                           '🔥'],
  [/multi.?tool|swiss.?army|knife/i,                           '🔪'],
  [/bear.?spray|pepper.?spray/i,                               '🐻'],
  [/hammock/i,                                                  '🌳'],
  [/camp.?stove|burner/i,                                      '🍳'],
  [/carabiner|harness|belay/i,                                 '🧗'],

  // ── Winter / Ski ──
  [/ski|snowboard/i,                                           '⛷️'],
  [/goggle/i,                                                   '🥽'],
  [/hand.?warmer|foot.?warmer|body.?warmer/i,                  '🧤'],
  [/base.?layer|thermal/i,                                     '🧥'],
  [/snow.?boot|apres/i,                                        '🥾'],

  // ── Beach ──
  [/beach.?towel/i,                                            '🏖️'],
  [/floatie|float|inflatable/i,                                '🏊'],
  [/snorkel|fin|mask/i,                                        '🤿'],
  [/sand.?toy|bucket.?spade/i,                                 '🏖️'],

  // ── Sports & Fitness ──
  [/helmet/i,                                                   '⛑️'],
  [/yoga.?mat|mat/i,                                           '🧘'],
  [/resistance.?band|band/i,                                   '💪'],
  [/gym.?bag|duffel/i,                                         '🎒'],
  [/protein|whey|creatine/i,                                   '💪'],
  [/bike|cycling/i,                                            '🚴'],
  [/tennis|racket|racquet/i,                                   '🎾'],
  [/golf/i,                                                     '⛳'],
  [/football|soccer/i,                                         '⚽'],
  [/basketball/i,                                              '🏀'],
  [/swim.?goggle|swim.?cap/i,                                  '🏊'],
  [/running|workout|gym/i,                                     '🏃'],

  // ── Baby / Kids ──
  [/diaper|nappy/i,                                            '🍼'],
  [/wipe|baby.?wipe/i,                                         '🍼'],
  [/formula|baby.?food/i,                                      '🍼'],
  [/stroller|pram/i,                                           '🍼'],
  [/toy|stuffed|teddy|doll/i,                                  '🧸'],
  [/pacifier|dummy|soother/i,                                  '🍼'],

  // ── Work / Business ──
  [/laptop.?stand|stand/i,                                     '💻'],
  [/business.?card/i,                                          '💼'],
  [/notebook|notepad/i,                                        '📓'],
  [/pen|pencil|marker/i,                                       '🖊️'],
  [/folder|file|document/i,                                    '📁'],
  [/presentation|slides/i,                                     '📊'],
  [/lanyard/i,                                                  '🪪'],

  // ── Laundry ──
  [/laundry.?bag|wash.?bag/i,                                  '👔'],
  [/detergent|washing.?liquid|laundry.?sheet/i,                '🧼'],
  [/dryer.?sheet/i,                                            '🧼'],
  [/stain.?remover|tide.?to.?go/i,                             '🧼'],

  // ── Home comfort ──
  [/candle/i,                                                   '🕯️'],
  [/photo|picture|frame/i,                                     '🖼️'],
]

const CATEGORY_FALLBACKS: Record<string, string> = {
  clothes:     '👕',
  clothing:    '👕',
  toiletries:  '🧴',
  electronics: '💻',
  tech:        '💻',
  documents:   '📄',
  health:      '💊',
  food:        '🍎',
  snacks:      '🍎',
  shoes:       '👟',
  accessories: '👜',
  sports:      '🏃',
  outdoor:     '🌲',
  misc:        '📦',
  other:       '📦',
  beach:       '🏖️',
  ski:         '⛷️',
  hiking:      '🥾',
  camping:     '⛺',
  business:    '💼',
  baby:        '🍼',
  kids:        '🧸',
  laundry:     '🧼',
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
