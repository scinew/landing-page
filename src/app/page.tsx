"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Zap, Brain, Globe, Shield, Sparkles } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);
  const y1 = useTransform(smoothProgress, [0, 0.5], [0, 200]);
  const y2 = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const y3 = useTransform(smoothProgress, [0.2, 0.6], [0, 150]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Badge variant="outline" className="border-white/20 text-white hover:bg-white/10 px-4 py-2 text-sm">
              <Sparkles className="w-3 h-3 mr-2 inline" />
              Next-Gen Vision Intelligence
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            Oculus AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Unleashing the power of advanced vision models to see beyond the visible
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              View Documentation
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white/60 rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section with Parallax */}
      <motion.section 
        className="relative py-32 px-4 sm:px-6 lg:px-8"
        style={{ y: y1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose Oculus AI?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cutting-edge vision models designed for precision, speed, and scalability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "Advanced Vision", description: "State-of-the-art image recognition and analysis capabilities" },
              { icon: Zap, title: "Lightning Fast", description: "Optimized for real-time processing with minimal latency" },
              { icon: Brain, title: "AI-Powered", description: "Deep learning models trained on diverse datasets" },
              { icon: Globe, title: "Scalable", description: "Deploy anywhere from edge devices to cloud infrastructure" },
              { icon: Shield, title: "Secure", description: "Enterprise-grade security and privacy protection" },
              { icon: Sparkles, title: "Continuously Learning", description: "Models that improve and adapt over time" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full backdrop-blur-sm">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 mb-4 text-white" />
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Model 1: oculus-1-0125 */}
      <motion.section 
        className="relative py-32 px-4 sm:px-6 lg:px-8"
        style={{ y: y2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-white text-black hover:bg-gray-200">Foundation Model</Badge>
              <h2 className="text-5xl sm:text-6xl font-bold mb-6">oculus-1-0125</h2>
              <p className="text-xl text-gray-400 mb-8">
                Our foundational vision model, optimized for general-purpose image understanding 
                and classification tasks with exceptional accuracy.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">High Accuracy</h4>
                    <p className="text-gray-400">98.7% accuracy on standard benchmarks</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Fast Inference</h4>
                    <p className="text-gray-400">Sub-100ms response times at scale</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Versatile</h4>
                    <p className="text-gray-400">Supports multiple image formats and sizes</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-gray-200 group">
                Try oculus-1-0125
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-8 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-4">01</div>
                    <div className="text-2xl text-gray-400">Foundation</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Model 2: oculus-1.5-0503 */}
      <motion.section 
        className="relative py-32 px-4 sm:px-6 lg:px-8"
        style={{ y: y3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-8 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-4">1.5</div>
                    <div className="text-2xl text-gray-400">Enhanced</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-6 bg-white text-black hover:bg-gray-200">Enhanced Model</Badge>
              <h2 className="text-5xl sm:text-6xl font-bold mb-6">oculus-1.5-0503</h2>
              <p className="text-xl text-gray-400 mb-8">
                The next evolution in vision AI. Enhanced capabilities for complex scene 
                understanding, fine-grained object detection, and semantic analysis.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Enhanced Understanding</h4>
                    <p className="text-gray-400">Advanced scene comprehension and context awareness</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Multi-Modal</h4>
                    <p className="text-gray-400">Seamlessly integrates with text and audio inputs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Fine-Grained Detection</h4>
                    <p className="text-gray-400">Identifies subtle details and nuanced patterns</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-gray-200 group">
                Try oculus-1.5-0503
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Comparison Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Choose Your Model</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Both models are designed for excellence, optimized for different use cases
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-3xl mb-4">oculus-1-0125</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Perfect for standard vision tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Image classification",
                      "Object detection",
                      "Face recognition",
                      "Quality assurance",
                      "Content moderation",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-3xl mb-4">oculus-1.5-0503</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Advanced capabilities for complex tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Scene understanding",
                      "Multi-object tracking",
                      "Semantic segmentation",
                      "Visual reasoning",
                      "Cross-modal analysis",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Ready to See the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Start building with Oculus AI today. Join thousands of developers 
              leveraging the power of advanced vision intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg group">
                Get API Access
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Oculus AI</h3>
              <p className="text-gray-400">Advanced vision intelligence for the modern world.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Models</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Oculus AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
