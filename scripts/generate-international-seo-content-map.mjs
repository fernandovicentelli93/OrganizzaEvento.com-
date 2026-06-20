import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "docs", "international-seo");

const audiences = [
  {
    id: "US",
    label: "United States planners",
    slug: "us",
    phrase: "from the US",
    persona: "US couple or event host planning remotely",
    concern: "time zones, remote tours, card payments and clear written terms",
    countryKeyword: "from the US"
  },
  {
    id: "UKIE",
    label: "United Kingdom and Ireland planners",
    slug: "uk-ireland",
    phrase: "from the UK or Ireland",
    persona: "UK or Irish couple comparing Italian options before travel",
    concern: "VAT wording, deposits, flights and guest travel windows",
    countryKeyword: "from the UK"
  },
  {
    id: "AUCA",
    label: "Australia and Canada planners",
    slug: "australia-canada",
    phrase: "from Australia or Canada",
    persona: "long-haul planner organizing guests across time zones",
    concern: "long-distance coordination, late replies and consolidated supplier notes",
    countryKeyword: "from Australia"
  },
  {
    id: "UAESG",
    label: "UAE and Singapore planners",
    slug: "uae-singapore",
    phrase: "from the UAE or Singapore",
    persona: "international host planning a polished event in Italy",
    concern: "premium expectations, multilingual communication and fast decision cycles",
    countryKeyword: "from Dubai or Singapore"
  },
  {
    id: "EUEN",
    label: "English-searching European planners",
    slug: "english-speaking-europe",
    phrase: "from Germany, France, the Netherlands or Switzerland",
    persona: "English-searching European user comparing Italian suppliers",
    concern: "cross-border contracts, travel timing and language clarity",
    countryKeyword: "for English-speaking Europe"
  }
];

const pageTypes = {
  A: "Cost guide",
  B: "Quote and proposal guide",
  C: "Checklist",
  D: "Mistakes to avoid",
  E: "Questions to ask suppliers",
  F: "Comparison guide",
  G: "Event-type guide",
  H: "Destination guide",
  I: "City or region guide",
  J: "Budget-based guide",
  K: "Guest-count guide",
  L: "Seasonal guide",
  M: "Style-based guide",
  N: "Contract and deposit guide",
  O: "Planning from abroad guide"
};

const schemas = {
  A: "Article + BreadcrumbList; FAQPage only if real FAQ content is visible",
  B: "Article + BreadcrumbList; FAQPage if comparison questions are visible",
  C: "Article + BreadcrumbList + HowTo only if steps are explicit",
  D: "Article + BreadcrumbList",
  E: "Article + BreadcrumbList + FAQPage if supplier questions are visible",
  F: "Article + BreadcrumbList",
  G: "Article + BreadcrumbList",
  H: "Article + BreadcrumbList",
  I: "Article + BreadcrumbList",
  J: "Article + BreadcrumbList",
  K: "Article + BreadcrumbList",
  L: "Article + BreadcrumbList",
  M: "Article + BreadcrumbList",
  N: "Article + BreadcrumbList",
  O: "Article + BreadcrumbList + HowTo only if planning steps are visible"
};

