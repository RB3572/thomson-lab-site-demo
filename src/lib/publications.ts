export interface Publication {
  title: string
  authors: string
  venue: string
  link?: string
  img?: string
}

export interface PubYear {
  year: string
  items: Publication[]
}

export const publications: PubYear[] = [
  {
    year: "2026",
    items: [
      {
        title: "D-SPIN constructs regulatory network models from scRNA-seq that reveal organizing principles of perturbation response",
        authors: "Jialong",
        venue: "Cell",
        link: "https://www.cell.com/action/showPdf?pii=S0092-8674%2826%2900463-0",
        img: "/pub/2026-D-SPIN.jpg",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "Identifying perturbations that boost T-cell infiltration into tumours via counterfactual learning of their spatial proteomic profiles",
        authors: "",
        venue: "Nature Biomedical Engineering volume 9 , pages 390–404",
        link: "https://www.nature.com/articles/s41551-025-01357-0.pdf",
        img: "/pub/website.jpg",
      },
      {
        title: "Active Healing of Microtubule-Motor Networks",
        authors: "Fan Yang, Shichen Liu, Heun Jin Lee, Rob Phillips, Matt Thomson",
        venue: "Nature Materials (in review)",
        link: "https://arxiv.org/abs/2407.00842",
        img: "/pub/2024-Active-healing-thumb.jpg",
      },
      {
        title: "Dynamic flow control through active matter programming language",
        authors: "Fan Yang, Shichen Liu, Heun Jin Lee, Rob Phillips, Matt Thomson",
        venue: "Nature Materials volume 24 , pages 615–625",
        link: "https://www.nature.com/articles/s41563-024-02090-w.pdf",
        img: "/pub/2023_Yang.jpg",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "Automated construction of cognitive maps with predictive coding",
        authors: "James A.",
        venue: "Nature Machine Intelligence",
        link: "https://www.nature.com/articles/s42256-024-00863-1.pdf",
        img: "/pub/Gornet-2023.jpg",
      },
      {
        title: "Engineering flexible machine learning systems by traversing functionally invariant paths in weight space",
        authors: "Guruprasad Raghavan and Matt Thomson",
        venue: "Nature Machine Intelligence",
        link: "https://doi.org/10.1038/s42256-024-00902-x",
        img: "/pub/2022-Rhagavan.jpg",
      },
      {
        title: "Theoretical Limits of Energy Extraction in Active Fluids",
        authors: "Shahriar Shadkhoo, Matt Thomson",
        venue: "Physical Review Research",
        link: "https://arxiv.org/pdf/2307.00489",
        img: "/pub/2023_Shai.jpg",
      },
      {
        title: "Force Propagation in Active Cytoskeletal Networks",
        authors: "Shichen Liu, Rosalind Wenshan Pan, Heun Jin Lee, Shahriar Shadkhoo, Fan Yang, Chunhe Li, Zijie Qu, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2401.04217.pdf",
        img: "/pub/2024-liu.jpg",
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "TRILL: Orchestrating Modular Deep-Learning Workflows for Democratized, Scalable Protein Analysis and Engineering",
        authors: "Zachary A",
        venue: "bioRxiv preprint",
        link: "https://www.biorxiv.org/content/10.1101/2023.10.24.563881v2.full.pdf",
        img: "/pub/Screenshot-2024-01-03-at-12.16.55-PM.jpg",
      },
      {
        title: "Unexplored regions of the protein sequence-structure map revealed at scale by a library of foldtuned language models",
        authors: "Arjuna M.",
        venue: "bioRxiv preprint",
        link: "https://www.biorxiv.org/content/10.1101/2023.12.22.573145v1.full.pdf",
        img: "/pub/Screenshot-2024-01-03-at-12.10.57-PM.jpg",
      },
      {
        title: "What's the Magic Word? A Control Theory of LLM Prompting",
        authors: "Aman Bhargava, Cameron Witkowski, Manav Shah, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2310.04444.pdf",
        img: "/pub/Screenshot-2024-01-05-at-11.47.53-AM.jpg",
      },
      {
        title: "Herd: Using multiple, smaller LLMs to match the performances of proprietary, large LLMs via an intelligent composer",
        authors: "",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2310.19902.pdf",
        img: "/pub/Screenshot-2024-01-05-at-6.02.30-PM.jpg",
      },
      {
        title: "Tryage: Real-time, intelligent routing of user prompts to large language models",
        authors: "",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2308.11601.pdf",
        img: "/pub/Screenshot-2023-11-16-at-3.16.21-PM.jpg",
      },
      {
        title: "Unraveling cell differentiation mechanisms through topological exploration of single-cell developmental trajectories",
        authors: "Emanuel",
        venue: "bioRxiv preprint",
        link: "https://www.biorxiv.org/content/10.1101/2023.07.28.551057v1.full.pdf",
        img: "/pub/Screenshot-2023-08-22-at-12.05.30-PM.jpg",
      },
      {
        title: "D-SPIN constructs gene regulatory network models from multiplexed scRNA-seq data revealing organizing principles of cellular perturbation response",
        authors: "Jialong",
        venue: "bioRxiv preprint",
        link: "https://www.dropbox.com/s/yi2usi6x35hy8ez/2023.04.19.537364v1.full.pdf?dl=0",
        img: "/pub/D-SPIN-web.jpg",
      },
      {
        title: "Connectedness of loss landscapes via the lens of Morse theory",
        authors: "",
        venue: "Proceedings of the 1st NeurIPS Workshop on Symmetry and Geometry in Neural Representations",
        link: "https://proceedings.mlr.press/v197/akhtiamov23a.html",
        img: "/pub/akhtiamov23a.jpg",
      },
      {
        title: "Motor processivity and speed determine structure and dynamics of microtubule-motor assemblies",
        authors: "",
        venue: "eLife 12:e79402",
        link: "http://rpdata.caltech.edu/publications/banks2023.pdf",
        img: "/pub/2023-elife.jpg",
      },
      {
        title: "Spin glasses, error correcting codes, and synchronization of human stem cell organoids",
        authors: "",
        venue: "Cell (Preview Article)",
        link: "https://doi.org/10.1016/j.cell.2023.01.006",
        img: "/pub/spin-glass.jpg",
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        title: "Stem cell-derived synthetic embryos self-assemble by exploiting cadherin codes and cortical tension",
        authors: "",
        venue: "Nature Cell Biology",
        link: "https://www.nature.com/articles/s41556-022-00984-y",
        img: "/pub/2022-synth-embryo.jpg",
      },
      {
        title: "CloudPred: Predicting Patient Phenotypes From Single-cell RNA-seq",
        authors: "Bryan He, Matthew Thomson, Meena Subramaniam, Richard Perez, Chun Jimmie Ye & James Zou",
        venue: "Pacific Symposium on Biocomputing",
        link: "https://www.worldscientific.com/doi/pdf/10.1142/9789811250477_0031",
        img: "/pub/Cloudpred.jpg",
      },
      {
        title: "Generating counterfactual explanations of tumor spatial proteomes to discover effective, combinatorial therapies that enhance cancer immunotherapy",
        authors: "Zitong Jerry Wang and Matt Thomson",
        venue: "NeurIPS AI for Science",
        link: "https://openreview.net/forum?id=cGPS8aOHTI7",
        img: "/pub/2022-tumor.jpg",
      },
      {
        title: "Neural networks learn an environment's geometry in latent space by performing predictive coding on visual scenes",
        authors: "James Gornet and Matt Thomson",
        venue: "NeurIPS Information-theoretic Principles in Cognitive Science",
        link: "https://openreview.net/forum?id=6Cjab6icW_8",
        img: "/pub/2022-Gornet1.jpg",
      },
      {
        title: "Control of spatio-temporal patterning via cell density in a multicellular synthetic gene circuit",
        authors: "Marco Santorelli, Pranav S. Bhamidipati, Dominik Schildknecht, Andriu Kavanagh, Victoria A. MacKrell, Trusha Sondkar, Matt Thomson & Leonardo Morsut",
        venue: "bioRxiv",
        link: "https://doi.org/10.1101/2022.10.04.510900",
        img: "/pub/2022-santorelli3.jpg",
      },
      {
        title: "Mapping hormone-regulated cell-cell interaction networks in the human breast at single-cell resolution",
        authors: "Lyndsay M. Murrow, Robert J. Weber, Joseph A. Caruso, Christopher S. McGinnis, Kiet Phong, Philippe Gascard, Gabrielle Rabadam, Alexander D. Borowsky, Tejal A. Desai, Matthew Thomson, Thea Tlsty, Zev J. Gartner",
        venue: "Cell Systems",
        link: "https://www.sciencedirect.com/science/article/pii/S2405471222002757",
        img: "/pub/2022-murrow1.jpg",
      },
      {
        title: "Localization of signaling receptors maximizes cellular information acquisition in spatially structured natural environments",
        authors: "Zitong Jerry Wang and Matt Thomson",
        venue: "Cell Systems",
        link: "https://www.sciencedirect.com/science/article/pii/S2405471222002253",
        img: "/pub/2022-Zitong.jpg",
      },
      {
        title: "Minimal gene set discovery in single-cell mRNA-seq datasets with ActiveSVM",
        authors: "Xiaoqiao Chen, Sisi Chen & Matt Thomson",
        venue: "Nature Computational Science",
        link: "https://www.nature.com/articles/s43588-022-00263-8",
        img: "/pub/2022-XQCHEN3.jpg",
      },
      {
        title: "Reinforcement learning reveals fundamental limits on the mixing of active particles",
        authors: "Dominik Schildknecht, Anastasia N Popova, Jack Stellwagen & Matthew Thomson",
        venue: "Soft Matter",
        link: "https://pubs.rsc.org/en/content/articlehtml/2022/sm/d1sm01400e",
        img: "/pub/2022-Schildknecht3.jpg",
      },
      {
        title: "A DNA repair pathway can regulate transcriptional noise to promote cell fate transitions",
        authors: "Ravi V Desai, Xinyue Chen, Benjamin Martin, Sonali Chaturvedi, Dong Woo Hwang, Weihan Li, Chen Yu, Sheng Ding, Matt Thomson, Robert H Singer, Robert A Coleman, Maike MK Hansen, Leor S Weinberger",
        venue: "Science",
        link: "https://www.science.org/doi/abs/10.1126/science.abc6506",
        img: "/pub/2022-Desa2i.jpg",
      },
    ],
  },
  {
    year: "2021",
    items: [
      {
        title: "Persistent fluid flows defined by active matter boundaries",
        authors: "Zijie Qu, Dominik Schildknecht, Shahriar Shadkhoo, Enrique Amaya, Jialong Jiang, Heun Jin Lee, David Larios, Fan Yang, Rob Phillips, Matt Thomson",
        venue: "Communications Physics",
        link: "https://www.nature.com/articles/s42005-021-00703-3",
      },
      {
        title: "Deep parallel characterization of AAV tropism and AAV-mediated transcriptional changes via single-cell RNA sequencing",
        authors: "David Brown, Michael Altermatt, Tatyana Dobreva, Sisi Chen, Alexander Wang, Matt Thomson, Viviana Gradinaru",
        venue: "Frontiers in Immunology",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8574206/",
      },
      {
        title: "Linear Transformations in Autoencoder Latent Space Predict Time Translations in Active Matter System",
        authors: "Enrique Amaya, Shahriar Shadkhoo, Dominik Schildknecht, Matt Thomson",
        venue: "NeurIPS AI for Science",
        link: "https://openreview.net/forum?id=ZDBDTHSoMDU",
      },
      {
        title: "Phenomenological model of motility by spatiotemporal modulation of active interactions",
        authors: "Dominik Schildknecht, Matt Thomson",
        venue: "New Journal of Physics",
        link: "https://doi.org/10.1088/1367-2630/ac1144",
      },
      {
        title: "Active feature selection discovers minimal gene-sets for classifying cell-types and disease states in single-cell mRNA-seq data",
        authors: "Xiaoqiao Chen, Sisi Chen, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2106.08317.pdf",
      },
      {
        title: "Solving hybrid machine learning tasks by traversing weight space geodesics",
        authors: "Guruprasad Raghavan, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/pdf/2106.02793.pdf",
      },
    ],
  },
  {
    year: "2020",
    items: [
      {
        title: "Sparsifying Networks by Traversing Geodesics",
        authors: "Guruprasad Raghavan, Matt Thomson",
        venue: "NeurIPS 2020 Workshop (DiffGeo4DL)",
        link: "https://arxiv.org/pdf/2012.09605.pdf",
      },
      {
        title: "Developmental clock and mechanism of de novo polarization of the mouse embryo",
        authors: "Meng Zhu, Jake Cornwall-Scoones, Peizhe Wang, Charlotte E. Handford, Jie Na, Matt Thomson, Magdalena Zernicka-Goetz",
        venue: "Science",
        link: "https://science.sciencemag.org/content/370/6522/eabd2703",
      },
      {
        title: "Single cell profiling of capillary blood enables out of clinic human immunity studies",
        authors: "Tatyana Dobreva, David Brown, Jong Hwee Park, Matt Thomson",
        venue: "Scientific Reports",
        link: "https://www.nature.com/articles/s41598-020-77073-3",
      },
      {
        title: "Dissecting heterogeneous cell populations across drug and disease conditions with PopAlign",
        authors: "Sisi Chen, Paul Rivaud, Jong H. Park, Tiffany Tsou, Emeric Charles, John R. Haliburton, Flavia Pichiorri, Matt Thomson",
        venue: "PNAS",
        link: "https://www.pnas.org/content/117/46/28784/tab-article-info",
      },
      {
        title: "Programming Boundary Deformation Patterns in Active Networks",
        authors: "Zijie Qu, Jialong Jiang, Heun Jin Lee, Rob Phillips, Shahriar Shadkhoo, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/abs/2101.08464",
      },
      {
        title: "Self-organization of multi-layer spiking neural networks",
        authors: "Guruprasad Raghavan, Cong Lin, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/abs/2006.06902",
      },
      {
        title: "Geometric algorithms for predicting resilience and recovering damage in neural networks",
        authors: "Guruprasad Raghavan, Jiayi Li, Matt Thomson",
        venue: "arXiv preprint",
        link: "https://arxiv.org/abs/2005.11603",
      },
    ],
  },
  {
    year: "2019-2008",
    items: [
      {
        title: "Highly Multiplexed Single-Cell RNA-seq for Defining Cell Population and Transcriptional Spaces",
        authors: "Jase Gehring, Jong Hwee Park, Sisi Chen, Matthew Thomson, Lior Pachter",
        venue: "Nature Biotechnology, 38, 35–38 (2019)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20181030-145533155",
      },
      {
        title: "Controlling Organization and Forces in Active Matter Through Optically-Defined Boundaries",
        authors: "Tyler D. Ross, Heun Jin Lee, Zijie Qu, Rachel A. Banks, Rob Phillips, Matt Thomson",
        venue: "Nature, 572, 224–229 (2019)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20190102-092232993",
      },
      {
        title: "Neural networks grown and self-organized by noise",
        authors: "Guruprasad Raghavan, Matt Thomson",
        venue: "NeurIPS (2019)",
        link: "https://papers.nips.cc/paper/8465-neural-networks-grown-and-self-organized-by-noise.pdf",
      },
      {
        title: "Adult Neurogenesis Is Sustained by Symmetric Self-Renewal and Differentiation",
        authors: "Kirsten Obernier, Arantxa Cebrian-Silla, Matthew Thomson, et al., Arturo Alvarez-Buylla",
        venue: "Cell Stem Cell, 22(2), 221–234 (2018)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20180202-090924087",
      },
      {
        title: "Engineering Customized Cell Sensing and Response Behaviors Using Synthetic Notch Receptors",
        authors: "Leonardo Morsut, Kole T. Roybal, Xin Xiong, Russell M. Gordley, Scott M. Coyle, Matthew Thomson, Wendell A. Lim",
        venue: "Cell, 164(4), 780–791 (2016)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20170217-155108197",
      },
      {
        title: "Transcription Factor Competition Allows Embryonic Stem Cells to Distinguish Authentic Signals from Noise",
        authors: "Cameron Sokolik, Yanxia Liu, David Bauer, Jade McPherson, Michael Broeker, Graham Heimberg, Lei S. Qi, David A. Sivak, Matt Thomson",
        venue: "Cell Systems, 1(2), 117–129 (2015)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20170206-125245319",
      },
      {
        title: "Pluripotency Factors in Embryonic Stem Cells Regulate Differentiation into Germ Layers",
        authors: "Matt Thomson, Siyuan John Liu, Ling-Nan Zou, Zack Smith, Alexander Meissner, Sharad Ramanathan",
        venue: "Cell, 145(6), 875–889 (2011)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20170127-224411366",
      },
      {
        title: "Unlimited multistability in multisite phosphorylation systems",
        authors: "Matthew Thomson, Jeremy Gunawardena",
        venue: "Nature, 460(7252), 274–277 (2009)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20170206-154848538",
      },
      {
        title: "An embryonic stem cell–like gene expression signature in poorly differentiated aggressive human tumors",
        authors: "Ittai Ben-Porath, Matthew W. Thomson, Vincent J. Carey, Ruping Ge, George W. Bell, Aviv Regev, Robert A. Weinberg",
        venue: "Nature Genetics, 40(5), 499–507 (2008)",
        link: "http://resolver.caltech.edu/CaltechAUTHORS:20170217-132836548",
      },
    ],
  },
]
