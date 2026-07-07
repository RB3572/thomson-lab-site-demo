import PageShell from '@/components/PageShell'
import { TopicSections, type TopicBlock } from '@/components/TopicSections'

const BLOCKS: TopicBlock[] = [
  {
    heading: 'Inspired by Biology',
    img: '/research/machine-learning.png',
    paras: [
      'Living neural networks in the brain perform an array of computational and information processing tasks including sensory input processing, storing and retrieving memory, decision making, and, more globally, generate the general phenomena of “intelligence”. In addition to their remarkable information processing feats, brains are unique because they are computational devices that actually self-organize their intelligence. In fact, during development, the entire brain ultimately grows from just a few single cells!',
      'Artificial neural networks have already demonstrated human-like performance, but fall short of the biological equivalent in several key ways. Neural networks are:',
    ],
    list: [
      'Built by hand, requiring significant engineering investments',
      'Highly memory/power inefficient',
      'Not equipped for real-time learning',
      'Susceptible to catastrophic forgetting',
    ],
  },
  {
    heading: 'Growing Artificial Neural Networks',
    img: '/research/networkbending.png',
    paras: [
      'Our research pursues biologically inspired solutions to these problems by developing artificial neural networks that self-organize themselves, growing from single computational cells, just like the brain.',
      'We developed a developmental algorithm that exploits spontaneous activity waves to grow and self-organize a convolutional neural network architecture (CNN). The algorithm is adaptable to different input geometries, tolerant of malfunctioning units, and can develop a range of pooling architectures — suggesting a broadly applicable strategy for the self-organization of intelligent systems.',
    ],
  },
]

export default function MachineLearning() {
  return (
    <PageShell solid title="Machine Learning">
      <TopicSections blocks={BLOCKS} />
    </PageShell>
  )
}