const verticals = [
  {
    key: "venues",
    idPrefix: "EN-VEN",
    vertical: "Event venues in Italy",
    urlFolder: "italy-event-venues",
    supplierNoun: "Italian venues",
    defaultLinks: "Analyze an Italian quote (/en/analyze-quote); Event suppliers in Italy (/en/event-suppliers); Open community questions (/en/questions)",
    ctas: [
      "Once your venue checklist is clear, you can compare Italian venues on Vibes Planner.",
      "If you already know the venue style you need, Vibes Planner can help you discover Italian venues in one place.",
      "Planning remotely? Use Vibes Planner after you have a clear shortlist and questions for venues."
    ],
    topics: [
      ["Remote venue booking", "O", "Book an Italy wedding venue remotely", "book-italy-wedding-venue-remotely", "how to book a wedding venue in Italy from abroad", "remote venue booking, virtual tours and written confirmation", "booking a venue without visiting Italy first", "A remote-first checklist focused on virtual tours, written inclusions and timing gaps.", "Annotated remote booking checklist; sample email points [TO VALIDATE]"],
      ["Venue contract questions", "E", "Questions before signing an Italy venue", "questions-before-signing-italy-venue", "questions to ask an Italian wedding venue", "venue contract questions, deposits, curfew and restrictions", "signing a venue contract with unclear restrictions", "A supplier-question page that separates must-ask items from nice-to-have details.", "Venue question bank by topic; contract terms to verify [TO VALIDATE]"],
      ["Deposits and cancellation", "N", "Italy venue deposits and cancellation", "italy-venue-deposit-cancellation", "Italian venue deposit cancellation policy", "venue deposit Italy, cancellation clause, refund terms", "understanding what happens if travel plans change", "A contract-focused guide for foreign users who may face flight or family changes.", "Deposit clause examples to request; refund wording checklist [TO VALIDATE]"],
      ["Rain backup", "C", "Outdoor Italy venues with rain backup", "outdoor-italy-venue-rain-backup", "Italy outdoor wedding venue rain backup", "backup plan, indoor space, weather plan, tent options", "choosing an outdoor venue without a realistic rain plan", "A practical backup-plan checklist instead of a generic venue inspiration page.", "Seasonal weather risks by region [TO VALIDATE]; backup-plan checklist"],
      ["Villa vs hotel", "F", "Italian villa or hotel venue decision", "italian-villa-vs-hotel-venue", "villa vs hotel wedding venue in Italy", "exclusive use, accommodation, transport, catering rules", "deciding between a private villa and a hotel venue", "A decision comparison tied to guest logistics and supplier flexibility.", "Comparison table; accommodation and transport assumptions [TO VALIDATE]"],
      ["50 guest venue", "K", "Italy venue for 50 guests", "italy-venue-50-guests", "wedding venue Italy 50 guests", "small venue capacity, intimate wedding, minimum spend", "finding a venue that does not feel too large for 50 guests", "A guest-count guide focused on minimum spend, room scale and staffing.", "Space-per-guest notes and minimum-spend checks [TO VALIDATE]"],
      ["120 guest venue", "K", "Italy venue for 120 guests", "italy-venue-120-guests", "wedding venue Italy 120 guests", "capacity, seating plan, parking, toilets, backup space", "checking whether a venue really works for 120 guests", "A capacity reality-check for larger destination events.", "Capacity questions; layout and service-flow checks [TO VALIDATE]"],
      ["Lake Como venues", "H", "Lake Como venue logistics", "lake-como-venue-logistics", "Lake Como wedding venue logistics", "boat access, transfers, hotels, narrow roads", "understanding Lake Como access before choosing a venue", "A logistics-first destination page, not a generic Lake Como list.", "Transfer timing examples; boat/road access checks [TO VALIDATE]"],
      ["Tuscany venues", "H", "Tuscany venue transport and lodging", "tuscany-venue-transport-lodging", "Tuscany wedding venue transport accommodation", "rural venues, buses, guest lodging, late-night returns", "planning transport for rural Tuscan venues", "A guest-comfort guide for countryside venues and scattered accommodation.", "Transport timeline; lodging radius checklist [TO VALIDATE]"],
      ["Rome private event venues", "I", "Rome private venue restrictions", "rome-private-event-venue-restrictions", "private event venue Rome restrictions", "noise limits, city access, catering rules, closing time", "checking restrictions before booking a Rome venue", "A city restriction page for users planning from another country.", "Rome access and curfew questions to verify [TO VALIDATE]"],
      ["Amalfi Coast venues", "H", "Amalfi Coast venue access", "amalfi-coast-venue-access", "Amalfi Coast wedding venue access", "stairs, boats, traffic, luggage, guest transfers", "choosing a coastal venue guests can actually reach", "A transport and accessibility guide for scenic but complex venues.", "Access questions, mobility checks and transfer buffer [TO VALIDATE]"],
      ["Exclusive use", "F", "Exclusive-use venues in Italy", "exclusive-use-venues-italy", "exclusive use wedding venue Italy", "private venue hire, shared spaces, privacy, buyout", "knowing what exclusive use really includes", "A terminology guide that prevents confusion around shared spaces.", "Exclusive-use contract wording checklist [TO VALIDATE]"],
      ["Music curfew", "E", "Venue music curfew in Italy", "italy-venue-music-curfew", "Italy venue music curfew questions", "SIAE, volume limits, party time, outdoor sound", "avoiding a venue that stops music too early", "A venue-plus-music page for users who care about the party segment.", "Curfew questions and SIAE responsibility notes [TO VALIDATE]"],
      ["Virtual site visit", "O", "Virtual tour of an Italy venue", "italy-venue-virtual-tour", "Italian wedding venue virtual tour", "video tour, live call, floor plan, photo proof", "assessing a venue remotely with enough evidence", "A remote-inspection process for people who cannot fly to Italy first.", "Virtual tour shot list; file checklist [TO VALIDATE]"],
      ["Accessibility and parking", "C", "Italy venue access and parking checklist", "italy-venue-access-parking-checklist", "Italy event venue accessibility parking", "airport transfer, parking, mobility, guest access", "checking whether guests can arrive comfortably", "A practical access checklist for mixed-age international guests.", "Accessibility questions and transport notes [TO VALIDATE]"],
      ["Corporate retreat venue", "G", "Corporate retreat venues in Italy", "corporate-retreat-venues-italy", "corporate retreat venue Italy checklist", "meeting rooms, accommodation, AV, dinners, transfers", "choosing a venue that works for both meetings and hospitality", "A business-event guide that balances work rooms and guest experience.", "Corporate venue checklist; AV and room block questions [TO VALIDATE]"],
      ["Luxury villa extras", "A", "Hidden costs of Italian luxury villas", "hidden-costs-italian-luxury-villas", "hidden costs luxury villa wedding Italy", "cleaning fee, security, late-night fee, rentals, staff", "spotting villa extras before paying a deposit", "A cost-risk page focused on what luxury villa quotes may exclude.", "Approximate extra categories [TO VALIDATE]; quote review checklist"],
      ["Rustic farmhouse venue", "M", "Rustic farmhouse event venues in Italy", "rustic-farmhouse-event-venues-italy", "rustic farmhouse wedding venue Italy", "agriturismo, countryside, catering, transport, weather", "choosing rustic style without losing practical control", "A style guide that connects aesthetics with access, comfort and supplier limits.", "Rustic venue practicality checklist [TO VALIDATE]"],
      ["Last-minute venue change", "O", "Changing Italy venues last minute", "change-italy-event-venue-last-minute", "last minute venue change Italy event", "replacement venue, guest logistics, deposits, suppliers", "handling a venue problem close to the event date", "A crisis-planning guide for foreign hosts already committed to Italy.", "Emergency checklist; documents to save [TO VALIDATE]"],
      ["Venue quote comparison", "B", "Compare Italian venue quotes", "compare-italian-venue-quotes", "compare wedding venue quotes Italy", "included items, VAT, exclusivity, rentals, penalties", "understanding why two venue quotes look different", "A quote-comparison map that turns venue proposals into decision criteria.", "Quote comparison table; missing-line examples [TO VALIDATE]"]
    ]
  },
  {
    key: "catering",
    idPrefix: "EN-CAT",
    vertical: "Catering suppliers in Italy",
    urlFolder: "italy-catering",
    supplierNoun: "Italian catering suppliers",
    defaultLinks: "Analyze an Italian quote (/en/analyze-quote); How much does it cost? (/en/real-prices); Event suppliers in Italy (/en/event-suppliers)",
    ctas: [
      "After you know what the catering quote should include, Vibes Planner can help you compare Italian catering suppliers.",
      "If your menu and guest count are clear, you can turn the checklist into a supplier request on Vibes Planner.",
      "Already have a catering proposal? Use Vibes Planner to compare alternatives before deciding."
    ],
    topics: [
      ["Wedding catering cost", "A", "Italy wedding catering costs", "italy-wedding-catering-costs", "how much does wedding catering cost in Italy", "cost per guest, service staff, drinks, VAT", "understanding catering cost drivers before requesting quotes", "A cost-factor guide with ranges clearly marked for validation.", "Approximate per-guest ranges [TO VALIDATE]; cost driver table"],
      ["Buffet vs seated dinner", "F", "Buffet or seated dinner in Italy", "buffet-vs-seated-dinner-italy", "buffet vs seated dinner Italy wedding", "menu style, staffing, guest flow, rentals", "choosing the right service style for foreign guests", "A decision guide that links style, staff count and venue constraints.", "Service-style comparison table; staffing notes [TO VALIDATE]"],
      ["Catering quote abroad", "B", "Read an Italian catering quote", "read-italian-catering-quote", "Italian catering quote from abroad", "menu lines, staff, travel, setup, cleanup", "checking a catering quote without knowing local norms", "A line-by-line proposal review for users outside Italy.", "Quote annotation model; unclear wording examples [TO VALIDATE]"],
      ["Open bar", "A", "Open bar costs in Italy", "open-bar-costs-italy-events", "open bar cost Italy wedding", "drink package, bartender, glassware, corkage", "understanding whether drinks are included or extra", "A drinks-focused guide that separates bar, service and equipment.", "Drink package categories and cost drivers [TO VALIDATE]"],
      ["Wedding cake", "E", "Wedding cake in Italian catering quotes", "wedding-cake-italian-catering-quote", "is wedding cake included in Italy catering", "cake cutting, dessert buffet, bakery, delivery", "knowing whether cake is included before signing", "A small but high-friction question page for quote clarity.", "Cake inclusion checklist; bakery coordination notes [TO VALIDATE]"],
      ["Remote tasting", "O", "Catering tasting from abroad", "italy-catering-tasting-from-abroad", "catering tasting Italy from abroad", "remote tasting, sample menu, food photos, travel timing", "deciding how to evaluate food before arriving in Italy", "A remote-planning page about tasting alternatives and proof points.", "Remote tasting options to verify [TO VALIDATE]"],
      ["Dietary restrictions", "C", "Dietary restrictions in Italy catering", "dietary-restrictions-italy-catering", "Italy catering dietary restrictions wedding", "vegetarian, vegan, gluten-free, allergies, labels", "communicating dietary needs across languages", "A checklist for avoiding missed allergies or unclear menu notes.", "Dietary request template; allergen notes [TO VALIDATE]"],
      ["Staff and equipment", "B", "Catering staff and equipment in Italy", "italy-catering-staff-equipment", "Italy catering staff equipment included", "waiters, chef, tables, chairs, linens, plates, glasses", "checking whether service and equipment are included", "A proposal guide focused on what foreign users often assume is included.", "Inclusion matrix; rental categories [TO VALIDATE]"],
      ["Vegan menu", "M", "Vegan and vegetarian Italian event menus", "vegan-vegetarian-italian-event-menu", "vegan catering Italy wedding", "vegetarian menu, vegan menu, regional dishes, allergies", "building a menu that feels Italian and inclusive", "A style-and-menu guide for inclusive guest groups.", "Menu examples to validate with suppliers [TO VALIDATE]"],
      ["Regional menus", "M", "Regional Italian menus for events", "regional-italian-event-menus", "regional Italian catering menu wedding", "Tuscan menu, coastal menu, southern Italy, local wine", "using regional food without creating logistics problems", "A menu-style page that explains how regional identity affects supplier choice.", "Regional menu examples [TO VALIDATE]; pairing questions"],
      ["50 guests catering", "K", "Catering for 50 guests in Italy", "italy-catering-50-guests", "catering Italy 50 guests", "small event catering, staff ratio, minimum spend", "avoiding overbuilt catering for a smaller event", "A guest-count guide focused on minimum order and staff balance.", "Staff and service assumptions [TO VALIDATE]"],
      ["120 guests catering", "K", "Catering for 120 guests in Italy", "italy-catering-120-guests", "catering Italy 120 guests", "service line, kitchen space, staff, timing", "checking whether the caterer can serve a larger group smoothly", "A scale guide for service flow and kitchen logistics.", "Timeline and staff checks [TO VALIDATE]"],
      ["Private chef vs caterer", "F", "Private chef or caterer in Italy", "private-chef-vs-caterer-italy", "private chef vs catering Italy event", "villa dinner, small wedding, staff, rentals, cleanup", "choosing between a chef experience and event catering", "A comparison for intimate events where the wrong option can underperform.", "Option matrix; villa service questions [TO VALIDATE]"],
      ["Corporate catering", "G", "Corporate retreat catering in Italy", "corporate-retreat-catering-italy", "corporate event catering Italy checklist", "coffee breaks, dinners, dietary needs, timing", "feeding a business group without slowing the program", "A business-event guide around agenda, breaks and service timing.", "Corporate catering checklist [TO VALIDATE]"],
      ["Welcome dinner", "G", "Welcome dinner catering in Italy", "welcome-dinner-catering-italy", "welcome dinner catering Italy", "pre-wedding dinner, buffet, family style, drinks", "planning a lower-pressure meal before the main event", "A secondary-event page with a different budget and service logic.", "Welcome dinner menu and service checks [TO VALIDATE]"],
      ["Hidden catering extras", "A", "Hidden catering extras in Italy", "hidden-catering-extras-italy", "hidden catering costs Italy wedding", "travel, overtime, rentals, VAT, cleaning, corkage", "spotting extra costs before comparing caterers", "A risk-first cost guide that prevents misleading quote comparisons.", "Hidden extra categories [TO VALIDATE]"],
      ["Catering deposit", "N", "Italian catering deposits and cancellation", "italian-catering-deposit-cancellation", "catering deposit cancellation Italy", "deposit, balance, guest count deadline, cancellation", "understanding payment timing and cancellation risk", "A contract page focused on guest-count changes and payment milestones.", "Payment timeline examples [TO VALIDATE]"],
      ["Tableware and rentals", "B", "Tableware in Italian catering quotes", "tableware-rentals-italian-catering", "Italy catering tableware rentals included", "plates, glasses, linens, tables, chairs, transport", "checking whether rentals are really part of the catering quote", "A quote detail page for a common foreign-user assumption.", "Rental inclusion table [TO VALIDATE]"],
      ["Setup and cleanup", "E", "Catering setup and cleanup in Italy", "italy-catering-setup-cleanup", "Italy catering setup cleanup questions", "setup time, cleanup, waste, travel fees, venue rules", "avoiding friction between caterer and venue rules", "A questions-to-ask page focused on operational handoff.", "Venue-caterer coordination checklist [TO VALIDATE]"],
      ["Compare catering quotes", "B", "Compare Italian catering quotes", "compare-italian-catering-quotes", "compare catering quotes Italy", "menu, service, drinks, rentals, VAT, extras", "understanding why two catering proposals differ", "A comparison guide that turns menu proposals into apples-to-apples checks.", "Quote comparison grid [TO VALIDATE]"]
    ]
  },
  {
    key: "music",
    idPrefix: "EN-MUS",
    vertical: "Music suppliers in Italy",
    urlFolder: "italy-event-music",
    supplierNoun: "Italian music suppliers",
    defaultLinks: "Analyze an Italian quote (/en/analyze-quote); Event suppliers in Italy (/en/event-suppliers); Community questions (/en/questions)",
    ctas: [
      "When the music brief is clear, Vibes Planner can help you compare Italian DJs, bands and musicians.",
      "If you already have a music quote, Vibes Planner can help you look for alternatives before committing.",
      "Planning from abroad? Use Vibes Planner after you define ceremony, dinner and party music needs."
    ],
    topics: [
      ["Hire DJ remotely", "O", "Hire a DJ in Italy from abroad", "hire-dj-italy-from-abroad", "hire DJ for destination wedding Italy", "DJ quote, playlist, equipment, travel fees", "booking a DJ without meeting in person", "A remote-hiring guide focused on proof, playlists and technical details.", "DJ brief template; call checklist [TO VALIDATE]"],
      ["Band vs DJ", "F", "Live band or DJ in Italy", "live-band-vs-dj-italy", "live band vs DJ Italy wedding", "party energy, budget, setup, venue limits", "choosing the right music format for the event mood", "A comparison that links guest profile, venue restrictions and budget.", "Music format matrix [TO VALIDATE]"],
      ["Ceremony music", "M", "Ceremony music in Italy", "ceremony-music-italy-wedding", "ceremony music Italy wedding", "violin, singer, acoustic duo, church rules", "choosing ceremony music that fits Italian venue rules", "A ceremony-specific page rather than a generic music page.", "Ceremony supplier questions [TO VALIDATE]"],
      ["Cocktail music", "M", "Cocktail hour music in Italy", "cocktail-hour-music-italy", "cocktail hour music Italy wedding", "saxophonist, acoustic duo, aperitivo, volume", "making cocktail hour feel lively without overbuilding", "A mood-and-flow page for the aperitivo segment.", "Segment timeline examples [TO VALIDATE]"],
      ["SIAE licensing", "N", "SIAE music licensing for Italy events", "siae-music-licensing-italy-events", "SIAE music license Italy wedding", "music license, DJ, band, venue responsibility", "understanding who handles music licensing in Italy", "A compliance guide that avoids false certainty and asks for written responsibility.", "SIAE responsibility questions [TO VALIDATE]"],
      ["Sound system", "B", "Sound system in Italian music quotes", "sound-system-italian-music-quote", "DJ sound system included Italy", "speakers, mixer, microphones, ceremony audio", "checking whether equipment is included or extra", "A quote-line guide for technical inclusions.", "Equipment inclusion matrix [TO VALIDATE]"],
      ["Curfew and volume", "E", "Music curfew and volume limits in Italy", "music-curfew-volume-limits-italy", "Italy wedding music curfew volume limits", "venue curfew, outdoor sound, decibel limits", "avoiding a party plan that the venue cannot allow", "A venue-music question guide for late-night expectations.", "Curfew question bank [TO VALIDATE]"],
      ["Playlist requests", "C", "Playlist requests for Italy wedding music", "playlist-requests-italy-wedding-music", "wedding playlist requests Italy DJ", "must-play songs, do-not-play list, cultural music", "communicating music taste across languages", "A checklist for playlists and cultural expectations.", "Playlist brief template [TO VALIDATE]"],
      ["Wedding music timeline", "C", "Wedding music timeline in Italy", "wedding-music-timeline-italy", "Italy wedding music timeline", "ceremony, aperitivo, dinner, party, transitions", "mapping music suppliers to each event segment", "A timeline-first page that prevents supplier gaps.", "Timeline checklist [TO VALIDATE]"],
      ["DJ travel fees", "A", "DJ travel fees in Italy", "dj-travel-fees-italy", "DJ travel fee Italy wedding", "transport, lodging, late-night return, setup time", "understanding travel fees before comparing DJ quotes", "A cost guide focused on geography and late-night logistics.", "Travel fee categories [TO VALIDATE]"],
      ["Band contract", "N", "Italian band contracts and deposits", "italian-band-contract-deposit", "Italy wedding band contract deposit", "deposit, lineup, set length, overtime, cancellation", "getting band terms in writing before paying", "A contract guide for live music details that may change.", "Band contract checklist [TO VALIDATE]"],
      ["Backup equipment", "E", "Backup equipment for music in Italy", "music-backup-equipment-italy", "DJ backup equipment Italy wedding", "backup mixer, speakers, power, rain plan", "reducing technical failure risk on event day", "A technical questions page for non-technical foreign users.", "Backup equipment questions [TO VALIDATE]"],
      ["Small wedding music", "K", "Music for a 40 guest Italy wedding", "music-40-guest-italy-wedding", "music for small wedding Italy", "acoustic duo, DJ, intimate dinner, volume", "choosing music that fits a small guest count", "A guest-count page for intimate events where a full band may feel too much.", "Small event format comparison [TO VALIDATE]"],
      ["Large wedding music", "K", "Music for 150 guests in Italy", "music-150-guests-italy", "music for 150 guest wedding Italy", "band, DJ, lighting, sound coverage, timeline", "scaling music and audio for a larger group", "A guest-count guide focused on coverage and flow.", "Large-event audio checklist [TO VALIDATE]"],
      ["Corporate music", "G", "Music for corporate events in Italy", "music-corporate-events-italy", "corporate event music Italy", "welcome music, dinner, awards, DJ, AV", "matching music to a business event agenda", "A business-event page that avoids wedding-only assumptions.", "Corporate music timeline [TO VALIDATE]"],
      ["Lake Como music", "H", "Music logistics for Lake Como events", "lake-como-event-music-logistics", "Lake Como wedding music logistics", "boat access, setup, curfew, travel fees", "planning musicians around difficult access", "A destination logistics page for suppliers and equipment.", "Lake Como supplier logistics checks [TO VALIDATE]"],
      ["Tuscany music", "H", "Music for Tuscany destination weddings", "tuscany-destination-wedding-music", "Tuscany wedding music suppliers", "rural venues, curfew, travel, acoustic options", "matching music to countryside venues", "A destination-specific page for rural setup and guest flow.", "Tuscany music checks [TO VALIDATE]"],
      ["Bilingual MC", "O", "Bilingual MC and singer in Italy", "bilingual-mc-singer-italy", "bilingual MC Italy wedding", "English speaking MC, singer, announcements", "bridging language gaps during the event", "A communication-led music page for international guests.", "Bilingual brief and announcement checklist [TO VALIDATE]"],
      ["Lighting and audio extras", "A", "Lighting and audio extras in Italy", "lighting-audio-extras-italy-music", "DJ lighting audio extras Italy", "uplights, dance floor lights, microphones, cables", "spotting technical extras in music quotes", "A quote-cost guide for equipment lines people often overlook.", "Audio/lighting extra categories [TO VALIDATE]"],
      ["Compare DJ quotes", "B", "Compare Italian DJ quotes", "compare-italian-dj-quotes", "compare DJ quotes Italy wedding", "hours, equipment, lighting, travel, SIAE, overtime", "understanding which DJ quote is actually complete", "A comparison guide that focuses on hours, gear and obligations.", "DJ quote comparison table [TO VALIDATE]"]
    ]
  },
  {
    key: "entertainment",
    idPrefix: "EN-ENT",
    vertical: "Entertainment suppliers in Italy",
    urlFolder: "italy-event-entertainment",
    supplierNoun: "Italian entertainment suppliers",
    defaultLinks: "Event suppliers in Italy (/en/event-suppliers); Analyze an Italian quote (/en/analyze-quote); Open community questions (/en/questions)",
    ctas: [
      "After you define the entertainment brief, Vibes Planner can help you discover Italian performers and event suppliers.",
      "If the entertainment quote is unclear, compare alternatives on Vibes Planner before you decide.",
      "Once safety, timing and space are clear, you can turn the entertainment brief into a Vibes Planner supplier request."
    ],
    topics: [
      ["Photobooth", "A", "Photobooth costs in Italy", "photobooth-costs-italy-events", "photobooth cost Italy wedding", "prints, props, attendant, backdrop, delivery", "checking whether a photobooth quote is complete", "A cost guide that separates equipment, service time and delivery.", "Photobooth inclusion table [TO VALIDATE]"],
      ["Children entertainment", "C", "Children entertainment at Italy events", "children-entertainment-italy-events", "children entertainment Italy wedding", "age groups, safety, materials, timing, indoor backup", "keeping children engaged without disrupting the event", "A family-event checklist focused on safety and duration.", "Age-based activity checklist [TO VALIDATE]"],
      ["Magician or performer", "F", "Magician or performer for Italy events", "magician-performer-italy-events", "magician for wedding Italy", "close-up magic, stage show, guest flow, language", "choosing the right performer format", "A comparison between roaming and stage entertainment.", "Format comparison matrix [TO VALIDATE]"],
      ["Fire show", "N", "Fire shows at events in Italy", "fire-show-events-italy-permits", "fire show wedding Italy permits", "safety, insurance, venue permission, outdoor space", "understanding permits and risk before booking a show", "A safety-first contract page for high-impact entertainment.", "Permit and safety questions [TO VALIDATE]"],
      ["Luxury entertainment", "M", "Luxury entertainment for Italy weddings", "luxury-entertainment-italy-weddings", "luxury wedding entertainment Italy", "performers, surprise acts, live show, guest experience", "adding impact without making the event feel random", "A style guide that ties luxury entertainment to timing and guest profile.", "Luxury entertainment decision criteria [TO VALIDATE]"],
      ["Team building", "G", "Team building activities in Italy", "team-building-activities-italy", "team building activities Italy corporate retreat", "indoor, outdoor, facilitation, duration, language", "choosing activities that fit an international corporate group", "A corporate guide focused on facilitation and group dynamics.", "Activity suitability table [TO VALIDATE]"],
      ["Interactive games", "M", "Interactive games for Italy weddings", "interactive-games-italy-weddings", "interactive wedding games Italy", "guest participation, language, timing, host", "using games without making guests uncomfortable", "A taste-level guide for international weddings.", "Game suitability checklist [TO VALIDATE]"],
      ["Hosts and speakers", "G", "Hosts and speakers for Italy events", "hosts-speakers-italy-events", "event host speaker Italy corporate", "English host, moderator, awards, agenda, microphone", "finding a host who can manage an international audience", "A role-definition guide for hosts, MCs and moderators.", "Host brief template [TO VALIDATE]"],
      ["Space requirements", "E", "Entertainment space requirements in Italy", "entertainment-space-requirements-italy", "event entertainment space requirements Italy", "stage, ceiling height, power, indoor, outdoor", "checking whether entertainment physically fits the venue", "A supplier-question page about space, power and layout.", "Space requirement checklist [TO VALIDATE]"],
      ["Backup plan", "C", "Entertainment backup plans in Italy", "entertainment-backup-plan-italy", "event entertainment backup plan Italy", "rain plan, indoor move, cancellation, substitute act", "preventing weather or supplier disruption", "A backup checklist for entertainment that depends on space or weather.", "Backup clauses and plan B checklist [TO VALIDATE]"],
      ["Guest age", "K", "Entertainment by guest age in Italy", "entertainment-guest-age-italy", "event entertainment by guest age Italy", "children, adults, mixed generations, duration", "choosing entertainment that fits who is actually attending", "A guest-profile guide rather than supplier-category list.", "Age and duration matrix [TO VALIDATE]"],
      ["Compare entertainment quotes", "B", "Compare Italian entertainment quotes", "compare-italian-entertainment-quotes", "compare entertainment quotes Italy", "duration, materials, travel, insurance, setup", "understanding why entertainment quotes vary", "A proposal guide focused on duration, materials and obligations.", "Quote comparison grid [TO VALIDATE]"],
      ["Insurance and permits", "N", "Entertainment insurance and permits in Italy", "entertainment-insurance-permits-italy", "event entertainment insurance permits Italy", "insurance, venue approval, safety, local rules", "checking risk before booking special acts", "A contract-and-risk page for acts with setup or safety needs.", "Insurance questions [TO VALIDATE]"],
      ["Travel fees", "A", "Entertainment travel fees in Italy", "entertainment-travel-fees-italy", "entertainment supplier travel fee Italy", "transport, lodging, setup, late return, assistants", "spotting travel and logistics costs in quotes", "A cost guide for performers who travel between regions.", "Travel fee categories [TO VALIDATE]"],
      ["Last-minute replacement", "O", "Replace entertainment last minute in Italy", "replace-entertainment-last-minute-italy", "last minute entertainment supplier Italy", "backup supplier, contract, timing, venue approval", "handling a supplier change close to the event", "A crisis-planning page for foreign hosts already committed.", "Emergency replacement checklist [TO VALIDATE]"],
      ["Private party entertainment", "G", "Private party entertainment in Italy", "private-party-entertainment-italy", "private party entertainment Italy", "birthday, villa party, DJ add-ons, performers", "choosing entertainment for a private celebration", "A private-event guide separate from weddings and corporate events.", "Party entertainment brief [TO VALIDATE]"],
      ["Dinner show vs roaming", "F", "Dinner show or roaming entertainment", "dinner-show-vs-roaming-entertainment-italy", "dinner show roaming entertainment Italy", "guest flow, meal timing, attention, venue layout", "choosing whether entertainment should stop the room or blend in", "A format comparison around guest attention and dinner timing.", "Format comparison table [TO VALIDATE]"],
      ["Beach entertainment", "H", "Beach event entertainment in Italy", "beach-event-entertainment-italy", "beach wedding entertainment Italy", "permits, wind, power, sound, safety", "planning entertainment in exposed coastal settings", "A destination-style guide for beach and coastal constraints.", "Beach setup questions [TO VALIDATE]"],
      ["Entertainment timeline", "C", "Entertainment timeline for Italy events", "entertainment-timeline-italy-events", "event entertainment timeline Italy", "arrival, setup, performance, breaks, teardown", "placing entertainment into the event flow", "A schedule checklist that keeps suppliers from overlapping badly.", "Timeline template [TO VALIDATE]"],
      ["Budget entertainment", "J", "Entertainment options by budget in Italy", "entertainment-options-budget-italy", "event entertainment budget Italy", "low budget, mid range, premium, priorities", "deciding where entertainment budget matters most", "A budget-priority guide that avoids fake exact prices.", "Budget tiers [TO VALIDATE]; priority matrix"]
    ]
  },
  {
    key: "wedding-planners",
    idPrefix: "EN-WED",
    vertical: "Wedding planners in Italy",
    urlFolder: "italy-wedding-planners",
    supplierNoun: "Italian wedding planners",
    defaultLinks: "Wedding and event suppliers (/en/event-suppliers); Analyze an Italian quote (/en/analyze-quote); Community questions (/en/questions)",
    ctas: [
      "After you know which planning support you need, Vibes Planner can help you discover Italian wedding planners and suppliers.",
      "If you are comparing planner proposals, Vibes Planner can help you look for alternatives before choosing.",
      "Planning from abroad? Use Vibes Planner once your planner brief and budget questions are clear."
    ],
    topics: [
      ["Full vs day-of", "F", "Full planning or day-of coordination", "full-planning-vs-day-of-italy", "Italy wedding planner full planning vs day of", "full planning, partial planning, coordination, scope", "choosing the right level of planner support", "A scope comparison for foreign couples unsure how much help they need.", "Planner scope comparison table [TO VALIDATE]"],
      ["Planner cost", "A", "Wedding planner cost in Italy", "wedding-planner-cost-italy", "wedding planner cost Italy", "planner fee, percentage, flat fee, coordination", "understanding planner pricing models before asking for quotes", "A cost-model guide with ranges marked for validation.", "Fee model examples [TO VALIDATE]"],
      ["Hire planner remotely", "O", "Hire an Italy wedding planner remotely", "hire-italy-wedding-planner-remotely", "hire wedding planner Italy from abroad", "remote calls, language, timeline, supplier shortlist", "hiring a planner without meeting in person", "A remote hiring process focused on communication evidence and scope.", "Remote interview checklist [TO VALIDATE]"],
      ["Venue scouting", "E", "Planner venue scouting in Italy", "planner-venue-scouting-italy", "Italy wedding planner venue scouting", "venue shortlist, site visits, virtual tour, logistics", "knowing what venue scouting should include", "A supplier-question page for planner-led venue selection.", "Venue scouting deliverables [TO VALIDATE]"],
      ["Supplier selection", "E", "Planner supplier selection in Italy", "planner-supplier-selection-italy", "wedding planner supplier selection Italy", "shortlist, quotes, negotiation, coordination", "understanding how planners recommend suppliers", "A transparency guide around supplier selection and comparison.", "Supplier shortlist questions [TO VALIDATE]"],
      ["Budget management", "J", "Wedding budget management in Italy", "wedding-budget-management-italy-planner", "Italy wedding planner budget management", "budget tracker, quote comparison, priorities, extras", "keeping an Italian destination wedding budget visible", "A budget-control page for users comparing many Italian suppliers.", "Budget tracker fields [TO VALIDATE]"],
      ["Legal support", "N", "Planner legal support in Italy", "planner-legal-support-italy-wedding", "Italy wedding planner legal support", "civil ceremony, documents, translator, timing", "knowing whether the planner handles bureaucracy", "A verified-terms page that avoids promising legal outcomes.", "Document timing notes [TO VALIDATE]"],
      ["Family coordination", "M", "Planner family coordination in Italy", "planner-family-coordination-italy", "wedding planner family coordination Italy", "parents, guest questions, travel notes, timeline", "reducing family pressure during destination planning", "A human-situation page around communication and expectation setting.", "Family communication template [TO VALIDATE]"],
      ["Planner contract", "N", "Italian planner contracts and deposits", "italian-planner-contract-deposit", "Italy wedding planner contract deposit", "scope, deposit, cancellation, extra hours", "understanding planner terms before paying", "A contract page focused on scope creep and payment milestones.", "Planner contract checklist [TO VALIDATE]"],
      ["Wedding timeline", "C", "Italy wedding planning timeline", "italy-wedding-planning-timeline", "destination wedding Italy planning timeline", "12 months, 6 months, supplier deadlines, travel", "knowing what to do when planning from abroad", "A timeline checklist with remote-planning gates.", "Timeline milestones [TO VALIDATE]"],
      ["Design and styling", "M", "Wedding design and styling in Italy", "wedding-design-styling-italy-planner", "Italy wedding planner design styling", "moodboard, florist, rentals, table design", "knowing when styling is part of planning", "A style-scope page that separates planner, florist and rental roles.", "Design deliverables checklist [TO VALIDATE]"],
      ["Emergency handling", "O", "Planner emergency handling in Italy", "planner-emergency-handling-italy", "Italy wedding planner emergency handling", "rain, supplier delay, guest issue, timeline change", "understanding what a planner can handle on event day", "A risk-management page for foreign couples who cannot fix issues locally.", "Emergency plan questions [TO VALIDATE]"],
      ["Lake Como planner", "H", "Wedding planner for Lake Como", "wedding-planner-lake-como-guide", "Lake Como wedding planner from abroad", "venue access, boats, guest hotels, supplier logistics", "deciding if Lake Como needs specialist planning support", "A destination guide focused on logistics, not luxury claims.", "Lake Como logistics checklist [TO VALIDATE]"],
      ["Tuscany planner", "H", "Wedding planner for Tuscany", "wedding-planner-tuscany-guide", "Tuscany wedding planner from abroad", "rural venues, transport, catering, guest lodging", "coordinating countryside suppliers and guests", "A destination planner guide for rural event complexity.", "Tuscany planning checklist [TO VALIDATE]"],
      ["Amalfi planner", "H", "Wedding planner for the Amalfi Coast", "wedding-planner-amalfi-coast-guide", "Amalfi Coast wedding planner from abroad", "traffic, stairs, boats, hotels, supplier timing", "handling coastal logistics and guest movement", "A destination guide around access and supplier timing.", "Amalfi logistics checks [TO VALIDATE]"],
      ["Corporate event planner", "G", "Corporate event planner in Italy", "corporate-event-planner-italy", "corporate event planner Italy", "retreat, meeting, dinner, transport, suppliers", "planning a corporate event with business standards", "A corporate planning page separate from wedding planning.", "Corporate planner scope checklist [TO VALIDATE]"],
      ["Bilingual communication", "O", "English-speaking planner in Italy", "english-speaking-wedding-planner-italy", "English speaking wedding planner Italy", "language, translation, supplier emails, meetings", "bridging language gaps with Italian suppliers", "A communication-first page for foreign couples.", "Communication standards checklist [TO VALIDATE]"],
      ["Partial planning", "F", "Partial planning for Italy weddings", "partial-planning-italy-wedding", "partial wedding planner Italy", "partial planning, supplier review, timeline, handover", "deciding if partial planning is enough", "A middle-scope comparison for couples who already booked some suppliers.", "Partial-planning scope matrix [TO VALIDATE]"],
      ["Compare planner proposals", "B", "Compare Italian planner proposals", "compare-italian-planner-proposals", "compare wedding planner proposals Italy", "scope, fee, timeline, suppliers, contract", "understanding why planner proposals differ", "A proposal-review page focused on scope, not only price.", "Proposal comparison grid [TO VALIDATE]"],
      ["Planner red flags", "D", "Italy wedding planner red flags", "italy-wedding-planner-red-flags", "Italy wedding planner red flags", "unclear scope, vague fees, supplier lock-in, slow replies", "spotting warning signs before hiring a planner", "A mistakes guide that protects trust without accusing anyone.", "Red flag checklist [TO VALIDATE]"]
    ]
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function limitText(text, max, label) {
  if (text.length <= max) return text;
  throw new Error(`${label} too long (${text.length}/${max}): ${text}`);
}

function schemaFor(type) {
  return schemas[type] ?? "Article + BreadcrumbList";
}

function priorityFor(topicIndex, pageType, audienceIndex) {
  if (topicIndex < 5) return 1;
  if (["A", "B", "O", "N"].includes(pageType) && audienceIndex < 3) return 2;
  if (topicIndex < 12) return 3;
  if (["H", "K", "G"].includes(pageType)) return 4;
  return 5;
}

function riskFor(pageType, topicIndex) {
  if (["H", "I", "K"].includes(pageType)) return topicIndex % 3 === 0 ? 3 : 2;
  if (["A", "B", "F"].includes(pageType)) return 2;
  return 1;
}

function titleFor(topicTitle, audience) {
  const suffixes = {
    US: "for US Planners",
    UKIE: "for UK and Irish Planners",
    AUCA: "for AU and Canada",
    UAESG: "for UAE and Singapore",
    EUEN: "for English Europe"
  };
  const title = `${topicTitle} ${suffixes[audience.id]}`;
  if (title.length <= 58) return title;

  const short = topicTitle.replace(" in Italy", "").replace("Italian ", "Italy ");
  const fallback = `${short} ${suffixes[audience.id]}`;
  if (fallback.length <= 58) return fallback;

  return limitText(`${short.replace("Wedding ", "")} ${audience.id}`, 58, "SEO title");
}

function makeRow(vertical, topic, topicIndex, audience, audienceIndex) {
  const [cluster, pageTypeCode, topicTitle, slugCore, primaryKeyword, secondaryCore, problem, uniqueAngle, dataNeeded] = topic;
  const slug = `en/event-guides/${vertical.urlFolder}/${slugify(slugCore)}-${audience.slug}`;
  const campaign = `en_${vertical.key}_${slugify(cluster)}_${audience.slug}`.replace(/-/g, "_");
  const title = limitText(titleFor(topicTitle, audience), 58, "SEO title");
  const h1 = `${topicTitle} ${audience.phrase}`;
  const meta = limitText(
    `Guide for ${audience.label.toLowerCase()} planning in Italy: key checks, supplier questions and risks before paying.`,
    155,
    "Meta description"
  );
  const cta = vertical.ctas[(topicIndex + audienceIndex) % vertical.ctas.length];
  const rowNumber = topicIndex * audiences.length + audienceIndex + 1;

  return {
    "Page ID": `${vertical.idPrefix}-${String(rowNumber).padStart(3, "0")}`,
    Vertical: vertical.vertical,
    Cluster: cluster,
    "Page type": `${pageTypeCode}. ${pageTypes[pageTypeCode]}`,
    "Target country or audience": audience.label,
    "Main search intent": `Learn ${primaryKeyword} when planning ${audience.phrase}, with emphasis on ${audience.concern}.`,
    "Primary keyword": `${primaryKeyword} ${audience.countryKeyword}`,
    "Secondary keywords": `${secondaryCore}; Italy event planning from abroad; Italian supplier questions`,
    "SEO title under 58 characters": title,
    H1: h1,
    "URL slug": slug,
    "Meta description under 155 characters": meta,
    "Unique angle": `${uniqueAngle} Specific lens: ${audience.concern}.`,
    "Target persona": audience.persona,
    "Specific problem solved": problem,
    "Why this page is useful for foreign users": `It translates Italian supplier and venue decisions into plain English for ${audience.label.toLowerCase()}, reducing uncertainty around ${audience.concern}.`,
    "Non-duplicable element": `${cluster} checklist tailored to ${audience.label.toLowerCase()}, including questions that should be answered in writing before payment.`,
    "Data/examples needed": dataNeeded,
    "Suggested internal links": vertical.defaultLinks,
    "Suggested CTA toward Vibes Planner": cta,
    "Suggested UTM campaign": campaign,
    "Suggested schema markup": schemaFor(pageTypeCode),
    "Publishing priority from 1 to 5": priorityFor(topicIndex, pageTypeCode, audienceIndex),
    "Duplication risk from 1 to 5": riskFor(pageTypeCode, topicIndex),
    "Quality notes": "Map only. Full article must include a direct answer in the first 80 words, visible supplier questions, no fake reviews, no fake prices and any numeric range marked [TO VALIDATE]."
  };
}

const rows = [];
for (const vertical of verticals) {
  vertical.topics.forEach((topic, topicIndex) => {
    audiences.forEach((audience, audienceIndex) => {
      rows.push(makeRow(vertical, topic, topicIndex, audience, audienceIndex));
    });
  });
}

const headers = Object.keys(rows[0]);

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function duplicates(key) {
  const seen = new Map();
  const dupes = [];
  for (const row of rows) {
    const value = row[key];
    if (seen.has(value)) dupes.push(value);
    seen.set(value, true);
  }
  return dupes;
}

const validation = {
  generatedAt: new Date().toISOString(),
  totalPages: rows.length,
  byVertical: countBy(rows, "Vertical"),
  byPageType: countBy(rows, "Page type"),
  duplicateH1s: duplicates("H1"),
  duplicateSlugs: duplicates("URL slug"),
  duplicateTitles: duplicates("SEO title under 58 characters"),
  maxTitleLength: Math.max(...rows.map((row) => row["SEO title under 58 characters"].length)),
  maxMetaLength: Math.max(...rows.map((row) => row["Meta description under 155 characters"].length)),
  publishingPriorities: countBy(rows, "Publishing priority from 1 to 5"),
  duplicationRisks: countBy(rows, "Duplication risk from 1 to 5")
};

if (rows.length !== 500) throw new Error(`Expected 500 rows, got ${rows.length}`);
for (const vertical of verticals) {
  const count = rows.filter((row) => row.Vertical === vertical.vertical).length;
  if (count !== 100) throw new Error(`${vertical.vertical} has ${count} rows`);
}
if (validation.duplicateH1s.length || validation.duplicateSlugs.length || validation.duplicateTitles.length) {
  throw new Error(`Duplicates found: ${JSON.stringify(validation, null, 2)}`);
}
if (validation.maxTitleLength > 58) throw new Error(`Title too long: ${validation.maxTitleLength}`);
if (validation.maxMetaLength > 155) throw new Error(`Meta too long: ${validation.maxMetaLength}`);

mkdirSync(outDir, { recursive: true });

const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
writeFileSync(join(outDir, "international-seo-content-map-500-en.csv"), `${csv}\n`, "utf8");
writeFileSync(join(outDir, "international-seo-content-map-500-en.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const report = `# International SEO Content Map Validation

Generated: ${validation.generatedAt}

## Summary

- Total pages: ${validation.totalPages}
- Language: English only
- Verticals: 5
- Pages per vertical: 100
- Duplicate H1s: ${validation.duplicateH1s.length}
- Duplicate slugs: ${validation.duplicateSlugs.length}
- Duplicate SEO titles: ${validation.duplicateTitles.length}
- Max SEO title length: ${validation.maxTitleLength}
- Max meta description length: ${validation.maxMetaLength}

## Pages By Vertical

${Object.entries(validation.byVertical).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Pages By Type

${Object.entries(validation.byPageType).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Publishing Priorities

${Object.entries(validation.publishingPriorities).map(([key, value]) => `- Priority ${key}: ${value}`).join("\n")}

## Duplication Risk

${Object.entries(validation.duplicationRisks).map(([key, value]) => `- Risk ${key}: ${value}`).join("\n")}

## Editorial Rule

This is an internal content map only. Do not publish these rows as pages without writing full, human-reviewed articles. Full pages must validate approximate prices, avoid fake suppliers or fake reviews and include visible value before any Vibes Planner CTA.
`;

writeFileSync(join(outDir, "validation-report.md"), report, "utf8");

console.log(`Generated ${rows.length} rows in ${outDir}`);
