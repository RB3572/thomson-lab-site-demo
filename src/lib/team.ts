export interface Member {
  name: string
  role: string
  focus?: string
  areas?: string[]
  photo?: string // /team/*.jpg — omit to render an initials avatar
}

export interface TeamSection {
  id: string
  title: string
  /** rgba(...,0.8) — the glass-card accent; must contain "0.8" for the border gradient. */
  color: string
  members: Member[]
}

export const team: TeamSection[] = [
  {
    id: 'pi',
    title: 'Principal Investigator',
    color: 'rgba(247, 204, 52, 0.8)',
    members: [
      {
        name: 'Matt Thomson',
        role: 'Professor of Computational Biology · Caltech Investigator, Heritage Medical Research Institute',
        focus:
          'Quantitative experimental and modeling approaches to gain programmatic control over cell differentiation and function.',
        photo: '/team/matt-thomson.jpg',
      },
    ],
  },
  {
    id: 'postdocs',
    title: 'Postdocs',
    color: 'rgba(56, 189, 248, 0.8)',
    members: [
      {
        name: 'Arjuna Subramanian',
        role: 'Postdoctoral Scholar',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
        focus:
          'Using AI protein-folding models to study cellular system evolution and protein design.',
        photo: '/team/arjuna-subramanian.jpg',
      },
      {
        name: 'Fan Yang',
        role: 'Postdoctoral Scholar',
        areas: ['Active Matter', 'Machine Learning'],
        focus:
          'Engineering protein machines for microfluidics automation via dynamic reprogramming.',
        photo: '/team/fan-yang.jpg',
      },
    ],
  },
  {
    id: 'phd',
    title: 'PhD Students',
    color: 'rgba(167, 139, 250, 0.8)',
    members: [
      {
        name: 'Joe Boktor',
        role: 'PhD Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus:
          'Exploring microbial solutions for applications including immune-modulation and bioremediation.',
        photo: '/team/joe-boktor.jpg',
      },
      {
        name: 'Lydia Chen',
        role: 'PhD Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus:
          'Using LLMs for single-cell genomics analysis and understanding gene programs in cell morphology.',
        photo: '/team/lydia-chen.jpg',
      },
      {
        name: 'Alexander Detkov',
        role: 'PhD Student',
        areas: ['Machine Learning'],
        focus:
          'Studying intelligence through dynamical systems and predictive coding frameworks.',
        photo: '/team/alexander-detkov.jpg',
      },
      {
        name: 'Kevin Fleisher',
        role: 'PhD Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus:
          'Constructing predictive gene expression models using machine learning approaches.',
        photo: '/team/kevin-fleisher.jpg',
      },
      {
        name: 'James Gornet',
        role: 'PhD Student',
        areas: ['Machine Learning'],
        focus:
          'Understanding human intelligence and reasoning through navigation frameworks.',
        photo: '/team/james-gornet.jpg',
      },
      {
        name: 'Surya Narayanan Hari',
        role: 'PhD Student',
        areas: ['Machine Learning'],
        focus: 'Bringing biological structures to machine learning research.',
        photo: '/team/surya-hari.jpg',
      },
      {
        name: 'David Larios',
        role: 'PhD Student',
        areas: ['Active Matter'],
        photo: '/team/david-larios.jpg',
      },
      {
        name: 'Shichen Liu',
        role: 'PhD Student',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
        focus:
          'Decoding non-equilibrium mechanisms in active matter for programmable bio-materials.',
        photo: '/team/shichen-liu.jpg',
      },
      {
        name: 'Yunrui Lu',
        role: 'PhD Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus:
          'Using transcriptomics to explore tumor heterogeneity and immune microenvironments.',
        photo: '/team/yunrui-lu.jpg',
      },
      {
        name: 'Zachary Martinez',
        role: 'PhD Student',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
        focus: 'Building tools for protein engineering and synthetic cell design.',
        photo: '/team/zachary-martinez.jpg',
      },
      {
        name: 'Jiapei Miao',
        role: 'PhD Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus:
          'Integrating protein language models with molecular dynamics simulations.',
        photo: '/team/jiapei-miao.jpg',
      },
      {
        name: 'Meera Prasad',
        role: 'PhD Student',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
        focus:
          'Developing frameworks to control tissue behavior in multicellular systems.',
        photo: '/team/meera-prasad.jpg',
      },
      {
        name: 'Hunter Richards',
        role: 'PhD Student · MD in progress, Kaiser Permanente School of Medicine',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
      },
      {
        name: 'Hao (Harry) Wang',
        role: 'PhD Student',
        areas: ['Active Matter', 'Single-Cell'],
        focus:
          "Developing active matter tools with microfluidics for studying life's asymmetry.",
        photo: '/team/hao-wang.jpg',
      },
      {
        name: 'Meng Wang',
        role: 'PhD Student',
        areas: ['Machine Learning'],
        focus:
          'Studying learning behavior through reinforcement learning and neuroscience.',
      },
      {
        name: 'Fengqing (Grace) Yu',
        role: 'PhD Student',
        areas: ['Active Matter', 'Single-Cell', 'Machine Learning'],
        focus: 'Developing computational models for T-cell activation processes.',
        photo: '/team/fengqing-yu.jpg',
      },
      {
        name: 'Timothy Zhang',
        role: 'PhD Student',
        areas: ['Machine Learning'],
        focus:
          "Understanding machine learning's world-building through prediction and decision-making.",
        photo: '/team/timothy-zhang.jpg',
      },
      {
        name: 'Binglun Shao',
        role: 'PhD Student',
      },
      {
        name: 'Jiayi Yin',
        role: 'PhD Student',
      },
    ],
  },
  {
    id: 'undergrad',
    title: 'Undergraduate Students',
    color: 'rgba(52, 211, 153, 0.8)',
    members: [
      {
        name: 'Rishi Bhargava',
        role: 'Undergraduate Student',
        areas: ['Active Matter', 'Single-Cell'],
        focus:
          'Using active matter tools to build new platforms to study cardiovascular disease.',
        photo: '/team/rishi-bhargava.jpg',
      },
      {
        name: 'Rex Liu',
        role: 'Undergraduate Student',
        areas: ['Single-Cell', 'Machine Learning'],
        focus: 'Building bio-inspired algorithms for drug discovery applications.',
        photo: '/team/rex-liu.jpg',
      },
    ],
  },
  {
    id: 'staff',
    title: 'Research Staff',
    color: 'rgba(244, 114, 182, 0.8)',
    members: [
      {
        name: 'Brian Williams',
        role: 'Staff Scientist',
        areas: ['Single-Cell'],
      },
      {
        name: 'Yu-Jen Chen',
        role: 'Research Technician',
        areas: ['Single-Cell'],
        focus:
          'Engineering immune cells to address inflammation and aging.',
        photo: '/team/yu-jen-chen.jpg',
      },
    ],
  },
]
