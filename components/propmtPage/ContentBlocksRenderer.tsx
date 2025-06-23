// components/course/ContentBlocksRenderer.tsx

'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeMathjax from 'rehype-mathjax'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export function ContentBlocksRenderer({ contentBlocks }: { contentBlocks: any[] }) {
  const [copied, setCopied] = useState(false)

  if (!contentBlocks || contentBlocks.length === 0) {
    return <p className="text-sm text-muted-foreground">Generating content...</p>
  }

  console.log(contentBlocks)

  return (
    <div className="space-y-6">
      {contentBlocks
        .sort((a, b) => a.order - b.order)
        .map((block, index) => {
          switch (block.type) {
            case 'TEXT':
            case 'MATH':
              return (
                <motion.div
                  key={block.id || index}
                  className="prose dark:prose-invert max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: block.order * 0.1 }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeMathjax]}
                  >
                    {block.text || ''}
                  </ReactMarkdown>
                </motion.div>
              )

            case 'CODE':
              return (
                <motion.div
                  key={block.id || index}
                  className="relative rounded-xl overflow-hidden text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: block.order * 0.1 }}
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(block.code || '')
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="absolute top-2 right-2 z-10 rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary/80 transition"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>

                  <SyntaxHighlighter
                    language="plaintext"
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                      background: '#1e1e1e',
                      fontSize: '0.875rem',
                      padding: '1rem',
                      borderRadius: '0.75rem'
                    }}
                    lineNumberStyle={{ color: '#6a9955' }}
                  >
                    {block.code || ''}
                  </SyntaxHighlighter>
                </motion.div>
              )

            case 'GRAPH':
              return (
                <motion.div
                  key={block.id || index}
                  className="w-full h-64"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: block.order * 0.1 }}
                >
                  <ResponsiveContainer>
                    <LineChart data={block.graph?.data || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={block.graph?.xKey || 'x'} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={block.graph?.yKey || 'y'}
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )

            default:
              return (
                <p key={block.id || index} className="text-muted-foreground">
                  Unknown block type: {block.type}
                </p>
              )
          }
        })}
    </div>
  )
}
