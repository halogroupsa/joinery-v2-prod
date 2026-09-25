/** Alt text for every project photograph, keyed by `folder/base`.
 *
 * Written from what each photograph actually shows — file names are legacy
 * production labels and often misleading (e.g. `bed-headboards-1` is a TV
 * wall). Keep each description specific to its photo; don't append a shared
 * brand suffix, which reads as keyword stuffing across ~120 images. */
const IMAGE_ALTS: Record<string, string> = {
  // Wardrobes
  "wardrobes/services-joinery-wardrobes-builtin-wardrobes": "Built-in wardrobes with LED-lit open shelving and handleless cream doors",
  "wardrobes/services-joinery-wardrobes-hindged-wardrobes": "Floor-to-ceiling hinged wardrobe doors in grey with long bar handles",
  "wardrobes/services-joinery-wardrobes-internal-fittings": "Walnut wardrobe interior with glass doors and LED-lit shelving",
  "wardrobes/services-joinery-wardrobes-premium-finishes": "Cream lacquer wardrobe doors with bronze half-moon handles and inset lighting",
  "wardrobes/services-joinery-wardrobes-sliding-wardrobes": "Black-framed glass-fronted wardrobes lining a bright dressing room",
  "wardrobes/services-joinery-wardrobes-walkin-wardrobes": "Walk-in wardrobe with lit glass cabinets and a central oak island",
  "wardrobes/wardrobes-08": "Walk-in dressing room with white island, smoked-glass cabinets and cove lighting",
  "wardrobes/wardrobes-09": "Oak wardrobe with smoked-glass doors and vertical LED strips",
  "wardrobes/wardrobes-10": "Walnut walk-in closet with smoked-glass doors, white island and linear pendants",
  "wardrobes/wardrobes-11": "Dark wood dressing room with lit glass doors and backlit open shelves",
  "wardrobes/wardrobes-12": "Dark oak walk-in wardrobe with open shelving, drawers and a pendant light",
  "wardrobes/wardrobes-13": "Cream walk-in dressing room with glass display cabinet, chandelier and ottoman",
  "wardrobes/wardrobes-14": "Long walk-in wardrobe corridor with slim black-framed glass doors",
  "wardrobes/wardrobes-15": "Dressing room with glass-topped jewellery island and marble accents",
  "wardrobes/wardrobes-16": "Grey handleless wardrobe with a bronze-framed glass door beside a tall window",
  "wardrobes/wardrobes-17": "Reeded-glass wardrobes leading to a vanity with round mirror",
  "wardrobes/wardrobes-18": "Textured grey wardrobes with round handles and lit glass display units",
  "wardrobes/wardrobes-19": "Taupe handleless built-in wardrobes lining a bedroom passage",
  "wardrobes/wardrobes-20": "Walk-in closet with oak shelving and a granite-topped display island",
  "wardrobes/wardrobes-21": "White built-in wardrobes with leather pulls and a lit vanity niche",
  "wardrobes/wardrobes-22": "Blush pink wardrobe with arched moulded panel doors and brass knobs",
  "wardrobes/wardrobes-23": "Oak wardrobe doors with woven rattan cane panels",
  "wardrobes/wardrobes-24": "Reeded glass wardrobe doors beside handleless grey panels",
  "wardrobes/wardrobes-25": "Cream shaker-style wardrobe wall with long handles and plinth lighting",
  "wardrobes/wardrobes-26": "Bedroom wardrobe and dressing table with round mirror and armchair",
  "wardrobes/wardrobes-27": "Walnut walk-in wardrobe with bronze glass doors and upholstered bench",
  "wardrobes/wardrobes-28": "Smoked-glass wardrobe corridor with herringbone oak flooring",
  "wardrobes/wardrobes-29": "Glass-fronted walk-in wardrobe with lit shelves and white island",
  "wardrobes/wardrobes-30": "Oak walk-in wardrobe with lit glass doors and central drawer island",
  "wardrobes/wardrobes-31": "Handleless white wardrobes leading to garden doors in a Dubai villa",
  "wardrobes/wardrobes-32": "Dressing room with smoked-glass cabinets and glass-topped island",
  "wardrobes/wardrobes-33": "White wardrobe with bronze-framed glass doors and dressing table",
  "wardrobes/wardrobes-34": "White glass-fronted wardrobe and drawer unit in a master suite",
  "wardrobes/wardrobes-35": "Arched walk-in wardrobe with glass watch display island and lantern pendant",

  // Kitchens
  "kitchens/kitchen-01": "Stainless steel kitchen with built-in ovens and cove lighting",
  "kitchens/kitchen-02": "Marble-look kitchen island with ceiling-hung extractor and walnut shelving",
  "kitchens/kitchen-03": "Open-plan kitchen with marble splashback, walnut cabinets and dining table",
  "kitchens/kitchen-04": "White marble waterfall island in an open-plan villa kitchen",
  "kitchens/kitchen-05": "Marble waterfall island with timber breakfast bar and pendant lights",
  "kitchens/kitchen-06": "Galley kitchen with marble island and black tall cabinets",
  "kitchens/kitchen-07": "Grey handleless kitchen island with garden views",
  "kitchens/kitchen-08": "Black kitchen with veined black marble island and green bar stools",
  "kitchens/kitchen-09": "Grey marble kitchen island with ceiling extractor and lit open shelving",
  "kitchens/kitchen-10": "Marble breakfast bar with upholstered grey bar stools",
  "kitchens/kitchen-11": "Curved cream kitchen island with walnut tall cabinets and arched niche",
  "kitchens/kitchen-12": "Black kitchen with marble island, glass pendants and herringbone floor",
  "kitchens/kitchen-13": "Taupe and white L-shaped kitchen with marble splashback and reeded island",
  "kitchens/kitchen-14": "White quartz kitchen island beside a reeded glass cabinet",
  "kitchens/kitchen-15": "Marble kitchen island with black-framed bar stools and taupe tall cabinets",
  "kitchens/kitchen-16": "Grey handleless kitchen with long island, globe pendants and bar stools",
  "kitchens/kitchen-17": "Brushed steel kitchen tap on a marble countertop",
  "kitchens/kitchen-18": "Dark green kitchen with window splashback and black sink",
  "kitchens/kitchen-19": "Taupe U-shaped kitchen with skylight and lit marble splashback",
  "kitchens/kitchen-20": "White kitchen island seating six, with lit display shelving",
  "kitchens/kitchen-21": "White shaker kitchen with navy island, brass tap and walnut pantry",
  "kitchens/kitchen-22": "White kitchen with quartz island and rattan pendant lights",
  "kitchens/kitchen-23": "White handleless kitchen with marble island and cove ceiling",
  "kitchens/kitchen-24": "Black glass kitchen overlooking the Dubai skyline",
  "kitchens/kitchen-25": "Light oak kitchen with built-in appliance wall and sheer curtains",

  // Doors
  "doors/door-01": "Black pivot entrance door with vertical timber slats",
  "doors/door-02": "Black pivot entrance door with diagonal grooves and glass sidelights",
  "doors/door-03": "Carved walnut pivot door with geometric relief pattern",
  "doors/door-04": "White panelled double doors in a glazed entrance hall",
  "doors/door-05": "Light oak double entrance door with round bronze pull",
  "doors/door-06": "Arched textured entrance door with brass pull handle",
  "doors/door-07": "Grey flush pivot door open onto a stone entrance",
  "doors/door-08": "Pivot entrance door with patterned tile inlay and smart lock",
  "doors/door-09": "Arched walnut door with diagonal boards set in travertine",
  "doors/door-10": "Arched dark timber herringbone door within a glazed arch",

  // Wall panels
  "wall_panels/classic-molding": "Walnut wall panelling with brass inlay behind an upholstered bed",
  "wall_panels/fabric-panels": "Walnut slatted wall with inset upholstered fabric panels",
  "wall_panels/fluted-wood-panels": "Fluted oak wall panelling behind a living room sofa",
  "wall_panels/geometric-designs-wood-panels": "Geometric walnut wall panelling with lit plinth behind a velvet sofa",
  "wall_panels/pu-painted-wall-panels": "Charcoal PU-painted wall panels in a grid pattern",
  "wall_panels/veneer-panels-1": "Wood veneer and timber brick wall behind a navy upholstered bed",

  // Wood ceilings
  "wood_ceilings/accoustic-wood-ceilings": "Slatted acoustic timber ceiling over a living room with garden views",
  "wood_ceilings/coffered-ceiling": "Dark timber coffered ceiling over a dining room with arched windows",
  "wood_ceilings/curved-ceiling": "Curved slatted timber ceiling opening onto a pool terrace",
  "wood_ceilings/floating-wood-panels": "Layered floating ceiling panels with cove lighting over a living room",
  "wood_ceilings/grooved-timber-ceilings": "Grooved timber ceiling and slatted walls in a home office",
  "wood_ceilings/integrated-light-wood-ceiling": "Oak ceiling with integrated linear lights over an open-plan kitchen",
  "wood_ceilings/veneer-panels": "Wood veneer ceiling with linear light over a dining area",
  "wood_ceilings/wood-ceilings-5": "Grey slatted ceiling with linear lighting in a glazed living room",

  // TV units
  "tv_units/bed-headboards-1": "Walnut-panelled bedroom wall with wall-mounted TV and floating shelf",
  "tv_units/concealed-wiring": "Wall-mounted TV above an oak media console with concealed wiring",
  "tv_units/floating-tv-unit": "Floating walnut TV unit beneath a wall-mounted TV",
  "tv_units/marmorino-villa-media-room": "Villa media room with Marmorino plaster wall and integrated TV",
  "tv_units/services-joinery-tv-units-integrated-shelving": "Oak TV wall with integrated shelving and lit niches",
  "tv_units/services-joinery-tv-units-vaneer-cladding": "Wood veneer clad TV wall with low media unit",
  "tv_units/tv-unit-led-backlight": "Stone-clad TV wall with backlit floating shelves and glass cabinets",

  // Feature walls
  "feature_walls/backlit-stone-feature-wall": "Backlit onyx feature wall beside a walnut fireplace wall",
  "feature_walls/bookmatched-walnut-veneer-wall": "Bookmatched walnut veneer feature wall in a living room",
  "feature_walls/fluted-wood-panel-wall": "Fluted walnut panel wall in a light-filled living room",
  "feature_walls/geometric-sculpted-wood-wall": "Sculpted geometric walnut feature wall behind a sofa",
  "feature_walls/integrated-wardrobe-feature-wall": "Bedroom feature wall with integrated lit wardrobe and fluted panels",
  "feature_walls/mixed-material-travertine-wall": "Double-height travertine and timber feature wall with backlit panels",
  "feature_walls/outdoor-pool-water-feature-wall": "Stone and timber water feature wall beside an infinity pool",
  "feature_walls/slatted-timber-acoustic-wall": "Slatted timber acoustic wall along a corridor",
  "feature_walls/terrazzo-stone-feature-wall": "Terrazzo bathroom feature wall with round mirror and timber vanity",

  // Reception desks
  "reception_desks/backlit-reception-desk": "Terrazzo reception desk with backlit base in a hotel lobby",
  "reception_desks/curved-reception-desk": "Curved reception desk with linear light bands in a modern office",
  "reception_desks/medical-reception-desk": "White marble clinic reception counter with staff workstations",
  "reception_desks/reception-counter": "Curved backlit reception desk against a pixel-tile feature wall",
  "reception_desks/reception-desk-4": "Marble and brass hotel reception desks with lit display shelving",
  "reception_desks/store-counters": "Marble retail counters with checkout stations",

  // Bar counters & vanities
  "bar_counters_vanities/bar-counters": "Home bar counter with wine display shelving and teal bar stools",
  "bar_counters_vanities/commercial-bar-counters": "Commercial bar counter with backlit marble front and bar stools",
  "bar_counters_vanities/custom-counter-tops": "Dark marble countertop with copper sink and Moroccan tile splashback",
  "bar_counters_vanities/powder-room-vanities": "Powder room vanity with twin travertine basins and organic mirrors",
  "bar_counters_vanities/residential-vanities-waterproof-finishes": "Floating bathroom vanity with stone basin, arched mirror and lit niches",
  "bar_counters_vanities/wet-bar-units": "Stainless steel wet bar with glass rack and wine storage",

  // Office furniture
  "office_furniture/conference-tables": "Boardroom with oval conference table and city views",
  "office_furniture/executive-desks": "Dark wood executive desk with wall storage and marble backdrop",
  "office_furniture/executive-workspace": "Executive desk and chairs facing a floor-to-ceiling window",
  "office_furniture/filling-cabinets": "Walnut filing cabinets and bookshelves behind a marble-topped desk",
  "office_furniture/reception-counter": "Curved backlit reception desk against a pixel-tile feature wall",
  "office_furniture/storage-walls": "Walnut storage wall with brass inlay behind a home office desk",

  // Residential furniture
  "residential_furniture/bed-headboards": "Channel-tufted upholstered headboard in a blush bedroom",
  "residential_furniture/coffee-table": "Round timber coffee table in a bright living room",
  "residential_furniture/consoles": "Fluted walnut console table beneath an arched mirror",
  "residential_furniture/dining-tables": "Long dining table under a crystal chandelier with city views",
  "residential_furniture/services-joinery-residential-furniture-sideboards-and-credenzas": "Slatted timber sideboard with stone top in a dining room",
  "residential_furniture/shelving": "Open walnut shelving unit used as a room divider",
};

/** Alt text for a project photograph, or `fallback` if none is written yet. */
export function imageAlt(folder: string, base: string, fallback: string): string {
  return IMAGE_ALTS[`${folder}/${base}`] ?? fallback;
}
