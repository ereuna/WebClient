/**
 * Real geothermal systems in the East African Rift System.
 * Note: Field profiles are built from published sources only, not operator data.
 * All statuses: "Coming soon" per status vocabulary.
 */

export const FIELDS = [
  {
    id: 'olkaria',
    slug: 'olkaria',
    name: 'Olkaria',
    region: 'Naivasha, Kenya Rift Valley',
    setting: "0° 53' S, 36° 18' E · Central Kenya Rift",
    geology: 'High-temperature volcanic complex associated with Quaternary caldera collapse and north-south trending normal faults. Host lithologies comprise fractured peralkaline rhyolite and trachyte suites, with heat flow governed by shallow crustal magma chambers.',
    status: 'Coming soon',
    publishedSources: 'Geological Survey records, UNU-GTP published technical publications, and peer-reviewed geothermal literature.',
    wellsNote: 'Borehole trajectories and thermal gradient curves compiled strictly from public academic publications.',
    studies: ['Temperature prediction for Kenyan wells (in progress)'],
  },
  {
    id: 'menengai',
    slug: 'menengai',
    name: 'Menengai',
    region: 'Nakuru, Central Kenya Rift',
    setting: "0° 12' S, 36° 04' E · Central Kenya Rift",
    geology: 'Large Quaternary caldera volcano in the central rift segment. Characterized by post-caldera trachyte lavas, active fumarolic fields, and high geothermal gradients controlled by intra-rift extensional fault swarms.',
    status: 'Coming soon',
    publishedSources: 'Published academic studies on East African Rift caldera volcanism and open geological survey memoirs.',
    wellsNote: 'Exploration wells and lithological columns derived from published conference proceedings and open-source geological literature.',
    studies: ['Rift caldera thermal modeling (planned)'],
  },
  {
    id: 'eburru',
    slug: 'eburru',
    name: 'Eburru',
    region: 'North of Lake Naivasha, Kenya Rift Valley',
    setting: "0° 38' S, 36° 14' E · Kenya Rift Valley",
    geology: 'Active volcanic complex north of Olkaria, featuring rhyolitic and pantelleritic domes, young fault scarps, and steam condensates indicating a vapor-dominated thermal zone at shallow to intermediate depths.',
    status: 'Coming soon',
    publishedSources: 'Peer-reviewed scientific journals on Rift thermal anomalies and public reconnaissance papers.',
    wellsNote: 'Subsurface temperature logs referenced from published UNU-GTP research papers.',
    studies: ['Vapor-dominated reservoir simulation (planned)'],
  },
  {
    id: 'paka',
    slug: 'paka',
    name: 'Paka',
    region: 'Baringo County, Northern Kenya Rift',
    setting: "0° 55' N, 36° 11' E · Baringo-Silali Prospect",
    geology: 'Shield volcano in the northern Kenya Rift sector with a summit caldera and basaltic-trachytic volcanism. Surface thermal manifestations include boiling springs and steaming ground along major rift-parallel fault lines.',
    status: 'Coming soon',
    publishedSources: 'Public regional reconnaissance and academic publications on northern rift prospective zones.',
    wellsNote: 'Preliminary thermal gradient data from open exploratory survey publications.',
    studies: ['Northern rift prospect characterization (planned)'],
  },
  {
    id: 'silali',
    slug: 'silali',
    name: 'Silali',
    region: 'Baringo County, Northern Kenya Rift',
    setting: "1° 09' N, 36° 14' E · Baringo-Silali Prospect",
    geology: 'Large caldera volcano in the northern sector of the Kenya Rift, featuring a 7.5 km wide caldera, pervasive fault swarms, and extensive hydrothermal alteration across its volcanic edifice.',
    status: 'Coming soon',
    publishedSources: 'Published geological exploration memoirs and public academic research reports.',
    wellsNote: 'Borehole lithology models compiled from open scientific survey publications.',
    studies: ['Regional fault-controlled heat sweep (planned)'],
  },
]

export function getFieldBySlug(slug) {
  return FIELDS.find(f => f.slug === slug || f.id === slug) || null
}
