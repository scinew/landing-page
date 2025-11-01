"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Clock,
  Code,
  DollarSign,
  Gauge,
  GitCompare,
  Globe,
  Layers,
  Shield,
  Zap,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { SITE_MODELS } from "@/lib/models";

const PRICING_PLANS = [
  {
    name: "Developer",
    price: "$99",
    period: "/month",
    tokens: "50M tokens included",
    description: "Prototype quickly with entry-level and lightweight models.",
    includes: [
      "Access to Oculus Mini & Oculus 1.0",
      "Shared GPU inference",
      "Community + email support",
    ],
  },
  {
    name: "Growth",
    price: "$399",
    period: "/month",
    tokens: "250M tokens included",
    description: "Scale to production with enhanced reasoning and specialist models.",
    includes: [
      "Oculus 1.5, 2.0 & Vision",
      "Low-latency streaming endpoints",
      "Priority support",
    ],
  },
  {
    name: "Professional",
    price: "$899",
    period: "/month",
    tokens: "600M tokens included",
    description: "Enterprise-ready package with multimodal and Pro tiers.",
    includes: [
      "Oculus 2.5, Pro 1.0 & Pro 2.0",
      "Dedicated success manager",
      "Fine-tuning credits",
    ],
  },
  {
    name: "Enterprise & Ultra",
    price: "Custom",
    period: "",
    tokens: "Volume-based",
    description: "Mission-critical deployments with Oculus 3.x, 4.0, and Ultra tiers.",
    includes: [
      "Private cloud or on-prem options",
      "99.95%+ SLA",
      "White-glove onboarding",
    ],
  },
];

const MIGRATION_GUIDES = [
  {
    from: "oculus-1-0125",
    to: "oculus-2.0-0615",
    summary: "Upgrade to enhanced reasoning without changing payload formats.",
    steps: [
      "Increase `context_window` to 64K tokens for deeper analysis.",
      "Tune retry policies for 145ms average latency.",
      "Capture new reasoning traces emitted in responses.",
    ],
  },
  {
    from: "oculus-2.0-0615",
    to: "oculus-2.5-0728",
    summary: "Enable multimodal analysis across vision, text, and audio streams.",
    steps: [
      "Request multimodal access in the console.",
      "Send combined payloads under `inputs` with typed content.",
      "Validate token budgets up to 128K contexts.",
    ],
  },
  {
    from: "oculus-3.0-0901",
    to: "oculus-3.5-1015",
    summary: "Adopt enterprise controls with compliance guardrails.",
    steps: [
      "Provision tenant isolation headers for regulated workloads.",
      "Enable audit streaming to your SIEM endpoint.",
      "Roll out gradually with dual-write validation.",
    ],
  },
  {
    from: "oculus-pro-2.0",
    to: "oculus-4.0-1120",
    summary: "Unlock premium performance and 1M+ token contexts.",
    steps: [
      "Engage Oculus Solutions for quota planning.",
      "Recalibrate accuracy thresholds with new benchmarks.",
      "Adopt predictive webhooks for proactive interventions.",
    ],
  },
];

const BENCHMARK_MODEL_IDS = ["oculus-1-0125", "oculus-2.0-0615", "oculus-3.5-1015", "oculus-4.0-1120", "oculus-ultra-1.0"] as const;

const formatCurrency = (value: number) => `${value.toFixed(2)}`;

