import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AMPLIFY
            <span className="text-blue-600">.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionizing answer sheet evaluation through intelligent textbook-based assessment
          </p>
          <Link 
            href="/upload-pdf" 
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-blue-600" />,
                title: "Upload Answer Sheets",
                description: "Simply upload student answer sheets in PDF format for evaluation"
              },
              {
                icon: <Brain className="h-8 w-8 text-blue-600" />,
                title: "AI-Powered Analysis",
                description: "Our system compares answers with university textbook content"
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
                title: "Accurate Grading",
                description: "Receive detailed evaluation reports with accurate scoring"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AMPLIFY</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Time-saving automated evaluation process",
              "Consistent and unbiased grading",
              "Detailed feedback and analysis",
              "Textbook-aligned assessment",
              "Scalable for large batches",
              "Easy to use interface"
            ].map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Transform your grading process with AMPLIFY today
          </p>
          <Link 
            href="/upload-pdf"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            Try AMPLIFY Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
