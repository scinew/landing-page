export type AvailabilityStatus = "ga" | "beta" | "preview";

export type ModelTier =
  | "foundation"
  | "enhanced"
  | "advanced"
  | "enterprise"
  | "premium"
  | "lightweight"
  | "specialized";

export interface OculusModel {
  id: string;
  name: string;
  version: string;
  badge: string;
  tier: ModelTier;
  description: string;
  contextWindowTokens: number;
  contextWindowLabel: string;
  pricing: {
    input: number;
    output: number;
  };
  performance: {
    accuracy: string;
    latency: string;
    throughput: string;
  };
  performanceScore: number;
  capabilities: string[];
  useCases: string[];
  categories: string[];
  rateLimit: string;
  rateLimits: {
    rpm: number;
    tpm: number;
    burst: number;
  };
  availability: AvailabilityStatus;
  availabilityLabel: string;
  availabilitySla: string;
  releaseDate: string;
  maxImageSize?: string;
  recommendedOrder: number;
}

export const SITE_MODELS: OculusModel[] = [
  {
    id: "oculus-1-0125",
    name: "Oculus 1.0",
    version: "0125",
    badge: "Foundation Model",
    tier: "foundation",
    description: "General-purpose vision model optimized for speed and efficiency. Perfect for getting started with vision AI.",
    contextWindowTokens: 8192,
    contextWindowLabel: "8K tokens",
    pricing: {
      input: 0.5,
      output: 1.5,
    },
    performance: {
      accuracy: "98.7%",
      latency: "85ms",
      throughput: "12K/sec",
    },
    performanceScore: 987,
    capabilities: [
      "Image classification",
      "Object detection",
      "Face recognition",
      "Content moderation",
      "Basic scene understanding",
    ],
    useCases: [
      "Social media content filtering",
      "E-commerce product categorization",
      "Basic security monitoring",
      "Photo organization",
    ],
    categories: ["general", "lightweight"],
    rateLimit: "60 req/min • 500k tokens/min",
    rateLimits: {
      rpm: 60,
      tpm: 500_000,
      burst: 10,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.5%",
    releaseDate: "2025-01-25",
    maxImageSize: "4096x4096",
    recommendedOrder: 1,
  },
  {
    id: "oculus-1.5-0503",
    name: "Oculus 1.5",
    version: "0503",
    badge: "Enhanced Model",
    tier: "enhanced",
    description: "Advanced vision with multi-modal support and improved accuracy for complex visual understanding tasks.",
    contextWindowTokens: 32768,
    contextWindowLabel: "32K tokens",
    pricing: {
      input: 2,
      output: 6,
    },
    performance: {
      accuracy: "99.4%",
      latency: "120ms",
      throughput: "8K/sec",
    },
    performanceScore: 994,
    capabilities: [
      "Scene understanding",
      "Semantic segmentation",
      "Visual reasoning",
      "Multi-modal analysis",
      "Advanced object tracking",
      "Image captioning",
    ],
    useCases: [
      "Autonomous vehicle perception",
      "Medical image analysis",
      "Advanced retail analytics",
      "Video content understanding",
    ],
    categories: ["general", "multimodal"],
    rateLimit: "100 req/min • 900k tokens/min",
    rateLimits: {
      rpm: 100,
      tpm: 900_000,
      burst: 18,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.7%",
    releaseDate: "2025-05-03",
    maxImageSize: "8192x8192",
    recommendedOrder: 2,
  },
  {
    id: "oculus-2.0-0615",
    name: "Oculus 2.0",
    version: "0615",
    badge: "Enhanced Reasoning",
    tier: "advanced",
    description: "Enhanced reasoning capabilities with improved contextual understanding and multi-step visual analysis.",
    contextWindowTokens: 65536,
    contextWindowLabel: "64K tokens",
    pricing: {
      input: 3.5,
      output: 10.5,
    },
    performance: {
      accuracy: "99.6%",
      latency: "145ms",
      throughput: "6.5K/sec",
    },
    performanceScore: 996,
    capabilities: [
      "Complex visual reasoning",
      "Multi-step analysis",
      "Contextual understanding",
      "Relationship detection",
      "Advanced pattern recognition",
      "Temporal analysis",
    ],
    useCases: [
      "Scientific research imaging",
      "Quality control systems",
      "Advanced surveillance",
      "Document understanding",
    ],
    categories: ["general"],
    rateLimit: "150 req/min • 1.4M tokens/min",
    rateLimits: {
      rpm: 150,
      tpm: 1_400_000,
      burst: 24,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.8%",
    releaseDate: "2025-06-15",
    maxImageSize: "8192x8192",
    recommendedOrder: 3,
  },
  {
    id: "oculus-2.5-0728",
    name: "Oculus 2.5",
    version: "0728",
    badge: "Multimodal Expert",
    tier: "advanced",
    description: "Multimodal capabilities combining vision, text, and audio understanding for comprehensive analysis.",
    contextWindowTokens: 131072,
    contextWindowLabel: "128K tokens",
    pricing: {
      input: 5,
      output: 15,
    },
    performance: {
      accuracy: "99.7%",
      latency: "180ms",
      throughput: "5K/sec",
    },
    performanceScore: 997,
    capabilities: [
      "Cross-modal understanding",
      "Vision-language tasks",
      "Audio-visual analysis",
      "Document OCR with understanding",
      "Video comprehension",
      "Interactive Q&A",
    ],
    useCases: [
      "Educational content analysis",
      "Media production workflows",
      "Accessibility applications",
      "Interactive virtual assistants",
    ],
    categories: ["multimodal"],
    rateLimit: "200 req/min • 1.8M tokens/min",
    rateLimits: {
      rpm: 200,
      tpm: 1_800_000,
      burst: 32,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.8%",
    releaseDate: "2025-07-28",
    maxImageSize: "16Kx16K",
    recommendedOrder: 4,
  },
  {
    id: "oculus-3.0-0901",
    name: "Oculus 3.0",
    version: "0901",
    badge: "Advanced Intelligence",
    tier: "advanced",
    description: "State-of-the-art vision intelligence with breakthrough performance across all benchmarks.",
    contextWindowTokens: 262144,
    contextWindowLabel: "256K tokens",
    pricing: {
      input: 7.5,
      output: 22.5,
    },
    performance: {
      accuracy: "99.8%",
      latency: "210ms",
      throughput: "4K/sec",
    },
    performanceScore: 998,
    capabilities: [
      "Human-level scene understanding",
      "Fine-grained categorization",
      "3D reconstruction from 2D",
      "Advanced anomaly detection",
      "Predictive visual analysis",
      "Multi-image reasoning",
    ],
    useCases: [
      "Advanced robotics",
      "Autonomous systems",
      "Industrial automation",
      "Research applications",
    ],
    categories: ["general", "enterprise"],
    rateLimit: "250 req/min • 2.2M tokens/min",
    rateLimits: {
      rpm: 250,
      tpm: 2_200_000,
      burst: 36,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.9%",
    releaseDate: "2025-09-01",
    maxImageSize: "16Kx16K",
    recommendedOrder: 5,
  },
  {
    id: "oculus-3.5-1015",
    name: "Oculus 3.5",
    version: "1015",
    badge: "Enterprise Grade",
    tier: "enterprise",
    description: "Enterprise-focused model with enhanced security, compliance features, and guaranteed SLAs.",
    contextWindowTokens: 524288,
    contextWindowLabel: "512K tokens",
    pricing: {
      input: 10,
      output: 30,
    },
    performance: {
      accuracy: "99.9%",
      latency: "195ms",
      throughput: "3.5K/sec",
    },
    performanceScore: 999,
    capabilities: [
      "Compliance-aware processing",
      "Data sovereignty support",
      "Audit trail generation",
      "Privacy-preserving analysis",
      "Custom fine-tuning",
      "Batch processing optimization",
    ],
    useCases: [
      "Healthcare diagnostics",
      "Financial services",
      "Legal document processing",
      "Regulated industries",
    ],
    categories: ["enterprise"],
    rateLimit: "500 req/min • 3M tokens/min",
    rateLimits: {
      rpm: 500,
      tpm: 3_000_000,
      burst: 48,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.95%",
    releaseDate: "2025-10-15",
    maxImageSize: "32Kx32K",
    recommendedOrder: 6,
  },
  {
    id: "oculus-4.0-1120",
    name: "Oculus 4.0",
    version: "1120",
    badge: "Cutting Edge",
    tier: "premium",
    description: "The most advanced vision model available, pushing the boundaries of what's possible with AI vision.",
    contextWindowTokens: 1_048_576,
    contextWindowLabel: "1M tokens",
    pricing: {
      input: 15,
      output: 45,
    },
    performance: {
      accuracy: "99.95%",
      latency: "250ms",
      throughput: "2.5K/sec",
    },
    performanceScore: 9995,
    capabilities: [
      "Near-human visual understanding",
      "Real-time video analysis",
      "Complex multi-image reasoning",
      "Advanced 3D scene reconstruction",
      "Predictive modeling",
      "Zero-shot learning capabilities",
    ],
    useCases: [
      "Cutting-edge research",
      "Advanced AI applications",
      "Next-gen autonomous systems",
      "Space exploration",
    ],
    categories: ["general", "enterprise"],
    rateLimit: "1000 req/min • 4.5M tokens/min",
    rateLimits: {
      rpm: 1000,
      tpm: 4_500_000,
      burst: 64,
    },
    availability: "beta",
    availabilityLabel: "Beta",
    availabilitySla: "99.95%",
    releaseDate: "2025-11-20",
    maxImageSize: "64Kx64K",
    recommendedOrder: 7,
  },
  {
    id: "oculus-pro-1.0",
    name: "Oculus Pro 1.0",
    version: "1.0",
    badge: "Professional Tier",
    tier: "enterprise",
    description: "Professional-grade model optimized for production workloads with consistent performance.",
    contextWindowTokens: 131072,
    contextWindowLabel: "128K tokens",
    pricing: {
      input: 6,
      output: 18,
    },
    performance: {
      accuracy: "99.5%",
      latency: "160ms",
      throughput: "5.5K/sec",
    },
    performanceScore: 995,
    capabilities: [
      "Production-optimized inference",
      "Consistent performance",
      "Advanced caching",
      "Batch optimization",
      "Real-time streaming",
      "Custom deployment options",
    ],
    useCases: [
      "Production applications",
      "High-volume processing",
      "Real-time systems",
      "Mission-critical applications",
    ],
    categories: ["enterprise", "general"],
    rateLimit: "300 req/min • 2M tokens/min",
    rateLimits: {
      rpm: 300,
      tpm: 2_000_000,
      burst: 40,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.9%",
    releaseDate: "2025-08-10",
    maxImageSize: "16Kx16K",
    recommendedOrder: 8,
  },
  {
    id: "oculus-pro-2.0",
    name: "Oculus Pro 2.0",
    version: "2.0",
    badge: "Advanced Pro",
    tier: "enterprise",
    description: "Advanced professional model with premium features for demanding production environments.",
    contextWindowTokens: 262144,
    contextWindowLabel: "256K tokens",
    pricing: {
      input: 12,
      output: 36,
    },
    performance: {
      accuracy: "99.85%",
      latency: "175ms",
      throughput: "4.2K/sec",
    },
    performanceScore: 9985,
    capabilities: [
      "Ultra-reliable inference",
      "Advanced monitoring",
      "Custom model tuning",
      "Multi-region deployment",
      "Priority processing",
      "Advanced analytics",
    ],
    useCases: [
      "Enterprise-scale deployments",
      "Global applications",
      "Critical infrastructure",
      "High-stakes decision systems",
    ],
    categories: ["enterprise"],
    rateLimit: "750 req/min • 3.5M tokens/min",
    rateLimits: {
      rpm: 750,
      tpm: 3_500_000,
      burst: 56,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.95%",
    releaseDate: "2025-10-01",
    maxImageSize: "32Kx32K",
    recommendedOrder: 9,
  },
  {
    id: "oculus-ultra-1.0",
    name: "Oculus Ultra",
    version: "1.0",
    badge: "Premium Tier",
    tier: "premium",
    description: "Premium tier model with the highest accuracy and most advanced capabilities available.",
    contextWindowTokens: 2_097_152,
    contextWindowLabel: "2M tokens",
    pricing: {
      input: 20,
      output: 60,
    },
    performance: {
      accuracy: "99.98%",
      latency: "280ms",
      throughput: "2K/sec",
    },
    performanceScore: 9998,
    capabilities: [
      "Unmatched accuracy",
      "Complex reasoning chains",
      "Advanced world modeling",
      "Multi-domain expertise",
      "Adaptive learning",
      "Self-improving capabilities",
    ],
    useCases: [
      "Breakthrough research",
      "Critical decision systems",
      "Advanced medical diagnosis",
      "Aerospace applications",
    ],
    categories: ["general", "enterprise"],
    rateLimit: "2000 req/min • 6M tokens/min",
    rateLimits: {
      rpm: 2000,
      tpm: 6_000_000,
      burst: 80,
    },
    availability: "preview",
    availabilityLabel: "Preview",
    availabilitySla: "99.99%",
    releaseDate: "2025-11-30",
    maxImageSize: "128Kx128K",
    recommendedOrder: 10,
  },
  {
    id: "oculus-mini-1.0",
    name: "Oculus Mini",
    version: "1.0",
    badge: "Lightweight & Fast",
    tier: "lightweight",
    description: "Ultra-fast, lightweight model optimized for edge devices and low-latency applications.",
    contextWindowTokens: 4096,
    contextWindowLabel: "4K tokens",
    pricing: {
      input: 0.25,
      output: 0.75,
    },
    performance: {
      accuracy: "97.8%",
      latency: "35ms",
      throughput: "25K/sec",
    },
    performanceScore: 978,
    capabilities: [
      "Ultra-low latency",
      "Edge deployment",
      "Mobile optimization",
      "Efficient inference",
      "Basic classification",
      "Simple object detection",
    ],
    useCases: [
      "Mobile applications",
      "IoT devices",
      "Real-time camera apps",
      "Edge computing",
    ],
    categories: ["lightweight"],
    rateLimit: "120 req/min • 700k tokens/min",
    rateLimits: {
      rpm: 120,
      tpm: 700_000,
      burst: 20,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.7%",
    releaseDate: "2025-07-15",
    maxImageSize: "2048x2048",
    recommendedOrder: 11,
  },
  {
    id: "oculus-vision-1.0",
    name: "Oculus Vision",
    version: "1.0",
    badge: "Vision Specialist",
    tier: "specialized",
    description: "Specialized model fine-tuned specifically for advanced vision tasks and image understanding.",
    contextWindowTokens: 65536,
    contextWindowLabel: "64K tokens",
    pricing: {
      input: 4.5,
      output: 13.5,
    },
    performance: {
      accuracy: "99.75%",
      latency: "130ms",
      throughput: "6K/sec",
    },
    performanceScore: 9975,
    capabilities: [
      "Expert image analysis",
      "Fine-grained classification",
      "Visual quality assessment",
      "Style transfer",
      "Image enhancement",
      "Specialized domain expertise",
    ],
    useCases: [
      "Photography applications",
      "Art analysis",
      "Fashion and design",
      "Visual quality control",
    ],
    categories: ["vision", "multimodal"],
    rateLimit: "180 req/min • 1.2M tokens/min",
    rateLimits: {
      rpm: 180,
      tpm: 1_200_000,
      burst: 28,
    },
    availability: "ga",
    availabilityLabel: "Generally Available",
    availabilitySla: "99.8%",
    releaseDate: "2025-09-20",
    maxImageSize: "16Kx16K",
    recommendedOrder: 12,
  },
];

export function getModelById(id: string): OculusModel | undefined {
  return SITE_MODELS.find((model) => model.id === id);
}

export function getModelsByCategory(category: string): OculusModel[] {
  return SITE_MODELS.filter((model) => model.categories.includes(category));
}