export default function Documentation() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          asChild
          variant="outline"
          className="mb-8 border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Badge className="mb-6 bg-white text-black hover:bg-gray-200">
            <BookOpen className="w-3 h-3 mr-2" />
            Documentation
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Oculus AI Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Complete guide to integrating and using Oculus AI vision models in your applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Navigation</h3>
              <a href="#getting-started" className="block text-white hover:text-gray-300 transition-colors py-2">Getting Started</a>
              <a href="#authentication" className="block text-white hover:text-gray-300 transition-colors py-2">Authentication</a>
              <a href="#models" className="block text-white hover:text-gray-300 transition-colors py-2">Models</a>
              <a href="#pricing" className="block text-white hover:text-gray-300 transition-colors py-2">Pricing</a>
              <a href="#benchmarks" className="block text-white hover:text-gray-300 transition-colors py-2">Benchmarks</a>
              <a href="#comparison" className="block text-white hover:text-gray-300 transition-colors py-2">Comparison</a>
              <a href="#migration" className="block text-white hover:text-gray-300 transition-colors py-2">Migration Guides</a>
              <a href="#rate-limits" className="block text-white hover:text-gray-300 transition-colors py-2">Rate Limits</a>
              <a href="#api-reference" className="block text-white hover:text-gray-300 transition-colors py-2">API Reference</a>
              <a href="#examples" className="block text-white hover:text-gray-300 transition-colors py-2">Examples</a>
              <a href="#capabilities" className="block text-white hover:text-gray-300 transition-colors py-2">Capabilities</a>
              <a href="#best-practices" className="block text-white hover:text-gray-300 transition-colors py-2">Best Practices</a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-16">
            <section id="getting-started">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">Installation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">Install the Oculus AI SDK using npm or pip:</p>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div># JavaScript/TypeScript</div>
                          <div>npm install @oculus-ai/sdk</div>
                          <div className="mt-4"># Python</div>
                          <div>pip install oculus-ai</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Start</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">Get up and running in minutes:</p>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div>import {"{ OculusAI }"} from '@oculus-ai/sdk';</div>
                          <div className="mt-2">const client = new OculusAI({"{"}</div>
                          <div>  apiKey: process.env.OCULUS_API_KEY</div>
                          <div>{"}"});</div>
                          <div className="mt-2">const result = await client.analyze({"{"}</div>
                          <div>  model: 'oculus-1-0125',</div>
                          <div>  image: imageUrl</div>
                          <div>{"}"});</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </section>

            <section id="authentication">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Authentication</h2>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white">API Keys</CardTitle>
                    <CardDescription className="text-gray-400">
                      Secure your API access with authentication keys
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">
                      All API requests require authentication using an API key. Include your API key in the request headers:
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                      <code className="text-sm text-gray-300">
                        <div>Authorization: Bearer YOUR_API_KEY</div>
                      </code>
                    </div>
                    <div className="flex items-start space-x-3 mt-4">
                      <Shield className="w-5 h-5 text-white mt-1" />
                      <div>
                        <p className="font-semibold text-white mb-1">Keep your API keys secure</p>
                        <p className="text-gray-400">Never expose your API keys in client-side code or public repositories.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </section>

            <section id="models">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Available Models</h2>
                <p className="text-gray-400 mb-8">
                  Oculus AI offers a comprehensive suite of 12 vision models, each optimized for different use cases and performance requirements.{" "}
                  <Link href="/models" className="text-white hover:underline inline-flex items-center gap-1">
                    View all 12 models <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <Badge className="w-fit mb-4 bg-white text-black">Foundation Model</Badge>
                      <CardTitle className="text-white text-2xl">oculus-1-0125</CardTitle>
                      <CardDescription className="text-gray-400">
                        General-purpose vision model
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy</span>
                          <span className="text-white font-semibold">98.7%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Latency</span>
                          <span className="text-white font-semibold">&lt;100ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Max Image Size</span>
                          <span className="text-white font-semibold">4096x4096</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-2">Best for:</p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• Image classification</li>
                          <li>• Object detection</li>
                          <li>• Face recognition</li>
                          <li>• Content moderation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <Badge className="w-fit mb-4 bg-white text-black">Enhanced Model</Badge>
                      <CardTitle className="text-white text-2xl">oculus-1.5-0503</CardTitle>
                      <CardDescription className="text-gray-400">
                        Advanced vision with multi-modal support
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy</span>
                          <span className="text-white font-semibold">99.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Latency</span>
                          <span className="text-white font-semibold">&lt;150ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Max Image Size</span>
                          <span className="text-white font-semibold">8192x8192</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-2">Best for:</p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• Scene understanding</li>
                          <li>• Semantic segmentation</li>
                          <li>• Visual reasoning</li>
                          <li>• Multi-modal analysis</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </section>

            <section id="api-reference">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">POST</Badge>
                        <code className="text-white">/v1/analyze</code>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        Analyze an image using a specified model
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Request Body</h4>
                        <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                          <code className="text-sm text-gray-300">
                            <div>{"{"}</div>
                            <div>  "model": "oculus-1-0125",</div>
                            <div>  "image": "https://example.com/image.jpg",</div>
                            <div>  "tasks": ["classification", "detection"],</div>
                            <div>  "options": {"{"}</div>
                            <div>    "confidence_threshold": 0.8</div>
                            <div>  {"}"}</div>
                            <div>{"}"}</div>
                          </code>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Response</h4>
                        <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                          <code className="text-sm text-gray-300">
                            <div>{"{"}</div>
                            <div>  "id": "req_123abc",</div>
                            <div>  "model": "oculus-1-0125",</div>
                            <div>  "results": {"{"}</div>
                            <div>    "classifications": [...]</div>
                            <div>    "detections": [...]</div>
                            <div>  {"}"},</div>
                            <div>  "processing_time_ms": 87</div>
                            <div>{"}"}</div>
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">GET</Badge>
                        <code className="text-white">/v1/models</code>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        List all available models and their capabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div>{"{"}</div>
                          <div>  "models": [</div>
                          <div>    {"{"}</div>
                          <div>      "id": "oculus-1-0125",</div>
                          <div>      "name": "Oculus 1.0",</div>
                          <div>      "capabilities": ["classification", "detection"]</div>
                          <div>    {"}"},</div>
                          <div>    ...</div>
                          <div>  ]</div>
                          <div>{"}"}</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </section>

            <section id="examples">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Usage Examples</h2>
                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Image Classification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div>const result = await client.analyze({"{"}</div>
                          <div>  model: 'oculus-1-0125',</div>
                          <div>  image: 'path/to/image.jpg',</div>
                          <div>  tasks: ['classification']</div>
                          <div>{"}"});</div>
                          <div className="mt-2"></div>
                          <div>console.log(result.classifications);</div>
                          <div>// Output: [</div>
                          <div>//   {"{"} label: 'cat', confidence: 0.98 {"}"},</div>
                          <div>//   {"{"} label: 'pet', confidence: 0.95 {"}"}</div>
                          <div>// ]</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Object Detection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div>const result = await client.analyze({"{"}</div>
                          <div>  model: 'oculus-1.5-0503',</div>
                          <div>  image: imageBuffer,</div>
                          <div>  tasks: ['detection'],</div>
                          <div>  options: {"{"}</div>
                          <div>    confidence_threshold: 0.7</div>
                          <div>  {"}"}</div>
                          <div>{"}"});</div>
                          <div className="mt-2"></div>
                          <div>result.detections.forEach(obj =&gt; {"{"}</div>
                          <div>  console.log(`Found ${"{"}obj.label{"}"} at`, obj.bbox);</div>
                          <div>{"}"});</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Batch Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <code className="text-sm text-gray-300">
                          <div>const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];</div>
                          <div className="mt-2">const results = await client.batchAnalyze({"{"}</div>
                          <div>  model: 'oculus-1-0125',</div>
                          <div>  images: images,</div>
                          <div>  tasks: ['classification', 'detection']</div>
                          <div>{"}"});</div>
                          <div className="mt-2"></div>
                          <div>// Process results efficiently</div>
                          <div>results.forEach((result, index) =&gt; {"{"}</div>
                          <div>  console.log(`Image ${"{"}index + 1{"}"}:`, result);</div>
                          <div>{"}"});</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </section>

            <section id="capabilities">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Model Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: Eye, title: "Image Classification", description: "Categorize images into thousands of classes" },
                    { icon: Globe, title: "Object Detection", description: "Locate and identify multiple objects in images" },
                    { icon: Shield, title: "Face Recognition", description: "Detect and verify faces with high accuracy" },
                    { icon: Zap, title: "Scene Understanding", description: "Comprehend complex scenes and contexts" },
                    { icon: Code, title: "Semantic Segmentation", description: "Pixel-level image understanding" },
                    { icon: BookOpen, title: "Visual Q&A", description: "Answer questions about image content" },
                  ].map((capability) => (
                    <Card key={capability.title} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <CardHeader>
                        <capability.icon className="w-10 h-10 mb-3 text-white" />
                        <CardTitle className="text-white text-lg">{capability.title}</CardTitle>
                        <CardDescription className="text-gray-400">{capability.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </section>

            <section id="best-practices">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">Image Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-gray-300">
                      <p>• Use high-resolution images for better accuracy (minimum 224x224)</p>
                      <p>• Ensure proper lighting and avoid heavily compressed images</p>
                      <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-gray-300">
                      <p>• Use batch processing for multiple images to reduce latency</p>
                      <p>• Cache results when appropriate to minimize API calls</p>
                      <p>• Choose the right model for your use case (oculus-1 for speed, oculus-1.5 for accuracy)</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">Error Handling</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-gray-300">
                      <p>• Implement proper retry logic for transient failures</p>
                      <p>• Handle rate limiting with exponential backoff</p>
                      <p>• Validate input images before sending to the API</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </section>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-400 mb-6">
                Our support team is here to help you get the most out of Oculus AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Join Community
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
