export type Product = {
  title: string;
  price: string;
  desc: string;
  img: string;
  category: 'Anime' | 'Movies' | 'Custom';
  badge?: string;
  /** Show on the home page "Shadow Sets" section. */
  featured?: boolean;
  /** URL slug for /shop/[slug]. Auto-generated from title if empty. */
  slug?: string;
  /** Long description shown on the slug page. */
  details?: string;
  /** Spec table shown on the slug page. */
  size?: string;
  depth?: string;
  material?: string;
  finish?: string;
  stock?: 'In Stock' | 'Made to Order' | 'Sold Out';
};

export type Article = {
  cat: string;
  title: string;
  img: string;
  excerpt?: string;
};

export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: 'What exactly is a Shadow Frame?',
    a: 'A 3D-printed relief frame, 15x20cm, 3CM deep. HueForge layered. Matte black. It casts real shadows on your wall when light hits it. Not a flat poster. Not a keychain. Wall art with physical depth.',
  },
  {
    q: 'How long does shipping take?',
    a: "Every frame is printed, finished, and QC'd in our Chennai lab, then shipped in a hard box. Domestic orders arrive in 3-5 days. International tracked shipping takes 7-14 days depending on destination.",
  },
  {
    q: 'How does the custom lab work?',
    a: 'Send us your art or idea on Instagram @print_.trek. We design, print, and ship your custom shadow frame within 24 hours. One idea, one frame, one day.',
  },
  {
    q: 'Why matte black and not gloss?',
    a: 'Gloss reflects everything — your monitor, your LED strips, your room. Matte black absorbs light. The shadows from the 3CM depth do the talking. Gallery finish, not plastic.',
  },
  {
    q: 'Are these official anime products?',
    a: 'No. We design original silhouettes, masks, and scenes inspired by the aesthetic. IP-safe names. We do not sell licensed characters. Custom lab frames use your own art only.',
  },
];

export const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];
