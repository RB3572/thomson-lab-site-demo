import PageShell from '@/components/PageShell'
import { TopicSections, type TopicBlock } from '@/components/TopicSections'

const BLOCKS: TopicBlock[] = [
  {
    heading: 'Tiny Machines',
    img: '/research/nanoscale-force.png',
    paras: [
      'Eukaryotic (animal) cells are fundamentally microscopic devices that integrate information processing and physical actuation to carry out tasks including movement, navigation, self-replication, and self-organization.',
      'In morphogenesis – shaping of the organism – cellular forces are generated at the molecular scale by nanometer sized motor proteins that walk along cytoskeletal filaments. These tiny motors effect changes that are magnitudes of scale larger themselves.',
      'We are only at the beginning of understanding how complex “active matter” networks amplify and organize the forces that underlie cell division, motility, and the bending and folding of tissues in development. If human technology could match the physical capabilities of a cell, we might be able to build a new generation of active devices that can move, self-replicate, and organize the mesoscale world.',
    ],
  },
  {
    heading: 'Programming Active Matter',
    img: '/research/active-matter.png',
    paras: [
      'Our fundamental goal is to develop and test models that predict emergent mechanical behaviors of cytoskeletal networks from the biophysical properties of individual proteins.',
      'In recent work, we have recapitulated several core behaviors of the microtubule cytoskeleton including contraction, motion, and division in an optically controlled system containing just two purified proteins, microtubule filaments, and an engineered form of the kinesin motor protein – all suspended in solution.',
      'We have developed new experimental tools to control the behavior of motor and filament proteins in time and space. Through these methods we observe active protein forces in network contraction, network shape preservation, and the modulation of ambient fluid flows.',
      'Additionally, we have developed theoretical models and simulations to better understand how interactions between motor, filaments, and fluid determine structure and forces within active microtubule networks.',
    ],
  },
  {
    heading: 'Persistent Fluid Flows',
    img: '/research/deformation.png',
    paras: [
      'Biological systems achieve precise control over ambient fluids through the self-organization of active protein structures including flagella, cilia, and cytoskeletal networks. In such active structures individual proteins consume chemical energy to generate force and motion at molecular length scales. Self-organization of protein components enables the control and modulation of fluid flow fields on micron scales. The physical principles underlying the organization and control of active-matter-driven fluid flows are poorly understood.',
      'We are applying our optically controlled active matter platform to manipulate fluid flows on micron-length scales with light. We are developing theoretical models to construct light patterns that we can apply to achieve flow fields of interest for tasks like transport, mixing, and sorting of micron-sized particles. We are also exploring fundamental questions about what kinds of flow fields can be constructed given the fundamental dynamics of active-matter fluid interactions.',
    ],
  },
]

export default function ActiveMatter() {
  return (
    <PageShell solid title="Active Matter">
      <TopicSections blocks={BLOCKS} />
    </PageShell>
  )
}
